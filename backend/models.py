"""
Pydantic request/response models shared across routers.
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal


class ChatRequest(BaseModel):
    message: str
    session_id: str

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty")
        if len(v) > 2000:
            raise ValueError("Message is too long (max 2000 characters)")
        return v

    @field_validator("session_id")
    @classmethod
    def session_id_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("session_id cannot be empty")
        return v


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: Literal["Job Opportunity", "Freelance", "Collaboration", "Other"]
    message: str

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v.strip()

    @field_validator("message")
    @classmethod
    def message_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 20:
            raise ValueError("Message must be at least 20 characters")
        if len(v) > 2000:
            raise ValueError("Message is too long (max 2000 characters)")
        return v


class ApiResponse(BaseModel):
    success: bool
    message: str
