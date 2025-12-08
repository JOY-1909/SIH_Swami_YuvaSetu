# Vector Search Setup and Usage Guide

## Overview

This implementation adds semantic vector search capabilities to the internship system using:

- **sentence-transformers** (all-MiniLM-L6-v2) for generating 384-dimensional embeddings
- **FAISS** (HNSWFlat index) for fast approximate nearest neighbor search
- **Automatic duplicate detection** based on semantic similarity
- **MongoDB** for persistent storage with embedded vectors

## Architecture

```
┌─────────────────┐
│  FastAPI Routes │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Internship Service  │  ← Orchestration Layer
└──────┬──────┬───────┘
       │      │
       ▼      ▼
┌──────────┐ ┌──────────┐
│Embedding │ │  FAISS   │
│ Service  │ │ Service  │
└──────────┘ └──────────┘
       │             │
       ▼             ▼
  [Model]      [Index File]
                    │
       ┌────────────┘
       ▼
  ┌──────────┐
  │ MongoDB  │
  └──────────┘
```

## Installation

### 1. Install Dependencies

```bash
cd yuvasetu-backend
pip install -r requirements.txt
```

This installs:

- `sentence-transformers==2.5.1` - Text embedding generation
- `faiss-cpu==1.8.0` - Vector similarity search
- `torch==2.1.0` - PyTorch backend
- `numpy==1.24.3` - Numerical operations

**Note**: First run will download the `all-MiniLM-L6-v2` model (~80MB) automatically.

### 2. Initialize FAISS Index

For existing internships in the database, generate embeddings and build the FAISS index:

```bash
python -m app.scripts.init_faiss
```

This script will:

1. Connect to MongoDB
2. Fetch all existing internships
3. Generate embeddings for internships without them
4. Build FAISS HNSWFlat index
5. Save index to `data/faiss/internships.index`

**Output Example:**

```
2024-12-02 10:30:15 - INFO - Connecting to database...
2024-12-02 10:30:16 - INFO - Found 150 internships
2024-12-02 10:30:17 - INFO - Processing internship 1/150: Python Developer
2024-12-02 10:30:17 - INFO -   Generating new embedding...
...
2024-12-02 10:32:45 - INFO - FAISS index built successfully
============================================================
INITIALIZATION COMPLETE
============================================================
Total internships processed: 150
New embeddings generated: 150
FAISS index size: 150
Index saved to: data/faiss/internships.index
============================================================
```

### 3. Start the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will:

- Initialize database connection
- Load embedding model (sentence-transformers)
- Load FAISS index from disk
- Start accepting requests

## API Endpoints

### 1. Create Internship (with Duplicate Detection)

**POST** `/internships`

Creates a new internship with automatic embedding generation and optional duplicate detection.

**Request Body:**

```json
{
  "owner_uid": "employer123",
  "organisation_name": "TechCorp",
  "title": "Full Stack Developer Internship",
  "description": "Build modern web applications",
  "skills": ["Python", "React", "PostgreSQL"],
  "location": "Remote",
  "state": "Maharashtra",
  "city": "Mumbai",
  "sector": "Technology",
  "stipend": "₹15000/month",
  "duration_months": 3,
  "is_active": true
}
```

**Query Parameters:**

- `check_duplicate` (bool, default=true): Enable duplicate detection

**Success Response (201 Created):**

```json
{
  "message": "Internship created successfully",
  "internship_id": "674d8e5f9c8a1234567890ab",
  "internship": {
    "id": "674d8e5f9c8a1234567890ab",
    "title": "Full Stack Developer Internship",
    ...
  }
}
```

**Duplicate Detected Response (409 Conflict):**

```json
{
  "detail": {
    "message": "Similar internship already exists",
    "duplicate_id": "674d8e5f9c8a1234567890ac",
    "similarity_distance": 0.15
  }
}
```

**Duplicate Threshold:** Distance ≤ 0.2 (L2 metric)

---

### 2. Semantic Search

**GET** `/internships/search`

Search internships using natural language queries.

**Query Parameters:**

