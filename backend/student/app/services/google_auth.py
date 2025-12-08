# File: Yuva-setu/backend/app/services/google_auth.py
import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class GoogleAuthService:
    @staticmethod
    def verify_google_token(token: str) -> dict:
        try:
            # Verify the Firebase ID token
            decoded_token = firebase_auth.verify_id_token(token)
            
            return {
                'google_id': decoded_token['uid'],
                'email': decoded_token['email'],
                'email_verified': decoded_token.get('email_verified', False),
                'name': decoded_token.get('name'),
                'given_name': decoded_token.get('given_name', ''),
                'family_name': decoded_token.get('family_name', ''),
                'picture': decoded_token.get('picture'),
            }
        except Exception as e:
            logger.error(f"Firebase token verification failed: {e}")
            return None

google_auth_service = GoogleAuthService()