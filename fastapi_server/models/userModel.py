from pydantic import BaseModel
from typing import Optional

class userReqMod(BaseModel):
    email: str
    password: str

class GoogleAuthReqMod(BaseModel):
    id_token: str

class userResMod(BaseModel):
    error: bool
    token: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
