# File: Yuva-setu/backend/app/firebase_config.py
import firebase_admin
from firebase_admin import credentials
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def initialize_firebase():
    """Initialize Firebase Admin SDK with manual configuration"""
    try:
        # Check if Firebase is already initialized
        if firebase_admin._apps:
            logger.info("Firebase already initialized")
            return True

        # Manual Firebase configuration (not from env vars)
        firebase_config = {
            "type": "service_account",
            "project_id": "yuvasetu-26ba4",
            "private_key_id": "your-private-key-id",  # Add this if you have it
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEWQ1Leg7Xngwx\nNd1lp4cLSU5vmpogkMMzaT/cE54aS3+exWgFG4J815yqBWDNuFzL4rQTVYkpPAuS\nbZOdBF1yptMySNlcAhgjZO7KDAucIUn7YPoACDFkp8SXKVCA/S+qzVf8/zzUwt/R\n5Y1kpcFHkifk2pAeh7lgVtcVfy3oThfwfR2pFUky0Pk6ypIIvDH0Caw7TsSIS3vt\n48ofa6GXNWeYmH/d2AAImMobU1FMXP+vN5ByqB6nzIxlPovwraqz+19nvz4Hz8sw\n0QqaSY+4VHvd1x5TZxphUoc8JXYEvxqKNO9bHgMBwD/yTsxk+AOUSOHI2ysZA7OS\nLu1VOd8RAgMBAAECggEAJGMRcuuZjQ1Z2pPOJgzUGrwY2FdpGUBioGgwoLcU/XAA\n5FpWkt28gqjNfHe3LyCrt9AZSZz4KIdbaKU8biSVMc5nRMIZ3/J2aTbHBvQRAbvs\nkzSvV+qsxqfNp6rNI75oA0n/NKBTdGVx55rYJ28NYNdd48w6WaIS8V7eiLoTNqHQ\n42DqUTkQhn5+fiEKthzC1ZRiOdmMSfPsLyN5E9x+efQlNRaQlPP46QfME9i6o1cY\nu/Mge2Blb4B6AK+6riI1WxhnyD1hd1BU4GcHCIlL3e+3Lp06pKQ3B2H+KEwbpa3h\nnUGhf7Olv6iBuPCGUye98ao9N1yeVJSIEmqfMHeTLQKBgQD05g+kOjWuchMkDdwG\nH/d0PmIS12/vRJu9w89FJk2cP+RQEhw79q0XViUD5hEOuWkhGzg1norHAKKT34ke\nBf8pG6lEXZG4cCIUo7J9wNMBi42QFc64cCoFC5pA92Q2o0RHnTBBPjPTfb8rARxd\nAc7LCzB8N5IRXKiOqb1xEWQbjQKBgQDNP5SYvJCeh6lO34gtp6Mw4ly6bjgmJY5X\nbucF2UWZPh1+jPdr7MNCgt/XA87k5VI+2hB4w8rIddvOtdNKGOMuTalYeXDgz0AP\nbt5ugYyt0aTJo2aYqD+9qczgqQdgPFLWcWkaEYeLw2GIa5O8rr2iuAsKezGdiJdE\nOzVB6yyulQKBgGdBWPb1VAzpLAjXjx1F/R+V7ePj0d4gH0ozdQDC1ZY7mhfoit79\ncp2URKcQKcD7i8fZoil5XynoqqOObFGsVZkPgJ7ClN4e6T+qhWdgFZdhL57AkxhQ\nsmbOLYuWwzoGPJO1QtM/VrqlGiUXos3UJUyWuyqkg4Guf6MnDijOHFdBAoGABdTW\nnfhNi5ODJfCH5/QpWMw1oj5bbgoHH0jRW4MuzQnMwLm0leZmLc+WGH/NMweo7Iw5\nh5TYgBWJJzhXRnWqjrg6JX9dy6VXxph5zV3050NbkTcJRTESjoryfTeQNBXCrMEQ\nIWN6HGhyrvOPgP7d+G+OMMALStSEp7We776EyHkCgYB8EABpw4x7Omr/Rh0AkcaN\nDzJbmwh4lxaGd1XLlr9QUo/jzsgKe59M7PvqOugPZT/25PtEIWU7xNiapwLTL15H\nAshfuNOq3l2n9TUlCzWYdcruS+mY1tyDS/xakbmzBTNMsACPmfAzFCO09S+fQS3u\nUREFTod145iqCS3VvO7vgw\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-fbsvc@yuvasetu-26ba4.iam.gserviceaccount.com",
            "client_id": "your-client-id",  # Add this if you have it
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40yuvasetu-26ba4.iam.gserviceaccount.com"
        }

        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        
        logger.info("✅ Firebase Admin SDK initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Firebase initialization failed: {str(e)}")
        return False