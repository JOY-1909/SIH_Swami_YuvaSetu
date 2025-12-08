"""
Time-based one-time password (TOTP) helper utilities.
"""
from __future__ import annotations

import base64
from io import BytesIO
import logging
from typing import Optional

import pyotp
import qrcode

from app.config import settings

logger = logging.getLogger(__name__)


class TOTPService:
    """
    Thin wrapper around pyotp utilities that also generates QR codes for 2FA
    enrollment.
    """

    def __init__(self, issuer_name: Optional[str] = None) -> None:
        self.issuer_name = issuer_name or settings.APP_NAME

    @staticmethod
    def generate_secret() -> str:
        return pyotp.random_base32()

    def generate_qr_code(self, secret: str, email: str) -> str:
        """
        Create a base64-encoded PNG QR code that can be rendered on the frontend.
        """
        otpauth_url = pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=self.issuer_name)
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M)
        qr.add_data(otpauth_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"

    @staticmethod
    def verify_totp(secret: Optional[str], token: str) -> bool:
        if not secret:
            logger.warning("TOTP verification attempted without a secret")
            return False
        totp = pyotp.TOTP(secret)
        # valid_window allows +/-1 step to account for small clock drift
        return bool(totp.verify(token, valid_window=1))


totp_service = TOTPService()


__all__ = ["totp_service", "TOTPService"]

