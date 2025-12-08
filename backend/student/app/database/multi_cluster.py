# File: app/database/multi_cluster.py
"""
Helpers for connecting to multiple Mongo clusters (student + employer/admin).
"""
from __future__ import annotations

from typing import Optional
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger(__name__)


class MultiClusterDatabase:
    """
    Manages dedicated Mongo clients for the student and employer clusters.
    """

    def __init__(self) -> None:
        self._student_client: Optional[AsyncIOMotorClient] = None
        self._employer_client: Optional[AsyncIOMotorClient] = None
        self._student_db: Optional[AsyncIOMotorDatabase] = None
        self._employer_db: Optional[AsyncIOMotorDatabase] = None

    async def _connect(
        self,
        url: Optional[str],
        label: str,
    ) -> Optional[AsyncIOMotorClient]:
        if not url:
            logger.warning("No connection string configured for %s cluster", label)
            return None

        try:
            client = AsyncIOMotorClient(
                url,
                serverSelectionTimeoutMS=15_000,
                connectTimeoutMS=15_000,
                socketTimeoutMS=15_000,
                maxPoolSize=10,
                retryWrites=True,
            )
            # Ping to verify connection
            await client.admin.command("ping")
            logger.info("✅ %s Mongo cluster reachable", label.capitalize())
            return client
        except Exception as exc:
            logger.error("❌ Could not connect to %s cluster: %s", label, exc)
            return None

    async def connect_student(self) -> None:
        if self._student_client is not None:
            return
        student_url = settings.STUDENT_MONGODB_URL or settings.MONGODB_URL
        self._student_client = await self._connect(student_url, "student")
        
        if self._student_client is not None:
            db_name = settings.STUDENT_DATABASE_NAME or settings.DATABASE_NAME
            self._student_db = self._student_client[db_name]
            logger.info("✅ Student database: %s", db_name)

    async def connect_employer(self) -> None:
        if self._employer_client is not None:
            return
        employer_url = settings.EMPLOYER_MONGODB_URL or settings.MONGODB_URL
        logger.info("Connecting to employer database with URL: %s", employer_url[:50] + "..." if employer_url and len(employer_url) > 50 else employer_url)
        self._employer_client = await self._connect(employer_url, "employer")
        
        if self._employer_client is not None:
            db_name = settings.EMPLOYER_DATABASE_NAME or settings.DATABASE_NAME
            self._employer_db = self._employer_client[db_name]
            logger.info("✅ Employer database connected: %s", db_name)
            
            # List available databases to help debug
            try:
                db_list = await self._employer_client.list_database_names()
                logger.info("Available databases in employer cluster: %s", db_list)
                
                # Check if our target database is in the list
                if db_name not in db_list:
                    logger.warning("⚠️ Database '%s' not found in available databases list!", db_name)
                    logger.warning("⚠️ Available databases: %s", db_list)
                    logger.warning("⚠️ Trying to access database anyway (might exist but not be listed due to permissions)")
                    
                    # Also check if 'yuva_setu' has internships (might be the actual database)
                    if 'yuva_setu' in db_list and db_name != 'yuva_setu':
                        logger.info("ℹ️ Checking 'yuva_setu' database as alternative...")
                        try:
                            alt_db = self._employer_client['yuva_setu']
                            alt_collections = await alt_db.list_collection_names()
                            logger.info("Collections in 'yuva_setu': %s", alt_collections)
                            for coll_name in alt_collections:
                                try:
                                    coll = alt_db[coll_name]
                                    count = await coll.count_documents({})
                                    logger.info("  - Collection '%s' in 'yuva_setu': %d documents", coll_name, count)
                                except:
                                    pass
                        except Exception as e:
                            logger.debug("Could not check 'yuva_setu': %s", e)
                
                # Try to access the database and list its collections
                try:
                    test_db = self._employer_client[db_name]
                    collections = await test_db.list_collection_names()
                    logger.info("Collections in database '%s': %s", db_name, collections)
                    
                    # Count documents in each collection
                    for coll_name in collections:
                        try:
                            coll = test_db[coll_name]
                            count = await coll.count_documents({})
                            logger.info("  - Collection '%s': %d documents", coll_name, count)
                        except Exception as e:
                            logger.debug("Could not count documents in '%s': %s", coll_name, e)
                except Exception as e:
                    logger.warning("Could not list collections in database '%s': %s", db_name, e)
            except Exception as e:
                logger.warning("Could not list databases: %s", e)
        else:
            logger.error("❌ Failed to connect to employer database")
            logger.error("EMPLOYER_MONGODB_URL: %s", "Set" if settings.EMPLOYER_MONGODB_URL else "Not set (using MONGODB_URL)")
            logger.error("EMPLOYER_DATABASE_NAME: %s", settings.EMPLOYER_DATABASE_NAME)

    async def connect_all(self) -> None:
        await self.connect_student()
        await self.connect_employer()

    async def get_student_database(self) -> AsyncIOMotorDatabase:
        if self._student_db is None:
            await self.connect_student()
        if self._student_db is None:
            raise RuntimeError("Student database connection is not available")
        return self._student_db

    async def get_employer_database(self) -> AsyncIOMotorDatabase:
        if self._employer_db is None:
            await self.connect_employer()
        if self._employer_db is None:
            raise RuntimeError("Employer/Admin database connection is not available")
        return self._employer_db

    async def close_all(self) -> None:
        if self._student_client is not None:
            self._student_client.close()
            self._student_client = None
            self._student_db = None
        if self._employer_client is not None:
            self._employer_client.close()
            self._employer_client = None
            self._employer_db = None
        logger.info("Multi-cluster Mongo clients closed")
    
    def is_student_connected(self) -> bool:
        return self._student_client is not None
    
    def is_employer_connected(self) -> bool:
        return self._employer_client is not None


multi_db = MultiClusterDatabase()


async def get_student_database() -> AsyncIOMotorDatabase:
    return await multi_db.get_student_database()


async def get_employer_database() -> AsyncIOMotorDatabase:
    return await multi_db.get_employer_database()


__all__ = [
    "multi_db",
    "get_student_database",
    "get_employer_database",
]