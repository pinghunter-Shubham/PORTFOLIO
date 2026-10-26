"""
Application configuration — loads from .env via python-dotenv.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API keys
    gemini_api_key: str = ""
    resend_api_key: str = ""

    # Email
    my_email: str = "Shubhamking201@gmail.com"

    # Infrastructure (Redis is optional — graceful fallback if unavailable)
    redis_url: str = "redis://localhost:6379"

    # CORS
    allowed_origins: str = "http://localhost:3000"

    # RAG settings
    chroma_persist_dir: str = "./chroma_db"
    knowledge_base_dir: str = "./data/knowledge_base"
    # Local HuggingFace embedding model — no API key needed
    embedding_model: str = "all-MiniLM-L6-v2"
    llm_model: str = "gemini-3.8-flash"

    # Rate limiting
    chat_rate_limit: int = 10       # requests per IP per hour
    contact_rate_limit: int = 3     # submissions per IP per day

    class Config:
        env_file = ".env"
        extra = "ignore"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
