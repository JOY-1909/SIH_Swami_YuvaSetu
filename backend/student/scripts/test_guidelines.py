
from app.services.rag_service import rag_service
import sys

# Query about something specific to the guidelines
query = "What is the age limit for eligibility?"
print(f"Query: {query}")

# 1. Test Retrieval
retrieved = rag_service.retrieve(query)
print(f"Retrieved Context: {retrieved}")

# Check if specific keyword "18 years" is in the retrieved docs
param = "18 years"
found = any(param in doc for doc in retrieved)

if found:
    print(f"✅ Setup Successful: Found '{param}' in context.")
else:
    print(f"❌ Verification Failed: Did not find '{param}' in context.")

# 2. Test Generation (Mock or Real)
response = rag_service.generate_response(query)
print(f"Response: {response}")
