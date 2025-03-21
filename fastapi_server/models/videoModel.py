from pydantic import BaseModel
from typing import Optional, Dict, List, Union, Any
from datetime import datetime

class VideoCreate(BaseModel):
    title: str
    filename: str

class VideoResponse(BaseModel):
    id: str
    title: str
    filename: str
    upload_date: str
    file_size: int
    status: str
    context: Optional[Dict[str, Any]] = None

class ShortCreate(BaseModel):
    video_id: str
    title: str
    timestamp: str
    duration: str

class ShortResponse(BaseModel):
    id: str
    video_id: str
    title: str
    timestamp: str
    duration: str
    status: str
    thumbnail_url: Optional[str] = None

class GenerateShortRequest(BaseModel):
    video_id: str
    count: int = 3  # Default to generating 3 shorts

class ShortTimestamp(BaseModel):
    start: float
    end: float
    id: str

class GenerateTimestampsResponse(BaseModel):
    video_id: str
    shorts: List[ShortTimestamp]
