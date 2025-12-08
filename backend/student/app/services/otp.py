# File: Yuva-setu/backend/app/services/otp.py
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Tuple
from app.models.otp import OTPVerification, OTPPurpose
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class OTPService:
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate a random OTP code."""
        return ''.join(random.choices(string.digits, k=length))
    
    @staticmethod
    async def create_otp(
        identifier: str,
        purpose: str,
        user_id: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> OTPVerification:
        """Create and save a new OTP verification entry."""
        
        # Delete any existing OTPs for this identifier and purpose
        await OTPVerification.find(
            OTPVerification.identifier == identifier,
            OTPVerification.purpose == purpose,
            OTPVerification.is_verified == False
        ).delete()
        
        # Create new OTP
        otp_code = OTPService.generate_otp()
        
        otp_verification = OTPVerification(
            identifier=identifier,
            otp_code=otp_code,
            purpose=purpose,
            user_id=user_id,
            metadata=metadata  # Store metadata during creation
        )
        
        await otp_verification.insert()
        logger.info(f"OTP created for {identifier} - Purpose: {purpose} - Code: {otp_code}")
        
        return otp_verification
    
    @staticmethod
    async def verify_otp(
        identifier: str,
        otp_code: str,
        purpose: str
    ) -> Tuple[bool, Optional[str], Optional[OTPVerification]]:
        """
        Verify an OTP code.
        Returns: (success, error_message, otp_verification)
        """
        
        # Find the OTP verification entry
        otp_verification = await OTPVerification.find_one(
            OTPVerification.identifier == identifier,
            OTPVerification.purpose == purpose,
            OTPVerification.is_verified == False
        )
        
        if not otp_verification:
            logger.error(f"OTP not found for {identifier}, purpose: {purpose}")
            return False, "OTP not found or already used", None
        
        # Check if expired
        if otp_verification.is_expired:
            logger.error(f"OTP expired for {identifier}")
            await otp_verification.delete()
            return False, "OTP has expired", None
        
        # Check attempts
        if not otp_verification.can_attempt:
            logger.error(f"Too many attempts for {identifier}")
            await otp_verification.delete()
            return False, "Too many failed attempts", None
        
        # Verify OTP code
        if otp_verification.otp_code != otp_code:
            attempts = otp_verification.increment_attempts()
            await otp_verification.save()
            attempts_left = settings.OTP_MAX_ATTEMPTS - attempts
            logger.error(f"Invalid OTP for {identifier}. Attempts: {attempts}")
            return False, f"Invalid OTP. {attempts_left} attempts remaining", None
        
        # Mark as verified
        otp_verification.is_verified = True
        otp_verification.verified_at = datetime.utcnow()
        await otp_verification.save()
        
        logger.info(f"OTP verified successfully for {identifier}")
        return True, None, otp_verification
    
    @staticmethod
    async def cleanup_expired_otps():
        """Delete expired OTP entries."""
        result = await OTPVerification.find(
            OTPVerification.expires_at < datetime.utcnow()
        ).delete()
        
        if result.deleted_count > 0:
            logger.info(f"Cleaned up {result.deleted_count} expired OTPs")