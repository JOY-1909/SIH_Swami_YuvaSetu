# How to Refresh Recommendations After Adding New Internships

## Problem

When you add a new internship from the employer portal, it may not appear in student recommendations immediately because the recommendation engine uses cached FAISS indices.

## Solution 1: Manual Refresh (Immediate)

### Option A: Use the API Endpoint

Call the refresh endpoint after adding a new internship:

```bash
POST http://localhost:8001/api/v1/recommendations/refresh
Authorization: Bearer YOUR_TOKEN
```

Or from your frontend/employer portal:

```javascript
// After creating an internship
await fetch('http://localhost:8001/api/v1/recommendations/refresh', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Option B: Check Engine Status

To see current status:

```bash
GET http://localhost:8001/api/v1/recommendations/engine-status
Authorization: Bearer YOUR_TOKEN
```

## Solution 2: Automatic Refresh (Improved)

The system now checks for new internships on every recommendation request. If a new internship is detected, it automatically refreshes in the background.

**Timeline:**
- New internship added → Saved to database
- Next recommendation request → Detects count change
- Background refresh starts → Updates indices (~30-60s)
- Following requests → New internship appears

## Solution 3: Webhook Integration (Best for Production)

For real-time updates, call the refresh endpoint from your employer portal when creating internships:

### In Employer Portal (backend/employer-admin)

```python
# After creating an internship
@router.post("/internships")
async def create_internship(internship: InternshipCreate):
    # ... create internship in database ...
    
    # Trigger recommendation engine refresh (non-blocking)
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://localhost:8001/api/v1/recommendations/refresh",
                headers={"Authorization": "Bearer admin_token"},
                timeout=60.0  # Allow time for refresh
            )
        logger.info("✅ Triggered recommendation engine refresh")
    except Exception as e:
        logger.warning(f"⚠️ Failed to trigger refresh: {e}")
        # Non-blocking - will be picked up automatically
    
    return new_internship
```

## How It Works

1. **Cache Check**: System checks internship count in database vs cached index
2. **Auto-Detect**: If counts differ, triggers background refresh
3. **Background Refresh**: 
   - Loads all internships from database
   - Generates embeddings (or uses pre-computed)
   - Rebuilds FAISS indices
   - Saves to disk cache
4. **Immediate Effect**: Next request uses updated index

## Testing

1. Add a new internship with skills matching a student's profile
2. Call the refresh endpoint:
   ```bash
   curl -X POST http://localhost:8001/api/v1/recommendations/refresh \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
3. Wait 30-60 seconds for refresh to complete
4. Check engine status to verify:
   ```bash
   curl http://localhost:8001/api/v1/recommendations/engine-status \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
5. Request recommendations - new internship should appear with high match score

## Troubleshooting

### Internship still not appearing?

1. **Check if refresh completed**:
   - Look at engine status - internship_count should increase
   - Check server logs for "✅ Background refresh complete"

2. **Verify internship is in database**:
   - Check MongoDB Atlas for the new internship
   - Ensure it has required fields (skills, location, etc.)

3. **Check match threshold**:
   - Default is 25% minimum match
   - If skills match exactly, score should be >25%
   - Check logs for "Filtering stats" to see if filtered out

4. **Verify skills match**:
   - Check student's skills in database
   - Compare with internship requirements
   - Skills should match exactly or be semantically similar

### Performance Notes

- **Refresh takes**: 30-60 seconds (depending on internship count)
- **Refresh happens**: In background (doesn't block requests)
- **Frequency**: Auto-checks every 5 minutes on requests
- **Manual refresh**: Available anytime via API

## Next Steps

For production, implement the webhook approach (Solution 3) so refreshes happen automatically when internships are created/updated.
