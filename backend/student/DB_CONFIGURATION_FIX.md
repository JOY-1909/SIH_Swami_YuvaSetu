# Database Configuration Summary & Fix

## Current Configuration Status

### Student Database (`yuva_setu`)
- **Database Name**: `yuva_setu`
- **Collections Expected**:
  - `users` - User accounts
  - `otp_verifications` - OTP codes for email/phone verification
  - `support_tickets` - Support requests (if used)
- **Connection**: Uses `MONGODB_URL` from `.env`

### Employer Database (`yuvasetu-main`)
- **Database Name**: `yuvasetu-main`
- **Collections Expected**:
  - `internships` - Internship listings
  - `employer_profiles` - Employer profiles
  - `applications` - Job applications
  - `users` - This is **NOT expected** here! Users are only in `yuva_setu`
- **Connection**: Uses `EMPLOYER_MONGODB_URL` from `.env`

## Important Notes

1. **Users belong ONLY in `yuva_setu` database** - not in `yuvasetu-main`
2. **`yuvasetu-main` should NOT have a `users` collection** - this is correct!
3. **Empty collections are normal** if no users have registered yet

## Verification Steps

### Step 1: Check Database Connection
Visit this endpoint after starting your server:
```
GET http://localhost:8001/api/v1/diagnostic/db-status
```

This will show:
- Which database you're connected to
- All collections and their document counts
- Connection configuration details

### Step 2: Check Your .env File
Make sure `backend/student/.env` has:
```env
MONGODB_URL=mongodb://.../yuva_setu?ssl=true...
DATABASE_NAME=yuva_setu
EMPLOYER_MONGODB_URL=mongodb+srv://...@yuva-setu.m7nxrk3.mongodb.net/...
```

### Step 3: Verify Collections Exist
Even if empty, collections should exist. The diagnostic endpoint will show this.

### Step 4: Test User Registration
1. Try registering a new user through your frontend
2. Check if the user appears in `yuva_setu.users`
3. Check if OTP appears in `yuva_setu.otp_verifications`

### Step 5: Create Test User (DEBUG mode only)
If `DEBUG=True` in your `.env`, you can create a test user:
```
GET http://localhost:8001/api/v1/diagnostic/create-test-user
```

## Common Issues & Solutions

### Issue 1: Collections are Empty
**Possible Causes**:
- No users have registered yet (this is normal!)
- Registration is failing silently
- Database connection is pointing to wrong database

**Solution**: 
- Use the diagnostic endpoint to verify connection
- Check server logs during registration
- Try creating a test user if DEBUG mode is enabled

### Issue 2: "No users in yuvasetu-main"
**This is CORRECT!** Users should only be in `yuva_setu`, not in `yuvasetu-main`.

### Issue 3: Connection Errors
**Check**:
- MongoDB connection string is correct
- Database credentials are valid
- Network connectivity to MongoDB Atlas
- Firewall rules allow connection

## What the Code Does

1. **Student Backend** (`backend/student`):
   - Connects to `MONGODB_URL` (student cluster)
   - Uses database `DATABASE_NAME` (`yuva_setu`)
   - Creates/reads users in `yuva_setu.users`
   - Creates/reads OTPs in `yuva_setu.otp_verifications`

2. **Employer Backend** (`backend/employer-admin`):
   - Connects to `MONGODB_URI` (employer cluster)
   - Uses database `MONGODB_DB` (`yuvasetu-main`)
   - Reads internships from `yuvasetu-main.internships`
   - May read user data from student cluster via `STUDENT_MONGODB_URI`

## Next Steps

1. **Start your server**:
   ```bash
   cd backend/student
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

2. **Check database status**:
   ```bash
   curl http://localhost:8001/api/v1/diagnostic/db-status
   ```

3. **If collections are empty but connection works**, try registering a user through your frontend or create a test user (if DEBUG=True).

4. **Check MongoDB Atlas** directly to verify:
   - Collections exist (even if empty)
   - Connection logs show successful connections
   - No access permission errors

## Expected Behavior

- ✅ `yuva_setu.users` - Empty initially, gets populated when users register
- ✅ `yuva_setu.otp_verifications` - Empty initially, gets populated during OTP verification flow
- ✅ `yuvasetu-main.internships` - Should have internship listings
- ✅ `yuvasetu-main.users` - Should NOT exist (this is correct!)
