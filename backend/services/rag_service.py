"""
RAG service — context stuffing approach.

Instead of embeddings + vector search, we load the entire knowledge base
directly into Gemini's context window (1M tokens). No model downloads,
no internet required beyond the Gemini API call itself.
"""

import logging
from pathlib import Path
from dataclasses import dataclass

from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@dataclass
class Document:
    page_content: str
    metadata: dict


_knowledge_base: str = ""


def _load_knowledge_base() -> str:
    """Read all .md files from knowledge_base dir and join them."""
    kb_dir = Path(settings.knowledge_base_dir)
    parts: list[str] = []

    for md_file in sorted(kb_dir.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        parts.append(f"=== {md_file.name} ===\n{content}")
        logger.info(f"Loaded {md_file.name} ({len(content)} chars)")

    full = "\n\n".join(parts)
    logger.info(f"Knowledge base ready: {len(full)} chars total")
    return full


def initialize_vectorstore() -> None:
    """Load knowledge base into memory on startup."""
    global _knowledge_base
    _knowledge_base = _load_knowledge_base()


def retrieve_context(query: str, k: int = 5) -> list[Document]:
    """
    Returns the entire knowledge base as a single Document.
    Gemini handles relevance selection within its context window.
    """
    global _knowledge_base
    if not _knowledge_base:
        _knowledge_base = _load_knowledge_base()

    return [Document(
        page_content=_knowledge_base,
        metadata={"source": "knowledge_base"},
    )]
