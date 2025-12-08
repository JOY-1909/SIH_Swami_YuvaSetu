# Quick Start Guide - Vector Search Implementation

## 🚀 Installation (5 minutes)

### Step 1: Install Dependencies

```bash
cd yuvasetu-backend
pip install -r requirements.txt
```

**What happens:**

- Installs FastAPI, sentence-transformers, FAISS, PyTorch
- First run downloads all-MiniLM-L6-v2 model (~80MB)
- Takes ~2-3 minutes depending on connection

### Step 2: Initialize FAISS Index

```bash
python -m app.scripts.init_faiss
```

**What happens:**

- Connects to MongoDB
- Generates embeddings for all existing internships
- Builds FAISS index
- Saves to `data/faiss/internships.index`
- Takes ~1-2 minutes for 100 internships

### Step 3: Start Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Check it works:**

```bash
curl http://localhost:8000/internships/health/faiss
```

Expected response:

```json
{
  "status": "healthy",
  "faiss_index_size": 150,
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  ...
}
```

---

## 🎯 Basic Usage

### Create Internship (with duplicate detection)

```bash
curl -X POST http://localhost:8000/internships \
  -H "Content-Type: application/json" \
  -d '{
    "owner_uid": "emp123",
    "organisation_name": "TechCorp",
    "title": "Python Developer Internship",
    "description": "Backend development with Django",
    "skills": ["Python", "Django", "PostgreSQL"],
    "location": "Remote",
    "sector": "Technology",
    "stipend": "₹15000/month",
    "duration_months": 3,
    "is_active": true
  }'
```

**Result:** Returns 201 Created with internship ID

### Search Internships

```bash
# By skills
curl "http://localhost:8000/internships/search?query=python+django+backend"

# By location
curl "http://localhost:8000/internships/search?query=remote+technology+internship"

# By sector and duration
curl "http://localhost:8000/internships/search?query=marketing+3+months+mumbai"
```

**Result:** Returns ranked list of similar internships

### Try Duplicate Detection

```bash
# Create first internship
curl -X POST http://localhost:8000/internships \
  -H "Content-Type: application/json" \
  -d '{"owner_uid":"emp1","organisation_name":"Corp","title":"Python Dev","description":"Backend","skills":["Python"],"location":"Remote","sector":"Tech","is_active":true}'

# Try to create similar one
curl -X POST http://localhost:8000/internships \
  -H "Content-Type: application/json" \
  -d '{"owner_uid":"emp1","organisation_name":"Corp","title":"Python Developer","description":"Backend work","skills":["Python"],"location":"Remote","sector":"Tech","is_active":true}'
```

**Result:** Second request returns 409 Conflict with duplicate info

---

## 📊 Understanding Results

### Search Response Format

```json
{
  "query": "python machine learning",
  "total_results": 3,
  "results": [
    {
      "internship": { ... },
      "similarity_score": 0.25,      // Lower = better (L2 distance)
      "similarity_percentage": 87.5  // Higher = better (0-100)
    }
  ]
}
```

**Interpreting Scores:**

- `similarity_score` < 0.2: Very similar
- `similarity_score` 0.2-0.5: Moderately similar
- `similarity_score` > 0.5: Less similar

---

## 🔧 Common Tasks

### Check Index Status

```bash
curl http://localhost:8000/internships/health/faiss
```

### Rebuild Index (if needed)

```bash
python -m app.scripts.init_faiss
```

### Search with Different Result Counts

```bash
# Top 5 results
curl "http://localhost:8000/internships/search?query=python&top_k=5"

# Top 20 results
curl "http://localhost:8000/internships/search?query=python&top_k=20"
```

### Disable Duplicate Check (for testing)

```bash
curl -X POST "http://localhost:8000/internships?check_duplicate=false" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## 🐛 Troubleshooting

### "Index file not found"

```bash
# Solution: Initialize the index
python -m app.scripts.init_faiss
```

### "Search returns no results"

```bash
# Check index size
curl http://localhost:8000/internships/health/faiss

# If index_size is 0, rebuild:
python -m app.scripts.init_faiss
```

### "Duplicate detection too strict/lenient"

Edit `app/services/faiss_service.py`:

```python
# Line 20
duplicate_threshold: float = 0.3  # Increase for more lenient
# OR
duplicate_threshold: float = 0.1  # Decrease for stricter
```

Then restart server.

---

## 📚 Next Steps

1. **Read Full Documentation**: `VECTOR_SEARCH_GUIDE.md`
2. **Test Duplicate Detection**: Create similar internships
3. **Try Different Queries**: Test semantic search capabilities
4. **Monitor Performance**: Check health endpoint regularly
5. **Set Up Backups**: Backup `data/faiss/` directory

---

## 🎓 Example Queries to Try

```bash
# Skill-based search
curl "http://localhost:8000/internships/search?query=react+frontend+javascript"

# Location-based search
curl "http://localhost:8000/internships/search?query=bangalore+startup+office"

# Duration and stipend
curl "http://localhost:8000/internships/search?query=6+months+paid+full+time"

# Sector-specific
curl "http://localhost:8000/internships/search?query=digital+marketing+social+media"

# Combined criteria
curl "http://localhost:8000/internships/search?query=python+data+science+remote+3+months"
```

---

## ✅ Success Checklist

- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Model downloaded (automatic on first run)
- [ ] FAISS index initialized (`python -m app.scripts.init_faiss`)
- [ ] Server running (`uvicorn app.main:app --reload`)
- [ ] Health check passes (`/internships/health/faiss`)
- [ ] Can create internships (POST `/internships`)
- [ ] Can search internships (GET `/internships/search`)
- [ ] Duplicate detection works (try creating similar internships)

---

**Need Help?** Check `VECTOR_SEARCH_GUIDE.md` for detailed documentation.
