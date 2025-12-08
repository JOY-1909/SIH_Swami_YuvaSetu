# Recommendation Engine - How It Works

## Overview

Your recommendation engine is a **sophisticated AI-powered matching system** that uses:
- **Semantic embeddings** (Sentence Transformers) for skill matching
- **FAISS** (Facebook AI Similarity Search) for fast vector similarity search
- **Multi-factor scoring** combining skills, location, stipend, and timeline
- **Smart caching** for performance optimization

## Architecture Components

### 1. **Main Engine Class: `YuvaSetuRecommendationEngine`**
The core recommendation engine that orchestrates everything.

**Key Features:**
- Singleton pattern (one instance shared across requests)
- Lazy initialization with background loading
- Automatic caching and refresh

### 2. **Supporting Classes:**

#### **a) SkillSignatureManager** (Lines 272-486)
- Manages skill embeddings and similarity calculations
- Detects semantic matches between user skills and internship requirements
- Handles skill enhancement detection (similar vs different skills)

#### **b) InternshipIndexManager** (Lines 652-873)
- Manages FAISS indices for fast similarity search
- Stores internship metadata and embeddings
- Handles loading from database and caching to disk

#### **c) MatchExplanationGenerator** (Lines 875+)
- Generates detailed explanations for why an internship matches
- Creates score breakdowns (skills, location, stipend, timeline)
- Provides recommendation reasons and action items

#### **d) StudentProfileCache** (Lines 492+)
- Caches user profile vectors for performance
- Smart invalidation when user profile changes
- TTL-based cache expiration (24 hours default)

## How Recommendations Work (Step-by-Step)

### Phase 1: Initialization (First Request or After Timeout)

```
1. Load SentenceTransformer model (all-MiniLM-L6-v2)
   - Creates embeddings from text (skills, descriptions, etc.)
   - 384-dimensional vectors

2. Connect to employer database (yuvasetu-main)
   - Fetch all internships from "internships" collection
   - Process in batches to avoid memory issues

3. Generate embeddings for internships
   - Skills: Combine required skills into text → embed
   - Location: Convert coordinates to normalized vectors
   - Stipend: Normalize stipend values (0-1 range)
   - Timeline: Normalize duration (months)

4. Build FAISS indices
   - Separate indices for: skills, location, stipend, timeline
   - Store on disk for fast reload

5. Cache metadata
   - Store internship data (title, company, description, etc.)
   - Keep in memory for fast access
```

### Phase 2: Getting Recommendations for a User

When `/api/v1/recommendations/for-student` is called:

```
Step 1: Extract User Profile
├── Skills (with levels)
├── Education (degree, field, institution)
├── Experience (role, company)
├── Projects (title, technologies)
├── Career objective
├── Location (coordinates)
└── Preferred stipend

Step 2: Generate User Vectors (or use cache)
├── Skill Vector: Combine all skills/education/experience into text → embed
├── Location Vector: Normalize user's coordinates
├── Stipend Vector: Normalize preferred stipend
└── Timeline Vector: Default preference

Step 3: FAISS Search
├── Search skill index → Find top-k similar internships (cosine similarity)
├── Search location index → Find top-k nearby internships
├── Get corresponding scores for each internship
└── Search returns: (scores, indices)

Step 4: Aggregate Scores
├── For each candidate internship:
│   ├── Skill score: From FAISS similarity (0.0 - 1.0)
│   ├── Location score: From location search (0.0 - 1.0)
│   ├── Stipend score: Default 0.7 (or calculated)
│   └── Timeline score: Default 0.6 (or calculated)
│
├── Apply filter boosts (if filters provided):
│   └── Multiply skill score by 1.2 if matches filter
│
└── Calculate weighted score:
    weighted = (skill × 0.50) + (location × 0.20) + (stipend × 0.15) + (timeline × 0.15)

Step 5: Filter and Rank
├── Sort by weighted score (highest first)
├── Filter out matches below threshold (25% default)
├── Apply user filters (location, work_type, stipend, etc.)
└── Keep top-k results

Step 6: Generate Explanations
├── For each recommendation:
│   ├── Analyze skill matches (exact, semantic, related)
│   ├── Calculate location compatibility
│   ├── Assess stipend match
│   ├── Evaluate timeline fit
│   └── Generate human-readable reasons

Step 7: Return Results
└── List of recommendations with:
    ├── Match percentage (0-100%)
    ├── Score breakdown (skills, location, stipend, timeline)
    ├── Detailed explanation
    └── Recommendation reasons
```

## Scoring System

### Weight Distribution (Default)
- **Skills**: 50% (most important)
- **Location**: 20%
- **Stipend**: 15%
- **Timeline**: 15%

