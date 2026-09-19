# ByteBrains Backend

FastAPI + SQLAlchemy + PostgreSQL/Supabase backend for ByteBrains.

## Run locally

From the ByteBrains project root:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

Open:
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/health
- http://127.0.0.1:8000/db-test
- http://127.0.0.1:8000/docs

## Environment

Create `backend/.env` and add the real `DATABASE_URL`. Do not commit or share it.

`CORS_ORIGINS` can contain comma-separated frontend origins.

## API shape

All database entities expose predictable CRUD routes under `/api/...`.

Examples:
- `GET /api/students`
- `GET /api/students/1`
- `POST /api/students`
- `PATCH /api/students/1`
- `DELETE /api/students/1`

Authentication:
- `POST /auth/student/register`
- `POST /auth/student/login`
- `POST /auth/company/register`
- `POST /auth/company/login`
- `POST /auth/faculty/register`
- `POST /auth/faculty/login`

The API never returns `password_hash`.
