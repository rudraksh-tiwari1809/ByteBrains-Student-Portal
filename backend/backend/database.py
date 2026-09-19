"""Database configuration for ByteBrains.

The real DATABASE_URL is read from backend/.env and is never committed.
"""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

ENV_FILE = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is missing. Put DATABASE_URL=... in backend/.env"
    )

# Supabase/Postgres URLs are accepted as-is. psycopg is preferred, but the
# familiar postgresql:// scheme is also supported when psycopg2 is installed.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://") :]

connect_args = {}
if DATABASE_URL.startswith("postgresql+psycopg://"):
    connect_args = {"prepare_threshold": 0}

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
