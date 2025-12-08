"""
Lightweight SMS sender built on top of Twilio with a development fallback.
"""
from __future__ import annotations

from typing import Optional
import logging

from twilio.rest import Client

from app.config import settings

logger = logging.getLogger(__name__)


class SMSService:
    def __init__(self) -> None:
        self._client: Optional[Client] = None

        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                self._client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                logger.info("✅ Twilio client initialized")
            except Exception as exc:  # noqa: BLE001
                logger.error("❌ Failed to initialize Twilio client: %s", exc)
                self._client = None
        else:
            logger.info("Twilio credentials not configured; SMS will log to console")

    @staticmethod
    def _format_phone_number(phone: str) -> str:
        digits = phone.strip()
        if digits.startswith("+"):
            return digits
        # Assume Indian mobile numbers if 10 digits, else just prefix with '+'
        if len(digits) == 10 and digits.isdigit():
            return f"+91{digits}"
        return f"+{digits}"

    def send_otp_sms(self, phone: str, otp_code: str) -> None:
        message = f"Your Yuva Setu verification code is {otp_code}. It expires in {settings.OTP_EXPIRE_MINUTES} minutes."

        if not self._client or not settings.TWILIO_PHONE_NUMBER:
            logger.warning("📱 SMS fallback → %s :: %s", phone, message)
            return

        try:
            formatted_phone = self._format_phone_number(phone)
            self._client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=formatted_phone,
            )
            logger.info("OTP SMS sent to %s", formatted_phone)
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to send OTP SMS to %s: %s", phone, exc)


sms_service = SMSService()


__all__ = ["sms_service", "SMSService"]

