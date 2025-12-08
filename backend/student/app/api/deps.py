# File: Yuva-setu/backend/app/api/deps.py
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import verify_token


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get the current authenticated user.
    Returns User instance.
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.info("🔐 get_current_user called - authenticating request")
    
    # Import here to avoid circular import
    from app.models.user import User
    
    token = credentials.credentials
    logger.debug(f"Token received (length: {len(token)})")
    
    # Verify token
    logger.debug("Verifying token...")
    payload = verify_token(token)
    if not payload:
        logger.warning("❌ Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.debug("✅ Token verified")
    
    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        logger.warning("❌ No user ID in token payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    logger.info(f"👤 Fetching user from database: {user_id}")
    # Fetch user from database
    user = await User.get(user_id)
    if not user:
        logger.warning(f"❌ User not found: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    logger.info(f"✅ User authenticated: {user_id}")
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"❌ User is inactive: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    return user


async def get_current_active_user(
    current_user = Depends(get_current_user)
):
    """Get current active user (dependency function)."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_superuser(
    current_user = Depends(get_current_user)
):
    """Get current superuser (for admin endpoints)."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


# Export all dependency functions
__all__ = [
    'get_current_user',
    'get_current_active_user',
    'get_current_superuser',
    'security'
]
