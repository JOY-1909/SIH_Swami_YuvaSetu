# Filter Debugging Guide

## Common Filter Issues & Fixes

### Issue 1: Location Filter Not Working

**Symptoms:**
- Setting location filter shows no results
- Internships from that location not appearing

**Common Causes:**
1. **Case sensitivity**: "Mumbai" ≠ "mumbai" (now fixed - case-insensitive)
2. **Exact match required**: Filter might be too strict
3. **Format differences**: "Pune, Maharashtra" vs "Pune"

**Fix Applied:**
- ✅ Made location matching case-insensitive
- ✅ Added substring matching (e.g., "Pune" matches "Pune, Maharashtra")
- ✅ Checks location, city, and state fields
- ✅ Handles comma-separated values
- ✅ Special handling for "Remote" filter

**Test:**
```bash
GET /api/v1/recommendations/for-student?location=Mumbai
GET /api/v1/recommendations/for-student?location=Remote
```

### Issue 2: Work Type Filter Not Working

**Symptoms:**
- Setting work_type filter shows no results
- Remote/WFH/WFO filters not working

**Common Causes:**
1. **Value format**: Work type might be stored differently (e.g., "Remote" vs "REMOTE" vs "Work From Home")
2. **Field name**: Might be stored as `is_remote` instead of `work_type`

**Fix Applied:**
- ✅ Case-insensitive matching
- ✅ Handles multiple formats: "Remote", "WFH", "Work From Home", "WFO", "Work From Office"
- ✅ Checks both `work_type` field and `is_remote` boolean
- ✅ Supports comma-separated values (e.g., "Remote,WFH")

**Test:**
```bash
GET /api/v1/recommendations/for-student?work_type=Remote
GET /api/v1/recommendations/for-student?work_type=WFH
GET /api/v1/recommendations/for-student?work_type=WFO
```

### Issue 3: Stipend Filter Not Working

**Symptoms:**
- min_stipend or max_stipend filters showing wrong results
- No results when stipend range is set

**Common Causes:**
1. **Stipend format**: Might be stored as string instead of number
2. **Currency differences**: Filter might be in different currency
3. **Zero values**: Internships with 0 stipend being filtered out

**Fix Applied:**
- ✅ Proper type checking and conversion
- ✅ Handles both string and numeric stipend values
- ✅ Min/max comparisons fixed

**Test:**
```bash
GET /api/v1/recommendations/for-student?min_stipend=5000
GET /api/v1/recommendations/for-student?max_stipend=20000
```

### Issue 4: Duration Filter Not Working

**Symptoms:**
- Duration filter shows no results
- Common durations like "3 months" not matching

**Common Causes:**
1. **Format differences**: "3 months" vs "3 month" vs "3-months"
2. **Numeric vs string**: Duration stored as months vs duration string

**Fix Applied:**
- ✅ Handles multiple formats: "1 month", "2 months", "3 month", etc.
- ✅ Word boundary matching (prevents "3 months" matching "13 months")
- ✅ Numeric comparison using `duration_months` field
- ✅ Flexible matching (±0.5 months tolerance)

**Test:**
```bash
GET /api/v1/recommendations/for-student?duration=3%20months
GET /api/v1/recommendations/for-student?duration=6%20months
```

## How Filters Work Now

### Filter Application Flow

```
1. User sets filters in frontend
   ↓
2. API receives filters as query parameters
   ↓
3. Filters passed to recommendation engine
   ├── Engine applies filters during scoring (boosts matching internships)
   └── Engine applies strict filtering (removes non-matching)
   ↓
4. API applies post-processing filters (double-check)
   ↓
5. Results returned to user
```

### Filter Types

#### Location Filter
- **Supports**: City names, state names, "Remote"
- **Matching**: Case-insensitive, substring matching, checks location/city/state
- **Example**: `location=Mumbai` matches "Mumbai", "Mumbai, Maharashtra", etc.

#### Work Type Filter
- **Supports**: "Remote", "WFH", "Work From Home", "WFO", "Work From Office", "Hybrid", "Onsite"
- **Matching**: Case-insensitive, checks both `work_type` field and `is_remote` boolean
- **Example**: `work_type=Remote` matches internships where `is_remote=true` or `work_type` contains "Remote"

#### Stipend Filter
- **Supports**: Numeric values (min and max)
- **Matching**: Direct numeric comparison
- **Example**: `min_stipend=5000&max_stipend=20000` shows internships with stipend between 5000 and 20000

#### Duration Filter
- **Supports**: "1 month", "2 months", "3 months", "6 months", "45 days"
- **Matching**: String matching + numeric comparison using `duration_months`
- **Example**: `duration=3 months` matches internships with duration around 3 months (±0.5 months tolerance)

## Testing Filters

### Use the Debug Endpoint

```bash
# Test if a specific internship passes your filters
GET /api/v1/recommendations/debug-match/{INTERNSHIP_ID}?location=Mumbai&work_type=Remote
```

This shows:
- If internship matches each filter
- Why it might be filtered out
- What the match scores are

### Check Logs

Look for these log messages:
- `🔍 Applied filters: {...}` - Shows what filters were applied
- `📊 Filter breakdown - Engine returned: X, After post-processing filters: Y` - Shows filtering results
- `Filtered out {internship_id}: {score}% (active filters: {...})` - Shows why internships were filtered

## Common Filter Values

### Location
- City names: `Mumbai`, `Delhi`, `Bangalore`, `Pune`
- State names: `Maharashtra`, `Karnataka`, `Tamil Nadu`
- Remote: `Remote`

### Work Type
- `Remote`
- `WFH` or `Work From Home`
- `WFO` or `Work From Office` or `Onsite`
- `Hybrid`

### Duration
- `1 month` or `1 months`
- `2 months` or `2 month`
- `3 months` or `3 month`
- `6 months` or `6 month`
- `45 days` or `45 day`

## Troubleshooting

### No Results After Applying Filter?

1. **Check filter value**:
   - Verify exact spelling and format
   - Check if value exists in any internships
   - Use debug endpoint to test specific internship

2. **Check logs**:
   - Look for "Filtered out" messages
   - Check "Filter breakdown" to see how many were filtered

3. **Test without filters**:
   - First get recommendations without filters
   - Then add filters one by one to identify problematic filter

4. **Use debug endpoint**:
   - Test specific internship ID with your filters
   - See exact reason why it's being filtered

### Filter Too Strict?

The filters are now more flexible:
- Location: Substring matching (e.g., "Pune" matches "Pune, Maharashtra")
- Work type: Multiple format support
- Duration: Flexible matching with tolerance
- Case-insensitive matching for all text filters

### Still Not Working?

1. Check server logs for filter-related messages
2. Use debug endpoint to test specific internship
3. Verify internship data in MongoDB (check field values)
4. Try filters individually to isolate the issue
