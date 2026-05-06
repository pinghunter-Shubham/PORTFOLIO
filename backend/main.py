"""
Portfolio FastAPI backend — entry point.

Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import chat, contact, health
from services.rag_service import initialize_vectorstore
from config import get_settings

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize resources on startup, clean up on shutdown."""
    logger.info("🚀 Portfolio API starting up...")
    try:
        initialize_vectorstore()
        logger.info("✅ RAG vector store initialized")
    except Exception as e:
        logger.warning(f"⚠️  RAG index initialization failed: {e}")

    yield

    logger.info("👋 Portfolio API shutting down...")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Engineer Portfolio API",
    description="Backend for the AI clone chat, contact form, and analytics.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(chat.router, prefix="/chat")
app.include_router(contact.router, prefix="/contact")


# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "AI Engineer Portfolio API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }
