"""
RAG service — indexes the knowledge base on startup and handles semantic retrieval.

On startup:
  1. Load all .md files from /data/knowledge_base/
  2. Chunk with RecursiveCharacterTextSplitter
  3. Embed and store in Chroma (skip re-indexing if DB is fresh)

On query:
  1. Embed the query
  2. MMR search (diverse top-5 results)
  3. Return Document objects
"""

import os
import time
import logging
from pathlib import Path

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document

from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Singleton vector store
_vectorstore: Chroma | None = None


def _is_db_fresh(persist_dir: str, max_age_hours: float = 24.0) -> bool:
    """Return True if the Chroma DB exists and was created less than max_age_hours ago."""
    marker = Path(persist_dir) / "chroma.sqlite3"
    if not marker.exists():
        return False
    age_hours = (time.time() - marker.stat().st_mtime) / 3600
    return age_hours < max_age_hours


def _load_documents() -> list[Document]:
    """Load all .md files from the knowledge base directory."""
    kb_dir = Path(settings.knowledge_base_dir)
    docs: list[Document] = []

    for md_file in kb_dir.glob("*.md"):
        loader = TextLoader(str(md_file), encoding="utf-8")
        loaded = loader.load()
        # Add source metadata
        for doc in loaded:
            doc.metadata["source"] = md_file.name
        docs.extend(loaded)

    logger.info(f"Loaded {len(docs)} document(s) from {kb_dir}")
    return docs


def initialize_vectorstore() -> Chroma:
    """
    Initialize and return the Chroma vector store.
    Skips re-indexing if the DB is fresh (< 24 hours old).
    """
    global _vectorstore

    persist_dir = settings.chroma_persist_dir
    embeddings = OpenAIEmbeddings(
        model=settings.embedding_model,
        openai_api_key=settings.openai_api_key,
    )

    if _is_db_fresh(persist_dir):
        logger.info("Loading existing Chroma DB (fresh, skipping re-index)")
        _vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings,
        )
        return _vectorstore

    logger.info("Indexing knowledge base...")
    raw_docs = _load_documents()

    if not raw_docs:
        logger.warning("No documents found in knowledge base. Creating empty vector store.")
        _vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings,
        )
        return _vectorstore

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " "],
    )
    chunks = splitter.split_documents(raw_docs)
    logger.info(f"Split into {len(chunks)} chunks")

    # Add chunk IDs for evaluation
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = f"chunk_{i}"

    _vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir,
    )
    logger.info("Vector store created and persisted.")
    return _vectorstore


def get_vectorstore() -> Chroma:
    """Return the singleton vector store, initializing if needed."""
    global _vectorstore
    if _vectorstore is None:
        _vectorstore = initialize_vectorstore()
    return _vectorstore


def retrieve_context(query: str, k: int = 5) -> list[Document]:
    """
    Retrieve the top-k most relevant chunks for a query using MMR search.
    MMR (Maximal Marginal Relevance) ensures diversity in results.

    Args:
        query: The user's query string.
        k: Number of chunks to return.

    Returns:
        List of Document objects with page_content and metadata.
    """
    vs = get_vectorstore()
    results = vs.max_marginal_relevance_search(
        query,
        k=k,
        fetch_k=20,  # Fetch more candidates, then pick diverse top-k
    )
    logger.debug(f"Retrieved {len(results)} chunks for query: {query[:60]}...")
    return results