- `query` (required): Natural language search query
- `top_k` (optional, default=10): Number of results to return (1-50)

**Example Requests:**

```bash
# Search by skills
GET /internships/search?query=python+machine+learning+remote

# Search by location and sector
GET /internships/search?query=marketing+internship+bangalore

# Search by stipend and duration
GET /internships/search?query=paid+internship+3+months+design
```

**Response:**

```json
{
  "query": "python machine learning remote",
  "total_results": 10,
  "results": [
    {
      "internship": {
        "id": "674d8e5f9c8a1234567890ab",
        "title": "ML Engineer Internship",
        "skills": ["Python", "TensorFlow", "Scikit-learn"],
        "location": "Remote",
        "sector": "Technology",
        ...
      },
      "similarity_score": 0.25,
      "similarity_percentage": 87.5
    },
    ...
  ]
}
```

**Similarity Metrics:**

- `similarity_score`: L2 distance (lower = better match)
- `similarity_percentage`: 0-100 scale (higher = better match)

---

### 3. Get Internship by ID

**GET** `/internships/{internship_id}`

Retrieve a specific internship.

**Response:**

```json
{
  "id": "674d8e5f9c8a1234567890ab",
  "title": "Full Stack Developer Internship",
  "description": "Build modern web applications",
  ...
}
```

---

### 4. List Internships

**GET** `/internships`

List internships with pagination.

**Query Parameters:**

- `skip` (int, default=0): Records to skip
- `limit` (int, default=20, max=100): Records per page
- `is_active` (bool, optional): Filter by active status

**Response:**

```json
[
  {
    "id": "674d8e5f9c8a1234567890ab",
    "title": "Full Stack Developer Internship",
    ...
  },
  ...
]
```

---

### 5. Update Internship

**PUT** `/internships/{internship_id}`

Update an internship and regenerate its embedding.

**Request Body:**

```json
{
  "title": "Senior Full Stack Developer Internship",
  "stipend": "₹20000/month",
  "is_active": true
}
```

**Response:**

```json
{
  "message": "Internship updated successfully",
  "internship_id": "674d8e5f9c8a1234567890ab",
  "internship": { ... }
}
```

---

### 6. Delete Internship

**DELETE** `/internships/{internship_id}`

Delete an internship and remove from FAISS index.

**Response:** 204 No Content

---

### 7. Health Check

**GET** `/internships/health/faiss`

Check FAISS index health and statistics.

**Response:**

```json
{
  "status": "healthy",
  "faiss_index_size": 150,
  "embedding_dimension": 384,
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "duplicate_threshold": 0.2,
  "device": "cpu"
}
```

## How It Works

### Embedding Generation

Each internship is converted to a combined text string:

```
"skills | location, state, city | sector | stipend | duration_in_months"
```

**Example:**

```
"Python React PostgreSQL | Remote, Mumbai, Maharashtra | Technology | ₹15000/month | 3.0 months"
```

This text is encoded using `sentence-transformers/all-MiniLM-L6-v2` into a 384-dimensional vector.

### FAISS Index Configuration

- **Index Type**: HNSWFlat (Hierarchical Navigable Small World)
- **Parameters**:
  - M=32 (bidirectional links per node)
  - efConstruction=80 (build quality)
  - efSearch=64 (search quality)
- **Metric**: L2 (Euclidean distance)

### Duplicate Detection Logic

1. Generate embedding for new internship
2. Search FAISS for nearest neighbor (k=1)
3. If distance ≤ 0.2 → reject as duplicate
4. Otherwise → insert into MongoDB + FAISS

### Search Flow

1. User submits query: `"python remote internship"`
2. Generate query embedding (384-dim vector)
3. FAISS searches for k nearest neighbors
4. Return top k results with similarity scores
5. Fetch full documents from MongoDB

## Configuration

### Environment Variables

Add to `.env` file (optional):

```bash
# FAISS Configuration
FAISS_INDEX_PATH=data/faiss/internships.index
FAISS_DUPLICATE_THRESHOLD=0.2
FAISS_M=32
FAISS_EF_SEARCH=64
FAISS_EF_CONSTRUCTION=80

# Embedding Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DEVICE=cpu  # or 'cuda' for GPU
```

