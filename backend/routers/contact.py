"""
Contact router — handles contact form submissions with rate limiting and email delivery.

POST /contact/send
  - Rate limited: 3 req/IP/day (Redis counter)
  - Validates request with Pydantic
  - Sends email via Resend API
"""

import logging
from fastapi import APIRouter, Request, HTTPException

from models import ContactRequest, ApiResponse
from services.email_service import send_contact_email
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(tags=["Contact"])


async def _check_rate_limit(request: Request) -> None:
    """Enforce per-IP daily rate limiting for contact form submissions."""
    from services.llm_service import get_redis

    ip = request.client.host if request.client else "unknown"
    key = f"rl:contact:{ip}"

    try:
        r = await get_redis()
        count = await r.incr(key)
        if count == 1:
            await r.expire(key, 86400)  # 24-hour window
        if count > settings.contact_rate_limit:
            raise HTTPException(
                status_code=429,
                detail="You've sent too many messages today. Please try again tomorrow.",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Redis rate-limit check failed: {e}")


@router.post("/send", response_model=ApiResponse)
async def send_contact(body: ContactRequest, request: Request) -> ApiResponse:
    """
    Process a contact form submission.

    Validates the request, rate-limits by IP, and sends an email via Resend.
    Returns a success or error response.
    """
    await _check_rate_limit(request)

    success = await send_contact_email(
        name=body.name,
        email=str(body.email),
        subject=body.subject,
        message=body.message,
    )

    if not success:
        raise HTTPException(
            status_code=503,
            detail="Failed to send your message. Please try emailing directly.",
        )

    logger.info(f"Contact form submitted by {body.name} <{body.email}> — {body.subject}")

    return ApiResponse(
        success=True,
        message="Your message has been sent. I'll respond within 24 hours.",
    )
