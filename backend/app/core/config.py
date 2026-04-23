from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Expense Tracker API"
    DATABASE_URL: Optional[str] = None
    
    # In case we want to use SQLite for development/testing
    USE_SQLITE: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
