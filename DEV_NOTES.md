### YuvaSetu Monorepo – Dev Notes

- **Ports & Base URLs.**
  - Employer/Admin backend (`backend/employer-admin`): `http://127.0.0.1:8000`
  - Student backend (`backend/student`): `http://127.0.0.1:8001`
  - Admin frontend (`frontend/admin`): `http://localhost:8081` – proxied to employer-admin backend at `http://127.0.0.1:8000` via `vite.config.ts`
  - Employer frontend (`frontend/employer`): `http://localhost:8082` – proxied to employer-admin backend at `http://127.0.0.1:8000` via `vite.config.ts`
  - Student frontend (`frontend/student`): `http://localhost:8080` – uses `src/services/api.ts` with:
    - `VITE_STUDENT_API_URL` or `VITE_API_URL` (env) **or** defaults to `http://localhost:8001`

- **Root NPM Scripts (from repo root)**
  - `npm run dev:be-emp` → `cd backend/employer-admin && uvicorn app.main:app --reload --port 8000`
  - `npm run dev:be-stu` → `cd backend/student && uvicorn app.main:app --reload --port 8001`
  - `npm run dev:fe-emp` → `cd frontend/employer && npm run dev`
  - `npm run dev:fe-admin` → `cd frontend/admin && npm run dev`
  - `npm run dev:fe-stu` → `cd frontend/student && npm run dev`
  - `npm run dev:all` → prints helper instructions to start all 5 processes in separate terminals.

- **Student Recommendations & Map**
  - Recommendation engine (`app/services/recommendation_engine.py`) is loaded once via `get_recommendation_engine` and uses FAISS indices; if there are no internships it returns an empty list rather than raising.
  - `/api/v1/recommendations/for-student` now:
    - Returns `RecommendationsResponse` matching `frontend/student/src/types/recommendations.ts`.
    - Falls back to trending internships using `get_trending_internships` with safe defaults (no `KeyError` on missing `id` / `_id`).
  - New map endpoints in student backend, used by `IndiaInternshipMap.tsx`:
    - `GET /api/v1/map/state-statistics` → `{ stateStats: { [stateCode]: { name, companies, hiredInternships, pmInternships, activeInternships, studentsHired } } }`
    - `GET /api/v1/map/statistics-summary` → summary counters for the header cards.
    - Both read from the employer MongoDB via `multi_cluster.py` when available and return zeroed/empty data on failure instead of 5xx.

- **Student Dashboard & Profile**
  - `UserDashboard.tsx` now uses `apiService.getProfile()` (`/api/v1/auth/me`) as the single source of truth instead of hard-coded fetches to `http://localhost:8000`.
  - `StudentProfileResponse` (`frontend/student/src/types/profile.ts`) matches the backend `/api/v1/auth/me` schema in `app/api/v1/auth.py`.