### Tuning Parameters

**Duplicate Threshold** (`duplicate_threshold`):

- Default: 0.2
- Lower = stricter (fewer duplicates)
- Higher = more lenient (more duplicates)

**FAISS Parameters**:

- `M`: Higher = better accuracy, more memory
- `efSearch`: Higher = better accuracy, slower search
- `efConstruction`: Higher = better accuracy, slower indexing

## Performance

### Benchmarks (on CPU)

- **Embedding Generation**: ~50-100ms per document
- **Duplicate Check**: ~1-5ms with 10k documents
- **Search (k=10)**: ~5-15ms with 10k documents
- **Batch Indexing**: ~100 documents/second

### Scalability

- **FAISS Index**: Handles millions of vectors efficiently
- **Memory Usage**: ~1.5KB per vector (384 floats)
- **Disk Space**: ~1.5KB per vector + overhead

## Maintenance

### Rebuilding Index

If embeddings get corrupted or you change the model:

```bash
# Backup old index
mv data/faiss/internships.index data/faiss/internships.index.backup

# Rebuild
python -m app.scripts.init_faiss
```

### Monitoring

Check index health regularly:

```bash
curl http://localhost:8000/internships/health/faiss
```

Watch for:

- Index size matches MongoDB document count
- No errors in logs
- Reasonable search response times

### Backups

Add to backup routine:

```bash
# Backup FAISS index
tar -czf faiss-backup-$(date +%Y%m%d).tar.gz data/faiss/

# Backup MongoDB (already in your backup strategy)
mongodump --db yuvasetu --out backup/
```

## Troubleshooting

### Issue: "Index file not found"

**Solution:** Run initialization script:

```bash
python -m app.scripts.init_faiss
```

### Issue: "Model download fails"

**Solution:** Manual download:

```bash
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"
```

### Issue: "CUDA out of memory"

**Solution:** Force CPU mode:

```python
# In embedding_service.py
self.device = "cpu"  # Override CUDA detection
```

### Issue: "Search returns no results"

**Causes:**

1. FAISS index is empty → Run init script
2. Query too specific → Broaden search terms
3. Index not loaded → Check startup logs

### Issue: "Duplicate detection too strict/lenient"

**Solution:** Adjust threshold in `faiss_service.py`:

```python
FAISSService(duplicate_threshold=0.3)  # More lenient
FAISSService(duplicate_threshold=0.1)  # More strict
```

## Testing

### Manual Testing

```bash
# 1. Create test internship
curl -X POST http://localhost:8000/internships \
  -H "Content-Type: application/json" \
  -d '{
    "owner_uid": "test123",
    "organisation_name": "TestCorp",
    "title": "Python Developer",
    "description": "Backend development",
    "skills": ["Python", "Django"],
    "location": "Remote",
    "sector": "Technology",
    "is_active": true
  }'

# 2. Search for similar
curl "http://localhost:8000/internships/search?query=python+backend+remote"

# 3. Try to create duplicate
curl -X POST http://localhost:8000/internships \
  -H "Content-Type: application/json" \
  -d '{
    "owner_uid": "test123",
    "organisation_name": "TestCorp",
    "title": "Python Backend Developer",
    "description": "Backend development work",
    "skills": ["Python", "Django"],
    "location": "Remote",
    "sector": "Technology",
    "is_active": true
  }'
# Should return 409 Conflict
```

## Future Enhancements

1. **Hybrid Search**: Combine vector search with keyword filters
2. **MongoDB Vector Index**: Use native MongoDB vector search
3. **Multi-field Boosting**: Weight different fields differently
4. **Background Re-indexing**: Periodic batch updates
5. **Analytics Dashboard**: Search metrics and duplicate statistics
6. **A/B Testing**: Test different embedding models

## Support

For issues or questions:

- Check logs: `app/logs/` or console output
- Review this documentation
- Check FAISS service health endpoint
- Verify MongoDB connectivity

---

**Version**: 1.0  
**Last Updated**: December 2, 2024
