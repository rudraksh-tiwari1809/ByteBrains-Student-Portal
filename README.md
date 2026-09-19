# ByteBrains Student Portal - Integrated

This package contains the corrected Student Portal frontend and FastAPI backend.

## Backend
From this folder:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` from `.env.example` and put the real PostgreSQL/Supabase `DATABASE_URL` there.

Run from the project root (`ByteBrains-Student-Integrated`):

```powershell
python -m uvicorn backend.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

## Student frontend
Create `student/.env` from `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then:

```powershell
cd student
npm install
npm run dev
```

## Integrated flow

Register -> Login -> Dashboard -> Skill Assessment -> Skill Profile -> Recommendations -> Internships/Jobs -> Apply -> Application tracking -> Portfolio/Resume.

The backend creates missing catalog/demo records (skills, internships, courses and events) on startup when those catalogs are empty. It never creates a demo student automatically.
