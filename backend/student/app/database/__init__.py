"""
Database connection utilities for the student service.
"""
from typing import Optional
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from beanie import init_beanie

from app.config import settings

logger = logging.getLogger(__name__)

# Single shared Mongo client for the student cluster
_client: Optional[AsyncIOMotorClient] = None


async def connect_to_mongo() -> Optional[AsyncIOMotorDatabase]:
    """
    Create (or return) the core MongoDB connection used by the student service.
    """
    global _client

    if _client is not None:
        return _client[settings.DATABASE_NAME]

    try:
        logger.info("Attempting MongoDB connection to %s", settings.DATABASE_NAME)

        _client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=10_000,
            connectTimeoutMS=10_000,
            socketTimeoutMS=10_000,
        )

        await _client.admin.command("ping")
        logger.info("✅ MongoDB ping successful")

        return _client[settings.DATABASE_NAME]

    except Exception as exc:  # noqa: BLE001 - we want to log any failure here
        logger.error("❌ Could not connect to MongoDB: %s", exc)
        return None


async def get_database() -> AsyncIOMotorDatabase:
    """
    Retrieve the default database instance, connecting if required.
    """
    database = await connect_to_mongo()
    if database is None:
        raise RuntimeError("Database connection is not available")
    return database


async def init_database() -> Optional[AsyncIOMotorDatabase]:
    """
    Initialize Beanie document models against the Mongo database.
    """
    try:
        from app.models.user import User
        from app.models.otp import OTPVerification
        from app.models.support import SupportTicket

        database = await connect_to_mongo()
        if database is None:
            logger.error("❌ Database connection failed")
            return None

        await init_beanie(database=database, document_models=[User, OTPVerification, SupportTicket])
        logger.info("✅ Database initialized with Beanie")
        return database

    except Exception as exc:  # noqa: BLE001
        logger.error("❌ Database initialization failed: %s", exc)
        return None


async def close_mongo_connection() -> None:
    """
    Close the underlying Mongo client, if it was created.
    """
    global _client
    if _client:
        _client.close()
        _client = None
        logger.info("Disconnected from MongoDB")


__all__ = [
    "connect_to_mongo",
    "get_database",
    "init_database",
    "close_mongo_connection",
]

