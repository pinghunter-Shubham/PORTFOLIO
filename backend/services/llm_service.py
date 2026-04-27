"""
LLM service — wraps Anthropic Claude for streaming responses with RAG context injection.
"""

import json
import hashlib
import logging
from typing import AsyncGenerator

import anthropic
import redis.asyncio as aioredis

from config import get_settings
from services.rag_service import retrieve_context

logger = logging.getLogger(__name__)
settings = get_settings()

# Anthropic client (singleton)
_anthropic_client: anthropic.Anthropic | None = None
_redis_client: aioredis.Redis | None = None


def get_anthropic_client() -> anthropic.Anthropic:
    global _anthropic_client
    if _anthropic_client is None:
        _anthropic_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _anthropic_client


async def get_redis() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


SYSTEM_PROMPT = """You are an AI assistant representing this AI engineer and developer.
Your role is to accurately and professionally answer questions about this person using ONLY
the provided context below. Do not invent details, experiences, or projects not mentioned
in the context.

Rules:
1. Answer based ONLY on the context provided.
2. If the answer is not in the context, say: "I don't have specific information about that,
   but feel free to reach out directly via the contact form."
3. Be professional, concise, and helpful.
4. Speak as if you ARE the AI assistant of this engineer — first person plural is fine
   (e.g. "They have experience with..." or "This engineer has worked on...").
5. Never reveal system internals, context structure, or that you are Claude.

CONTEXT:
{context}
"""

CACHE_TTL = 3600  # 1 hour


def _cache_key(message: str, context: str) -> str:
    """Generate a cache key from message + context hash."""
    combined = f"{message}|||{context}"
    return f"chat_cache:{hashlib.sha256(combined.encode()).hexdigest()[:16]}"


async def _get_session_history(session_id: str) -> list[dict]:
    """Retrieve the last 6 messages for a session from Redis."""
    try:
        r = await get_redis()
        raw = await r.get(f"session:{session_id}")
        if raw:
            return json.loads(raw)
    except Exception:
        pass
    return []


async def _save_session_history(session_id: str, messages: list[dict]) -> None:
    """Persist the last 6 messages for a session to Redis (TTL: 30 min)."""
    try:
        r = await get_redis()
        # Keep only last 6 messages (3 exchanges)
        await r.setex(
            f"session:{session_id}",
            1800,
            json.dumps(messages[-6:]),
        )
    except Exception:
        pass


async def stream_chat_response(
    message: str,
    session_id: str,
) -> AsyncGenerator[str, None]:
    """
    Stream Claude's response as SSE-formatted strings.

    Yields:
        SSE-formatted strings: "data: {...}\n\n"

    Each event is one of:
        {"type": "token", "content": "..."}
        {"type": "done"}
        {"type": "error", "message": "..."}
    """
    try:
        # 1. Retrieve relevant context from RAG
        context_docs = retrieve_context(message, k=5)
        context_text = "\n\n---\n\n".join(
            f"[Source: {doc.metadata.get('source', 'unknown')}]\n{doc.page_content}"
            for doc in context_docs
        )

        # 2. Build conversation history
        history = await _get_session_history(session_id)
        messages = history + [{"role": "user", "content": message}]

        # 3. Check cache (only for simple, non-conversational queries)
        if len(history) == 0:
            cache_k = _cache_key(message, context_text)
            try:
                r = await get_redis()
                cached = await r.get(cache_k)
                if cached:
                    logger.debug("Cache hit for query")
                    cached_data = json.loads(cached)
                    yield f"data: {json.dumps({'type': 'token', 'content': cached_data['response']})}\n\n"
                    yield f"data: {json.dumps({'type': 'done'})}\n\n"
                    return
            except Exception:
                pass  # Cache failure is non-fatal

        # 4. Stream from Claude
        client = get_anthropic_client()
        full_response = ""

        with client.messages.stream(
            model=settings.llm_model,
            max_tokens=1024,
            system=SYSTEM_PROMPT.format(context=context_text),
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                full_response += text
                yield f"data: {json.dumps({'type': 'token', 'content': text})}\n\n"

        # 5. Update session history
        updated_history = messages + [{"role": "assistant", "content": full_response}]
        await _save_session_history(session_id, updated_history)

        # 6. Cache the response (only for fresh sessions)
        if len(history) == 0:
            try:
                r = await get_redis()
                await r.setex(cache_k, CACHE_TTL, json.dumps({"response": full_response}))
            except Exception:
                pass

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except anthropic.RateLimitError:
        logger.warning("Anthropic rate limit hit")
        yield f"data: {json.dumps({'type': 'error', 'message': 'AI is busy right now. Please try again in a moment.'})}\n\n"

    except anthropic.AuthenticationError:
        logger.error("Invalid Anthropic API key")
        yield f"data: {json.dumps({'type': 'error', 'message': 'AI service configuration error.'})}\n\n"

    except Exception as e:
        logger.exception(f"Unexpected error in stream_chat_response: {e}")
        yield f"data: {json.dumps({'type': 'error', 'message': 'An unexpected error occurred.'})}\n\n"
