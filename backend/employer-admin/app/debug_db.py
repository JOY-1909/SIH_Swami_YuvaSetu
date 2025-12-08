import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def debug_mongo():
    uri = os.getenv("MONGODB_URI", "mongodb://mongodb:27017")
    print(f"Connecting to: {uri}")
    
    client = AsyncIOMotorClient(uri)
    
    try:
        # List databases
        dbs = await client.list_database_names()
        print(f"Databases found: {dbs}")
        
        for db_name in dbs:
            db = client[db_name]
            collections = await db.list_collection_names()
            print(f"\nDatabase: {db_name}")
            print(f"Collections: {collections}")
            
            if "users" in collections:
                count = await db["users"].count_documents({})
                print(f"  - users count: {count}")
                if count > 0:
                    sample = await db["users"].find_one()
                    print(f"  - Sample user keys: {list(sample.keys())}")
            
            if "User" in collections:
                count = await db["User"].count_documents({})
                print(f"  - User count: {count}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(debug_mongo())
