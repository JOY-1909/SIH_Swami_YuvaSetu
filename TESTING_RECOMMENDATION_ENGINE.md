# Testing Guide: Recommendation Engine

This guide explains how to test and verify that the recommendation engine is correctly matching student profiles with internships.

## 🎯 What the Recommendation Engine Does

The engine uses **direct 1-to-1 vector matching** (not clustering):
- Each student profile → Student vector (384 dimensions)
- Each internship → Internship vector (384 dimensions)
- FAISS finds the nearest internship vectors to each student vector
- Returns top matches sorted by similarity percentage

## 🧪 Testing Methods

### Method 1: Using Test Endpoints (Recommended)

I've created test endpoints to help you verify the matching:

#### 1. **Match Analysis Endpoint**
```bash
GET /api/v1/test/match-analysis
```

**What it does:**
- Shows how your current profile matches with internships
- Returns detailed score breakdown
- Shows top 5 recommendations with match percentages

**Example Response:**
```json
{
  "success": true,
  "student_profile": {
    "skills": ["Python", "React", "SQL"],
    "location": "Mumbai",
    "career_objective": "Software developer..."
  },
  "recommendations": [
    {
      "rank": 1,
      "title": "Software Developer",
      "company": "Joy Banerjee",
      "match_percentage": 85.5,
      "reasons": ["5/6 skills match", "Convenient location"],
      "score_breakdown": {
        "skill_score": 0.85,
        "location_score": 0.80,
        "stipend_score": 0.70,
        "timeline_score": 0.75
      }
    }
  ]
}
```

#### 2. **Compare Students Endpoint**
```bash
GET /api/v1/test/compare-students
```

**What it does:**
- Shows your student vector (what's being matched)
- Compares your profile with available internships
- Shows matching algorithm details

#### 3. **Internship Details Endpoint**
```bash
GET /api/v1/test/internship-details/{internship_id}
```

**What it does:**
- Shows detailed matching analysis for a specific internship
- Explains why it matched (or didn't match)
- Shows score breakdown

### Method 2: Using Browser/Postman

1. **Login as a student** to get authentication token
2. **Call the test endpoint:**
   ```
   GET http://localhost:8001/api/v1/test/match-analysis
   Headers: Authorization: Bearer <your_token>
   ```
3. **Check the response** to see:
   - Which internships matched
   - Match percentages
   - Reasons for matching

### Method 3: Check Logs

Monitor the recommendation engine logs:
- Check the terminal output where you're running the student backend server
- Look for log messages containing: "recommendations", "match_percentage", "Processed", "FAISS"

**What to look for:**
- `✅ Processed X internships successfully` - Data loaded
- `Generated scores for X internships` - Matching completed
- `Match percentage: XX%` - Scores calculated

### Method 4: Manual Testing Steps

1. **Create a test student profile:**
   - Add specific skills (e.g., "Python", "React")
   - Set location preference
   - Add career objective

2. **Create test internships:**
   - One with matching skills → Should get high match %
   - One with different skills → Should get lower match %
   - One in same location → Should boost location score

3. **Check recommendations:**
   - Matching skills internship should rank #1
   - Different skills should rank lower
   - Location match should boost score

## 📊 What to Verify

### ✅ Correct Matching

1. **Skills Match:**
   - Student with "Python" should match internships requiring "Python"
   - Higher match % for more skill overlap

2. **Location Match:**
   - Same city/state → Higher location score
   - Remote internships → Should match all locations

3. **Stipend Match:**
   - Higher stipend → Higher stipend score
   - Student preference considered

4. **Timeline Match:**
   - Duration preferences considered
   - Start date alignment

### ✅ Performance

1. **Speed:**
   - First load: ~50-100ms (loads from cache)
   - Subsequent: ~10-30ms (uses cached embeddings)

2. **Scalability:**
   - Works with 2 internships (current)
   - Should work with 1000+ internships

### ✅ Data Quality

1. **Embeddings:**
   - Check logs: `Using stored embedding` or `Generating on-the-fly`
   - Null embeddings should be generated automatically

2. **FAISS Index:**
   - Check logs: `Skill index: X vectors`
   - Should match number of internships

## 🔍 Debugging Tips

### If recommendations seem wrong:

1. **Check student profile:**
   ```bash
   GET /api/v1/test/compare-students
   ```
   Verify skills, location are correct

2. **Check internship data:**
   ```bash
   GET /api/v1/test/internship-details/{internship_id}
   ```
   Verify internship skills, location match what you expect

3. **Check match breakdown:**
   - Look at `score_breakdown` in response
   - Verify which component (skills/location/stipend) is affecting match

### If performance is slow:

1. **Check cache:**
   - Check the terminal output where you're running the student backend server
   - Look for log messages containing: "Loaded FAISS", "Cache"
   Should see "Loaded FAISS indices from cache"

2. **Check refresh frequency:**
   - Should only refresh when new internships added
   - Not on every request

## 📝 Example Test Scenarios

### Scenario 1: Perfect Match
- **Student:** Skills: ["Python", "React"], Location: "Mumbai"
- **Internship:** Skills: ["Python", "React"], Location: "Mumbai"
- **Expected:** Match % > 80%

### Scenario 2: Partial Match
- **Student:** Skills: ["Python", "Java"], Location: "Delhi"
- **Internship:** Skills: ["Python", "React"], Location: "Mumbai"
- **Expected:** Match % 50-70% (skills overlap, location mismatch)

### Scenario 3: No Match
- **Student:** Skills: ["Python"], Location: "Mumbai"
- **Internship:** Skills: ["Marketing", "Sales"], Location: "Delhi"
- **Expected:** Match % < 30% or not in top 5

## 🚀 Quick Test Commands

```powershell
# Test with your current profile
curl -X GET "http://localhost:8001/api/v1/test/match-analysis" -H "Authorization: Bearer YOUR_TOKEN"

# Compare your profile
curl -X GET "http://localhost:8001/api/v1/test/compare-students" -H "Authorization: Bearer YOUR_TOKEN"

# Check specific internship
curl -X GET "http://localhost:8001/api/v1/test/internship-details/INTERNSHIP_ID" -H "Authorization: Bearer YOUR_TOKEN"

# Monitor logs
# Check the terminal output where you're running the student backend server
# Look for log messages containing: "recommendations", "match", "Processed"
```

## ✅ Success Criteria

Your recommendation engine is working correctly if:

1. ✅ Recommendations appear on dashboard
2. ✅ Match percentages are reasonable (10-100%)
3. ✅ Top matches have relevant skills
4. ✅ Location preferences are considered
5. ✅ Response time < 100ms after first load
6. ✅ Logs show "Processed X internships successfully"

