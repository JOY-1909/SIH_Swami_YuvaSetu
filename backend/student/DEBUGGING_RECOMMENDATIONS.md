# Debugging: Why Isn't My Internship Showing in Recommendations?

## Quick Steps to Diagnose

### Step 1: Find Your Internship ID

1. Go to MongoDB Atlas or your employer portal
2. Find the internship you just created
3. Copy the `_id` field (ObjectId string)

### Step 2: Check Engine Status

```bash
GET http://localhost:8001/api/v1/recommendations/engine-status
Authorization: Bearer YOUR_TOKEN
```

**Look for:**
- `internship_count` - Should match total internships in database
- `last_refresh` - Should be recent if you called refresh
- `initialized` - Should be `true`

### Step 3: Refresh the Engine (If Needed)

```bash
POST http://localhost:8001/api/v1/recommendations/refresh
Authorization: Bearer YOUR_TOKEN
```

**Wait 30-60 seconds** for refresh to complete.

### Step 4: Debug the Specific Internship

Use the new debug endpoint to see exactly why it's not appearing:

```bash
GET http://localhost:8001/api/v1/recommendations/debug-match/{INTERNSHIP_ID}
Authorization: Bearer YOUR_TOKEN
```

**Replace `{INTERNSHIP_ID}`** with your actual internship ID.

### Step 5: Analyze the Debug Output

The debug endpoint will show:

#### ✅ **In Index?**
- `in_index: true/false` - Is the internship loaded in the recommendation engine?
- If `false`: **Call `/refresh` endpoint**

#### ✅ **Match Score**
- `match_percentage` - Overall match score (0-100%)
- `meets_threshold` - Is it above 25% minimum?
- If below 25%: **Skills may not match as expected**

#### ✅ **Skill Comparison**
- `skill_comparison.matching_skills` - Which skills match
- `skill_comparison.match_ratio` - Percentage of skills that match
- If 0%: **Skills don't match exactly (case-sensitive)**

#### ✅ **Filter Status**
- `filter_status.passed` - Did it pass all filters?
- `filter_status.reasons` - Why it might be filtered out

#### ✅ **Why Not Appearing?**
- `recommendations.will_appear` - Will it show up?
- `recommendations.reasons_why_not` - Exact reasons

## Common Issues & Fixes

### Issue 1: Internship Not in Index

**Symptom**: `in_index: false`

**Fix**:
```bash
# Call refresh endpoint
POST /api/v1/recommendations/refresh
```

**Verify**:
- Check `engine-status` endpoint
- `internship_count` should increase
- Wait for refresh to complete (check logs)

### Issue 2: Skills Don't Match

**Symptom**: `match_ratio: 0%` or `matching_skills: []`

**Causes**:
- **Case sensitivity**: "Python" ≠ "python"
- **Whitespace**: "React " ≠ "React"
- **Different names**: "JavaScript" ≠ "JS"

**Fix**:
- Ensure skills in internship match EXACTLY with user skills (case, spelling, spacing)
- Or use semantic matching (already implemented, but exact matches are better)

### Issue 3: Below Threshold

**Symptom**: `match_percentage < 25%` or `meets_threshold: false`

**Causes**:
- Skills don't match enough
- Location mismatch
- Other factors pulling score down

**Fix**:
- Check skill comparison in debug output
- Ensure at least 1-2 skills match exactly
- Check if location/other factors are too low

### Issue 4: Filtered Out

**Symptom**: `filter_status.passed: false`

**Common Reasons**:
- Internship status is not "active", "open", or "published"
- `is_active` is `false`

**Fix**:
- Set internship `status: "active"` or `is_active: true`

## Example Debug Output

```json
{
  "success": true,
  "internship_id": "67890abcdef123456789",
  "internship": {
    "title": "Python Developer Intern",
    "company": "Tech Corp",
    "skills": ["Python", "Django", "PostgreSQL"]
  },
  "user_profile": {
    "skills": ["Python", "Django", "MongoDB"],
    "skills_count": 3
  },
  "match_analysis": {
    "match_percentage": 68.5,
    "meets_threshold": true,
    "threshold_required": 25.0,
    "skill_score": 67.0,
    "location_score": 80.0,
    "stipend_score": 70.0,
    "timeline_score": 60.0
  },
  "skill_comparison": {
    "user_skills": ["Python", "Django", "MongoDB"],
    "internship_skills": ["Python", "Django", "PostgreSQL"],
    "matching_skills": ["Python", "Django"],
    "matching_count": 2,
    "total_required": 3,
    "match_ratio": 66.67
  },
  "in_index": true,
  "recommendations": {
    "will_appear": true,
    "reasons_why_not": []
  }
}
```

## Step-by-Step Troubleshooting

1. **Refresh the engine** (always do this first after adding internship)
2. **Check engine status** - verify internship count increased
3. **Debug the internship** - see detailed match analysis
4. **Fix issues** based on debug output:
   - If not in index → Refresh
   - If skills don't match → Check exact spelling/case
   - If below threshold → Improve skill matches
   - If filtered → Fix status/is_active
5. **Request recommendations again** - should appear now!

## Still Not Working?

Check the server logs for:
- `📊 Filtering stats` - Shows why internships were filtered
- `✅ Generated X recommendations` - Confirms recommendations were created
- `🔄 New internships detected` - Confirms refresh was triggered

If still stuck, share the debug endpoint output!
