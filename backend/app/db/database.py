from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Determine if we should use SQLite
use_sqlite = settings.USE_SQLITE or not settings.DATABASE_URL

if use_sqlite:
    db_url = "sqlite:///./expenses.db"
    # SQLite needs special args for multi-threaded access in FastAPI
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
