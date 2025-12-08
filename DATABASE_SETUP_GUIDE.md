# Database Configuration & Setup Guide

## 🔍 Current Situation

Based on your MongoDB Atlas screenshots:
- ✅ `yuva_setu` database exists with `users` and `otp_verifications` collections (both empty)
- ✅ `yuvasetu-main` database exists 
- ⚠️ Collections are empty (0 documents)

## 📋 Expected Database Structure

### Student Database: `yuva_setu`

**Location:** MongoDB Atlas cluster "Yuva-Setu"

**Collections:**
- `users` - Student user accounts (Beanie model: `User`)
- `otp_verifications` - OTP verification records (Beanie model: `OTPVerification`)
- `applications` - Student internship applications
- `support_tickets` - Support tickets

**Configuration:**
```python
# backend/student/app/config.py
DATABASE_NAME = "yuva_setu"
STUDENT_DATABASE_NAME = "yuva_setu"
```

**Models:**
- `backend/student/app/models/user.py` → Collection: `users`
- `backend/student/app/models/otp.py` → Collection: `otp_verifications`

### Employer Database: `yuvasetu-main`

**Location:** Separate MongoDB Atlas cluster (or same cluster, different database)

**Collections:**
- `users` - Employer/admin user accounts (Beanie model: `Student` in employer-admin)
- `internships` - Internship postings (Beanie model: `Internship`)
- `applications` - Applications (Beanie model: `Application`)
- `employer_profiles` - Employer profiles (Beanie model: `EmployerProfile`)

**Configuration:**
```python
# backend/student/app/config.py
EMPLOYER_DATABASE_NAME = "yuvasetu-main"
```

## ✅ Why Empty Collections Are Normal

**MongoDB creates collections lazily** - they are created automatically when the first document is inserted. Empty collections are **completely normal** for:

1. Fresh installations
2. Before any users register
3. Before any OTPs are sent
4. Before any internships are posted

## 🔧 How to Verify Configuration

### Step 1: Check Environment Variables

Edit `backend/student/.env` and verify:

```env
# Student database connection
MONGODB_URL=mongodb+srv://username:password@your-cluster.mongodb.net/?retryWrites=true&w=majority
# OR use separate URLs:
STUDENT_MONGODB_URL=mongodb+srv://username:password@student-cluster.mongodb.net/?retryWrites=true&w=majority
EMPLOYER_MONGODB_URL=mongodb+srv://username:password@employer-cluster.mongodb.net/?retryWrites=true&w=majority

# Database names
DATABASE_NAME=yuva_setu
STUDENT_DATABASE_NAME=yuva_setu
EMPLOYER_DATABASE_NAME=yuvasetu-main
```

### Step 2: Run Diagnostic Script

```bash
cd backend/student
python check_db_config.py
```

This will:
- ✅ Verify connections to both databases
- ✅ List all available databases
- ✅ List all collections in each database
- ✅ Count documents in target collections
- ✅ Show collection indexes

### Step 3: Test Data Insertion

**Test 1: Register a User**
```bash
# Use your registration endpoint
# This should create a document in yuva_setu.users
```

**Test 2: Send an OTP**
```bash
# Request an OTP via your API
# This should create a document in yuva_setu.otp_verifications
```

**Test 3: Check MongoDB Atlas**
- Go to Data Explorer
- Select `yuva_setu` database
- Check `users` collection → should show 1 document
- Check `otp_verifications` collection → should show 1 document

## 🐛 Troubleshooting

### Issue: Collections don't exist in Atlas

**Solution:** Collections are created automatically on first insert. If you see them in Atlas, they exist.

### Issue: Connection fails

**Check:**
1. MongoDB URL is correct in `.env`
2. Network access in MongoDB Atlas allows your IP
3. Database user has correct permissions
4. Connection string format is correct

**Fix:**
```env
# Correct format:
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Issue: Wrong database being accessed

**Check:**
1. Verify `DATABASE_NAME` in config matches Atlas database name
2. Connection string includes correct database name OR
3. Database name is specified separately in config

**Fix:**
```python
# In backend/student/app/config.py
DATABASE_NAME = "yuva_setu"  # Must match Atlas database name
```

### Issue: Collection name mismatch

**Check collection names:**
- Code expects: `users` (plural)
- Atlas has: `user` (singular) ❌

**Fix:** Either:
1. Update model: `class Settings: name = "user"` (not recommended)
2. Rename collection in Atlas (recommended)
3. Create new collection with correct name

## 📊 Database Connection Flow

```
Application Start
    ↓
Load .env file
    ↓
Read MONGODB_URL / STUDENT_MONGODB_URL / EMPLOYER_MONGODB_URL
    ↓
Connect to MongoDB clusters
    ↓
Access databases:
  - STUDENT_DATABASE_NAME = "yuva_setu"
  - EMPLOYER_DATABASE_NAME = "yuvasetu-main"
    ↓
Beanie initializes models:
  - User → users collection
  - OTPVerification → otp_verifications collection
    ↓
Collections created on first insert
```

## ✅ Configuration Checklist

- [ ] `.env` file exists in `backend/student/`
- [ ] `MONGODB_URL` is set correctly
- [ ] Database names match MongoDB Atlas
- [ ] Network access configured in MongoDB Atlas
- [ ] Database user has read/write permissions
- [ ] Collections appear in Atlas (even if empty)
- [ ] Application can connect (check logs)

## 🎯 Quick Test

1. **Start your backend:**
   ```bash
   cd backend/student
   python -m uvicorn app.main:app --reload
   ```

2. **Check logs for:**
   ```
   ✅ MongoDB ping successful
   ✅ Database initialized with Beanie
   ✅ Student database: yuva_setu
   ✅ Employer database connected: yuvasetu-main
   ```

3. **Register a test user** via your API

4. **Verify in MongoDB Atlas:**
   - `yuva_setu.users` → should show 1 document

## 📝 Summary

**Your configuration is CORRECT if:**
- ✅ Collections exist (even if empty)
- ✅ Collection names match code: `users`, `otp_verifications`
- ✅ Database names match: `yuva_setu`, `yuvasetu-main`
- ✅ Connection strings are valid

**Empty collections are NORMAL** - they will populate when you use the application!

If collections are empty, it simply means no data has been inserted yet. This is expected behavior for a new or unused database.
