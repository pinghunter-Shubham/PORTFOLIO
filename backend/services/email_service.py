"""
Email service — sends contact form submissions via the Resend API.
"""

import logging
import httpx
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

RESEND_API_URL = "https://api.resend.com/emails"


async def send_contact_email(
    name: str,
    email: str,
    subject: str,
    message: str,
) -> bool:
    """
    Send a contact form submission email via Resend.

    Args:
        name: Sender's name.
        email: Sender's email address.
        subject: Contact subject category.
        message: The message body.

    Returns:
        True if the email was sent successfully, False otherwise.
    """
    if not settings.resend_api_key or settings.resend_api_key == "your_key_here":
        logger.warning("Resend API key not configured — skipping email send")
        # In dev mode, log the contact info instead
        logger.info(f"[DEV] Contact from {name} <{email}> — {subject}:\n{message}")
        return True

    html_body = f"""
    <div style="font-family: monospace; background: #0E1117; color: #F0F4FF; padding: 24px; border-radius: 12px;">
      <h2 style="color: #00D4FF; margin: 0 0 16px;">New Contact: {subject}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #8892A4; padding: 6px 12px 6px 0; white-space: nowrap;">From:</td>
          <td style="color: #F0F4FF;">{name} &lt;{email}&gt;</td>
        </tr>
        <tr>
          <td style="color: #8892A4; padding: 6px 12px 6px 0;">Subject:</td>
          <td style="color: #F0F4FF;">{subject}</td>
        </tr>
      </table>
      <hr style="border-color: rgba(255,255,255,0.06); margin: 16px 0;" />
      <p style="color: #8892A4; margin: 0 0 8px; font-size: 12px;">MESSAGE:</p>
      <p style="color: #F0F4FF; white-space: pre-wrap; margin: 0;">{message}</p>
      <hr style="border-color: rgba(255,255,255,0.06); margin: 16px 0;" />
      <p style="color: #4A5568; font-size: 12px; margin: 0;">
        Sent via portfolio contact form — reply directly to {email}
      </p>
    </div>
    """

    payload = {
        "from": "Portfolio Contact <noreply@yourdomain.com>",
        "to": [settings.my_email],
        "reply_to": email,
        "subject": f"[Portfolio] {subject} — from {name}",
        "html": html_body,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                RESEND_API_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
            )
            response.raise_for_status()
            logger.info(f"Email sent successfully to {settings.my_email}")
            return True

    except httpx.HTTPStatusError as e:
        logger.error(f"Resend API error: {e.response.status_code} — {e.response.text}")
        return False

    except Exception as e:
        logger.exception(f"Failed to send email: {e}")
        return False
