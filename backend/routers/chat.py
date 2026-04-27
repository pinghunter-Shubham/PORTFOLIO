"""
Chat router — streaming RAG-powered AI clone endpoint.

POST /chat/message
  - Rate limited: 10 req/IP/hour (Redis counter)
  - Streams SSE tokens from Claude via the LLM service
  - Maintains per-session conversation history (Redis, TTL 30 min)
"""

import json
import logging
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse

from models import ChatRequest
from services.llm_service import stream_chat_response
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(tags=["Chat"])


async def _check_rate_limit(request: Request) -> None:
    """
    Enforce per-IP rate limiting using Redis.
    Raises HTTP 429 if the limit is exceeded.
    """
    from services.llm_service import get_redis

    ip = request.client.host if request.client else "unknown"
    key = f"rl:chat:{ip}"

    try:
        r = await get_redis()
        count = await r.incr(key)
        if count == 1:
            await r.expire(key, 3600)  # 1-hour window
        if count > settings.chat_rate_limit:
            logger.warning(f"Rate limit exceeded for IP: {ip}")
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later.",
            )
    except HTTPException:
        raise
    except Exception as e:
        # Redis failure is non-fatal — allow the request through
        logger.warning(f"Redis rate-limit check failed: {e}")


async def _sse_error(message: str):
    """Yield a single SSE error event."""
    yield f"data: {json.dumps({'type': 'error', 'message': message})}\n\n"


@router.post("/message")
async def chat_message(body: ChatRequest, request: Request) -> StreamingResponse:
    """
    Stream an AI response to a user message.

    The response is a Server-Sent Events stream. Each event has the shape:
        { "type": "token", "content": "..." }   — one token of the response
        { "type": "done" }                       — stream complete
        { "type": "error", "message": "..." }    — error occurred
    """
    await _check_rate_limit(request)

    return StreamingResponse(
        stream_chat_response(body.message, body.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering
            "Connection": "keep-alive",
        },
    )