### Match Thresholds
- **Minimum to show**: 25% (configurable in `recommendation_config.py`)
- **Excellent match**: ≥80%
- **Good match**: ≥60%
- **Moderate match**: ≥45%
- **Low match**: ≥35%

### Score Calculation Example

```
User Profile:
- Skills: ["Python", "React", "MongoDB"]
- Location: Mumbai (19.0760° N, 72.8777° E)
- Preferred stipend: ₹15,000/month

Internship:
- Required skills: ["Python", "JavaScript", "MongoDB"]
- Location: Mumbai
- Stipend: ₹20,000/month
- Duration: 3 months

Calculation:
1. Skill match: 2/3 skills match exactly → 0.67 (67%)
2. Location match: Same city → 1.0 (100%)
3. Stipend match: 20k/15k = 1.33 → normalized → 0.9 (90%)
4. Timeline match: Default → 0.6 (60%)

Weighted Score:
(0.67 × 0.50) + (1.0 × 0.20) + (0.9 × 0.15) + (0.6 × 0.15)
= 0.335 + 0.20 + 0.135 + 0.09
= 0.76 → 76% match
```

## Caching Strategy

### 1. **Internship Index Cache**
- **Location**: `{temp_dir}/recommendation_cache/`
- **Contents**: FAISS indices + metadata
- **Refresh**: On-demand or after 1 hour
- **Benefit**: Fast startup (loads in seconds vs minutes)

### 2. **Student Profile Cache**
- **Location**: In-memory (LRU cache)
- **Size**: Max 1000 users
- **TTL**: 24 hours
- **Invalidation**: When user profile changes significantly
- **Benefit**: Reuse embeddings for repeat requests

### 3. **Skill Embedding Cache**
- **Location**: In-memory (LRU cache)
- **Size**: Max 5000 skill embeddings
- **Benefit**: Avoid re-embedding same skills

## Performance Optimizations

1. **Batch Processing**: Processes internships in batches (32 at a time)
2. **Thread Pool**: Uses 4 worker threads for CPU-bound operations
3. **Lazy Loading**: Model loads only when needed
4. **FAISS**: Ultra-fast similarity search (handles millions of vectors)
5. **Smart Caching**: Only recalculates when necessary
6. **Timeout Protection**: Prevents hanging on slow operations

## Configuration

All settings are in `app/config/recommendation_config.py`:

```python
MIN_MATCH_THRESHOLD = 25.0  # Minimum % to show
DEFAULT_WEIGHTS = {
    "skills": 0.50,
    "location": 0.20,
    "stipend": 0.15,
    "timeline": 0.15
}
CACHE_DURATION_HOURS = 1
STUDENT_CACHE_TTL_HOURS = 24
SKILL_SIMILARITY_THRESHOLD = 0.75  # For semantic matching
```

## Data Flow

```
User Request
    ↓
API Endpoint (/api/v1/recommendations/for-student)
    ↓
Get Recommendation Engine Instance (singleton)
    ↓
Check if initialized → Initialize if needed
    ↓
Extract user profile from database
    ↓
Get/Generate user vectors (check cache first)
    ↓
FAISS Search (4 separate searches: skills, location, stipend, timeline)
    ↓
Aggregate scores → Apply filters → Rank
    ↓
Generate explanations for top matches
    ↓
Return JSON response
```

## Current Status

Based on your code, the engine:
- ✅ Uses `all-MiniLM-L6-v2` model (384 dimensions)
- ✅ Connects to `yuvasetu-main` database for internships
- ✅ Uses FAISS for fast similarity search
- ✅ Implements comprehensive caching
- ✅ Generates detailed explanations
- ✅ Handles filters (location, work_type, stipend, etc.)
- ✅ Has timeout protection (25s initialization, 20s recommendation)
- ✅ Falls back to trending if no personalized matches

## Monitoring & Debugging

**Log Messages to Watch:**
- `🚀 Initializing Yuva Setu Recommendation Engine...` - Startup
- `✅ Engine initialized in X.XXs` - Success
- `🎯 get_recommendations_for_student called` - Request received
- `✅ Generated X recommendations` - Results ready
- `📊 Filtering stats: X below threshold, Y missing data, Z filtered` - Debug info

**Common Issues:**
1. **No recommendations**: Check if internships exist in database
2. **Slow initialization**: First load takes time (30-60s), subsequent loads use cache
3. **Low match scores**: Adjust `MIN_MATCH_THRESHOLD` or weights in config
4. **Timeout errors**: Increase timeout values if database is slow

## Future Enhancements Possible

- Learn from user feedback to adjust weights
- Real-time updates when internships change
- A/B testing for different scoring algorithms
- Multi-model ensembling for better accuracy
- Personalized weights per user based on preferences

