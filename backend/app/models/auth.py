from pydantic import BaseModel, Field
from typing import Optional

class TokenRequest(BaseModel):
    token: str = Field(..., min_length=10, description="API token do Organizze")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600

class User(BaseModel):
    id: str
    email: Optional[str] = None
    organizze_token: str