# Database Configuration Summary

## Overview

This project uses **two MongoDB databases** (potentially on different clusters):

1. **Student Database** (`yuva_setu`)
2. **Employer Database** (`yuvasetu-main`)

## Database Configuration

### Student Database (`yuva_setu`)

**Connection:** Uses `STUDENT_MONGODB_URL` or falls back to `MONGODB_URL`

**Expected Collections:**
- `users` - Student user accounts (from `User` model)
- `otp_verifications` - OTP verification records (from `OTPVerification` model)
- `applications` - Student internship applications
- `support_tickets` - Support ticket records

**Collection Details:**

| Collection | Model | Purpose |
|------------|-------|---------|
| `users` | `User` | Student profiles, authentication, profile data |
| `otp_verifications` | `OTPVerification` | Email/phone OTP verification records |
| `applications` | (Dynamic) | Student internship applications |

**Model Configuration:**
- `User` model (`app/models/user.py`) → Collection: `users`
- `OTPVerification` model (`app/models/otp.py`) → Collection: `otp_verifications`

### Employer Database (`yuvasetu-main`)

**Connection:** Uses `EMPLOYER_MONGODB_URL` or falls back to `MONGODB_URL`

**Expected Collections:**
- `users` - Employer/admin user accounts
- `internships` - Internship postings
- `applications` - Applications from students
- `employer_profiles` - Employer profile information

**Note:** The employer database `users` collection is separate from the student database `users` collection.

## Environment Variables Required

### Student Backend (`.env` file in `backend/student/`)

```env
# Primary MongoDB connection (used if STUDENT_MONGODB_URL not set)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Optional: Separate connection for student cluster
STUDENT_MONGODB_URL=mongodb+srv://username:password@student-cluster.mongodb.net/?retryWrites=true&w=majority

# Optional: Separate connection for employer cluster
EMPLOYER_MONGODB_URL=mongodb+srv://username:password@employer-cluster.mongodb.net/?retryWrites=true&w=majority

# Database names
DATABASE_NAME=yuva_setu
STUDENT_DATABASE_NAME=yuva_setu
EMPLOYER_DATABASE_NAME=yuvasetu-main
```

## Current Configuration Analysis

Based on your MongoDB Atlas screenshots:

### `yuva_setu` Database (Student)
- ✅ Database exists
- ✅ `users` collection exists (0 documents)
- ✅ `otp_verifications` collection exists (0 documents)

**Status:** Collections are correctly named but empty (no data inserted yet).

### `yuvasetu-main` Database (Employer)
- ✅ Database exists
- ⚠️ `users` collection status unknown (needs verification)

**Status:** Need to verify if `users` collection exists or if it's named differently.

## Why Collections Might Be Empty

1. **No Data Inserted Yet** (Normal for new setup)
   - No users have registered
   - No OTPs have been sent
   - Collections are created automatically when first document is inserted

2. **Wrong Database Connection**
   - App might be connecting to a different cluster/database
   - Connection strings might be misconfigured

3. **Collection Name Mismatch**
   - Code expects `users` but database has `user` (singular)
   - Code expects `otp_verifications` but database has different name

## Verification Steps

1. **Run the diagnostic script:**
   ```bash
   cd backend/student
   python check_db_config.py
   ```

2. **Check your .env file:**
   - Verify `MONGODB_URL` points to the correct cluster
   - Check if `STUDENT_MONGODB_URL` and `EMPLOYER_MONGODB_URL` are set correctly
   - Verify database names match what's in MongoDB Atlas

3. **Verify in MongoDB Atlas:**
   - Check that you're looking at the correct cluster
   - Verify database names match configuration
   - Check collection names match model definitions

## Troubleshooting

### Issue: Collections exist but are empty

**Solution:** This is normal if:
- The application hasn't been used yet (no registrations)
- This is a fresh installation
- Collections are created lazily (on first insert)

**Action:** Try registering a user or sending an OTP to create test data.

### Issue: Collections don't exist at all

**Solution:** Collections in MongoDB are created automatically when first document is inserted. This is expected behavior.

**Action:** Use the application to create a user account, which will create the collections.

### Issue: Wrong database/cluster being accessed

**Solution:** 
1. Check your `.env` file connection strings
2. Verify cluster names in MongoDB Atlas match connection strings
3. Run `check_db_config.py` to verify connections

### Issue: Collection name mismatch (e.g., `user` vs `users`)

**Solution:** Update the model's `Settings.name` attribute if needed, or rename the collection in MongoDB.

## Expected Behavior

✅ **Collections will be created automatically** when:
- First user registers → creates `users` collection
- First OTP is sent → creates `otp_verifications` collection
- First application is submitted → creates `applications` collection

✅ **Empty collections are normal** until data is inserted.

✅ **Beanie ODM handles collection creation** - no manual setup needed.

## Quick Fixes

If you need to verify everything is working:

1. **Test User Registration:**
   - Use the registration endpoint
   - Check MongoDB Atlas → `yuva_setu.users` should have 1 document

2. **Test OTP:**
   - Request an OTP
   - Check MongoDB Atlas → `yuva_setu.otp_verifications` should have 1 document

3. **Verify Connections:**
   - Run `check_db_config.py` script
   - Check all connection URLs are correct
