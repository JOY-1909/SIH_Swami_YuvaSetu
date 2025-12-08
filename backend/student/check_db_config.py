"""
Database Configuration Diagnostic Script
Checks MongoDB connections and collection configurations
"""
import asyncio
import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(env_path)
    print(f"✅ Loaded .env from: {env_path}")
else:
    print(f"⚠️  No .env file found at: {env_path}")
    print("   Trying to use environment variables from system...")

# Get configuration
MONGODB_URL = os.getenv("MONGODB_URL")
STUDENT_MONGODB_URL = os.getenv("STUDENT_MONGODB_URL")
EMPLOYER_MONGODB_URL = os.getenv("EMPLOYER_MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "yuva_setu")
STUDENT_DATABASE_NAME = os.getenv("STUDENT_DATABASE_NAME", "yuva_setu")
EMPLOYER_DATABASE_NAME = os.getenv("EMPLOYER_DATABASE_NAME", "yuvasetu-main")

print("\n" + "="*80)
print("DATABASE CONFIGURATION DIAGNOSTIC")
print("="*80)

print("\n📋 Environment Variables:")
print(f"  MONGODB_URL: {'✅ Set' if MONGODB_URL else '❌ Not set'}")
print(f"  STUDENT_MONGODB_URL: {'✅ Set' if STUDENT_MONGODB_URL else '❌ Not set (will use MONGODB_URL)'}")
print(f"  EMPLOYER_MONGODB_URL: {'✅ Set' if EMPLOYER_MONGODB_URL else '❌ Not set (will use MONGODB_URL)'}")
print(f"  DATABASE_NAME: {DATABASE_NAME}")
print(f"  STUDENT_DATABASE_NAME: {STUDENT_DATABASE_NAME}")
print(f"  EMPLOYER_DATABASE_NAME: {EMPLOYER_DATABASE_NAME}")

print("\n🔗 Connection URLs (masked):")
if MONGODB_URL:
    masked = MONGODB_URL.split("@")[-1] if "@" in MONGODB_URL else MONGODB_URL[:50]
    print(f"  MONGODB_URL: ...@{masked}")
if STUDENT_MONGODB_URL:
    masked = STUDENT_MONGODB_URL.split("@")[-1] if "@" in STUDENT_MONGODB_URL else STUDENT_MONGODB_URL[:50]
    print(f"  STUDENT_MONGODB_URL: ...@{masked}")
if EMPLOYER_MONGODB_URL:
    masked = EMPLOYER_MONGODB_URL.split("@")[-1] if "@" in EMPLOYER_MONGODB_URL else EMPLOYER_MONGODB_URL[:50]
    print(f"  EMPLOYER_MONGODB_URL: ...@{masked}")


async def check_database(client: AsyncIOMotorClient, db_name: str, label: str):
    """Check a database connection and collections"""
    print(f"\n{'='*80}")
    print(f"Checking {label} Database: {db_name}")
    print("="*80)
    
    try:
        # Ping the server
        await client.admin.command("ping")
        print(f"✅ Connection successful to {label} cluster")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return
    
    # List all databases
    try:
        db_list = await client.list_database_names()
        print(f"\n📊 Available databases in cluster: {db_list}")
        if db_name not in db_list:
            print(f"⚠️  WARNING: Database '{db_name}' not found in available databases!")
            print(f"   Available databases: {db_list}")
    except Exception as e:
        print(f"⚠️  Could not list databases: {e}")
    
    # Access the target database
    db = client[db_name]
    
    # List collections
    try:
        collections = await db.list_collection_names()
        print(f"\n📁 Collections in '{db_name}': {collections if collections else '(none)'}")
    except Exception as e:
        print(f"⚠️  Could not list collections: {e}")
        collections = []
    
    # Check specific collections we care about
    target_collections = {
        "users": "User model",
        "otp_verifications": "OTPVerification model",
        "applications": "Student applications",
        "internships": "Internships (employer db)",
        "user": "Alternative user collection name"
    }
    
    print(f"\n🔍 Checking target collections:")
    for coll_name, description in target_collections.items():
        try:
            collection = db[coll_name]
            count = await collection.count_documents({})
            if count > 0:
                print(f"  ✅ {coll_name} ({description}): {count} documents")
                # Sample a document
                sample = await collection.find_one({})
                if sample:
                    print(f"     Sample document keys: {list(sample.keys())[:10]}")
            else:
                print(f"  ⚠️  {coll_name} ({description}): 0 documents (empty)")
        except Exception as e:
            if coll_name in collections:
                print(f"  ❌ {coll_name}: Error accessing - {e}")
            else:
                # Collection doesn't exist - this is expected if no data
                pass
    
    # Check indexes
    for coll_name in ["users", "otp_verifications"]:
        if coll_name in collections:
            try:
                indexes = await db[coll_name].index_information()
                print(f"\n📌 Indexes on '{coll_name}':")
                for idx_name, idx_info in indexes.items():
                    print(f"  - {idx_name}: {idx_info.get('key', [])}")
            except Exception as e:
                print(f"⚠️  Could not get indexes for '{coll_name}': {e}")


async def main():
    """Main diagnostic function"""
    print("\n" + "="*80)
    print("STARTING DATABASE CHECKS")
    print("="*80)
    
    # Check Student Database
    student_url = STUDENT_MONGODB_URL or MONGODB_URL
    if not student_url:
        print("\n❌ ERROR: No MongoDB URL configured!")
        print("   Please set MONGODB_URL or STUDENT_MONGODB_URL in your .env file")
        return
    
    try:
        student_client = AsyncIOMotorClient(
            student_url,
            serverSelectionTimeoutMS=15_000,
            connectTimeoutMS=15_000,
            socketTimeoutMS=15_000
        )
        await check_database(student_client, STUDENT_DATABASE_NAME, "Student")
        student_client.close()
    except Exception as e:
        print(f"\n❌ Failed to connect to Student database: {e}")
    
    # Check Employer Database
    employer_url = EMPLOYER_MONGODB_URL or MONGODB_URL
    if employer_url and employer_url != student_url:
        try:
            employer_client = AsyncIOMotorClient(
                employer_url,
                serverSelectionTimeoutMS=15_000,
                connectTimeoutMS=15_000,
                socketTimeoutMS=15_000
            )
            await check_database(employer_client, EMPLOYER_DATABASE_NAME, "Employer")
            employer_client.close()
        except Exception as e:
            print(f"\n❌ Failed to connect to Employer database: {e}")
    elif employer_url == student_url:
        print(f"\nℹ️  Employer and Student databases use the same connection URL")
    
    print("\n" + "="*80)
    print("DIAGNOSTIC SUMMARY")
    print("="*80)
    print("\n📝 Expected Configuration:")
    print(f"  Student DB: '{STUDENT_DATABASE_NAME}' with collections: 'users', 'otp_verifications'")
    print(f"  Employer DB: '{EMPLOYER_DATABASE_NAME}' with collections: 'users', 'internships'")
    print("\n💡 If collections are empty, this is normal if:")
    print("   - No users have registered yet")
    print("   - No OTPs have been sent")
    print("   - No internships have been posted")
    print("\n✅ Collections will be created automatically when data is inserted")
    print("="*80)


if __name__ == "__main__":
    asyncio.run(main())
