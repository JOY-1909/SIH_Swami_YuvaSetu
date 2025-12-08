"""
Internship map & statistics endpoints used by the student frontend.

These endpoints aggregate data from the employer/admin MongoDB cluster when
available, but always return safe, structured responses so the map UI can
render even when there is no data yet.
"""

from typing import Dict, Any

from fastapi import APIRouter, HTTPException
import logging

from app.database.multi_cluster import get_employer_database

router = APIRouter(prefix="/map", tags=["Internship Map"])
logger = logging.getLogger(__name__)


@router.get("/state-statistics")
async def get_state_statistics() -> Dict[str, Any]:
    """
    Aggregate internship statistics per Indian state.

    The frontend expects a payload:
    {
        "stateStats": {
            "IN-MH": {
                "name": "Maharashtra",
                "companies": 0,
                "hiredInternships": 0,
                "pmInternships": 0,
                "activeInternships": 0,
                "studentsHired": 0
            },
            ...
        }
    }

    If the employer database or collection is unavailable, this returns an
    empty map rather than raising 5xx errors so the UI can still render.
    """
    try:
        employer_db = await get_employer_database()
        internships = employer_db.internships

        cursor = internships.find({})
        docs = await cursor.to_list(length=None)

        state_stats: Dict[str, Dict[str, Any]] = {}

        for doc in docs:
            state_code = doc.get("state_code") or doc.get("state") or "IN-UN"
            name = doc.get("state_name") or doc.get("state") or "Unknown"

            stats = state_stats.setdefault(
                state_code,
                {
                    "name": name,
                    "companies": 0,
                    "hiredInternships": 0,
                    "pmInternships": 0,
                    "activeInternships": 0,
                    "studentsHired": 0,
                },
            )

            stats["companies"] += 1 if doc.get("company") else 0
            stats["activeInternships"] += 1 if doc.get("status") in {"active", "open"} else 0
            stats["pmInternships"] += 1 if str(doc.get("category", "")).lower().startswith("pm") else 0
            stats["studentsHired"] += int(doc.get("hired_count", 0) or 0)

        return {"stateStats": state_stats}
    except Exception as exc:  # noqa: BLE001
        # Log and return an empty structure rather than failing the entire dashboard
        logger.error("Failed to compute state statistics: %s", exc)
        return {"stateStats": {}}


@router.get("/statistics-summary")
async def get_statistics_summary() -> Dict[str, Any]:
    """
    Summary metrics used by the IndiaInternshipMap header cards.

    Payload shape:
    {
        "total_companies": 0,
        "total_internships": 0,
        "active_internships": 0,
        "closed_internships": 0,
        "pm_internships": 0,
        "total_applications": 0,
        "students_hired": 0
    }
    """
    try:
        employer_db = await get_employer_database()
        internships = employer_db.internships

        cursor = internships.find({})
        docs = await cursor.to_list(length=None)

        total_companies = set()
        total_internships = len(docs)
        active_internships = 0
        closed_internships = 0
        pm_internships = 0
        total_applications = 0
        students_hired = 0

        for doc in docs:
            if doc.get("company"):
                total_companies.add(doc["company"])

            status = str(doc.get("status", "")).lower()
            if status in {"active", "open", "published"}:
                active_internships += 1
            elif status in {"closed", "filled"}:
                closed_internships += 1

            if str(doc.get("category", "")).lower().startswith("pm"):
                pm_internships += 1

            total_applications += int(doc.get("applications", 0) or 0)
            students_hired += int(doc.get("hired_count", 0) or 0)

        return {
            "total_companies": len(total_companies),
            "total_internships": total_internships,
            "active_internships": active_internships,
            "closed_internships": closed_internships,
            "pm_internships": pm_internships,
            "total_applications": total_applications,
            "students_hired": students_hired,
        }
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to compute statistics summary: %s", exc)
        # Safe default – the map will show zeroed metrics instead of crashing
        return {
            "total_companies": 0,
            "total_internships": 0,
            "active_internships": 0,
            "closed_internships": 0,
            "pm_internships": 0,
            "total_applications": 0,
            "students_hired": 0,
        }


