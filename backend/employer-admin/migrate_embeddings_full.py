#!/usr/bin/env python3
"""Migration: populate embedding and embedding_text for internships

This script will:
 - find internships where `embedding` is missing or null, or `embedding_text` is missing
 - generate embedding vector and build embedding_text using the EmbeddingService
 - save fields back to MongoDB
"""
import asyncio
from app.database import init_db, close_db
from app.models.internship import Internship
from app.services.embedding_service import get_embedding_service

async def main():
    await init_db()
    try:
        svc = get_embedding_service()
        print(f"Embedding service ready (model: {svc.model_name}, device: {svc.device})")

        # Find internships missing embedding or embedding_text
        print("Querying internships with missing embedding or embedding_text...")
        # Beanie query: use find where embedding == None OR embedding_text doesn't exist
        docs = await Internship.find({"$or": [{"embedding": None}, {"embedding_text": {"$exists": False}}]}).to_list()
        total = len(docs)
        print(f"Found {total} documents to process")

        updated = 0
        for i, doc in enumerate(docs, 1):
            try:
                print(f"[{i}/{total}] Processing ID: {doc.id} | Title: {doc.title}")
                # build text and embedding using safe attribute access
                skills = getattr(doc, 'skills', None)
                location = getattr(doc, 'location', None)
                state = getattr(doc, 'state', None)
                city = getattr(doc, 'city', None)
                sector = getattr(doc, 'sector', None)
                # stipend may have been migrated to stipend_amount_min/max
                stipend = getattr(doc, 'stipend', None)
                if stipend is None:
                    s_min = getattr(doc, 'stipend_amount_min', None)
                    s_max = getattr(doc, 'stipend_amount_max', None)
                    if s_min is not None and s_max is not None:
                        stipend = f"{s_min}-{s_max}"
                    elif s_min is not None:
                        stipend = str(s_min)
                    elif s_max is not None:
                        stipend = str(s_max)

                work_mode = getattr(doc, 'work_mode', None)
                internship_type = getattr(doc, 'internship_type', None)
                duration_days = getattr(doc, 'duration_days', None)
                duration_weeks = getattr(doc, 'duration_weeks', None)
                duration_months = getattr(doc, 'duration_months', None)

                # build text and embedding
                text = svc.build_internship_text(
                    skills=skills,
                    location=location,
                    state=state,
                    city=city,
                    sector=sector,
                    stipend=stipend,
                    work_mode=work_mode,
                    internship_type=internship_type,
                    duration_days=duration_days,
                    duration_weeks=duration_weeks,
                    duration_months=duration_months,
                )
                emb = svc.generate_embedding(text)
                doc.embedding = emb
                doc.embedding_text = text
                await doc.save()
                updated += 1
                print(f"   ✅ Updated: embedding len={len(emb)}")
            except Exception as e:
                print(f"   ❌ Error for {doc.id}: {e}")

        print("\nMigration complete")
        print(f"Total processed: {total}, Updated: {updated}")
    finally:
        await close_db()

if __name__ == '__main__':
    asyncio.run(main())
