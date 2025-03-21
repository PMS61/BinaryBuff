from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any
import random
from pydantic import BaseModel
from models.videoModel import GenerateShortRequest, ShortResponse
from auth import get_current_user
from database import get_supabase_client

router = APIRouter()

class ShortTimestamp(BaseModel):
    start: float
    end: float
    id: str

class GenerateTimestampsResponse(BaseModel):
    video_id: str
    shorts: List[ShortTimestamp]

def generate_random_timestamps(video_duration: float, count: int = 3, min_length: float = 10.0, max_length: float = 30.0):
    """Generate random start and end timestamps for shorts"""
    if video_duration <= max_length:
        # If video is shorter than max_length, just use the whole video
        return [{"start": 0, "end": video_duration, "id": f"short_{1}"}]
    
    timestamps = []
    for i in range(count):
        # Generate a random length for the short
        short_length = random.uniform(min_length, min(max_length, video_duration))
        
        # Generate a random start time ensuring the short doesn't exceed video duration
        max_start = video_duration - short_length
        start_time = random.uniform(0, max_start)
        end_time = start_time + short_length
        
        timestamps.append({
            "start": round(start_time, 2),
            "end": round(end_time, 2),
            "id": f"short_{i+1}"
        })
    
    return timestamps

@router.post("/generate-timestamps", response_model=GenerateTimestampsResponse)
async def create_short_timestamps(
    request: GenerateShortRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Generate timestamps for potential shorts from a video"""
    supabase = get_supabase_client()
    
    # Verify the video exists and belongs to the user
    video_data = supabase.table("videos").select("*").eq("id", request.video_id).eq("user_id", current_user["id"]).execute()
    
    if not video_data.data:
        raise HTTPException(status_code=404, detail="Video not found or does not belong to you")
    
    video = video_data.data[0]
    video_duration = video.get("duration", 120)  # Default to 120 seconds if duration not available
    
    # Generate random timestamps
    timestamps = generate_random_timestamps(
        video_duration=video_duration,
        count=request.count if hasattr(request, 'count') else 3,
        min_length=10.0,  # Minimum short length in seconds
        max_length=30.0   # Maximum short length in seconds
    )
    
    return {
        "video_id": request.video_id,
        "shorts": timestamps
    }

@router.post("/save-short", response_model=ShortResponse)
async def save_short(
    video_id: str = Body(...),
    start_time: float = Body(...),
    end_time: float = Body(...),
    title: str = Body(...),
    description: str = Body(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Save a short with the final timestamps after user adjustment"""
    supabase = get_supabase_client()
    
    # Verify the video exists and belongs to the user
    video_data = supabase.table("videos").select("*").eq("id", video_id).eq("user_id", current_user["id"]).execute()
    
    if not video_data.data:
        raise HTTPException(status_code=404, detail="Video not found or does not belong to you")
    
    # Create the short entry in the database
    short_id = f"short_{random.randint(10000, 99999)}"
    short_data = {
        "id": short_id,
        "video_id": video_id,
        "user_id": current_user["id"],
        "title": title,
        "description": description,
        "start_time": start_time,
        "end_time": end_time,
        "created_at": supabase.table("shorts").select("now()").execute().data[0]["now"]
    }
    
    result = supabase.table("shorts").insert(short_data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save short")
    
    return result.data[0]

@router.get("/list/{video_id}", response_model=List[ShortResponse])
async def list_shorts(
    video_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """List all shorts generated for a video"""
    supabase = get_supabase_client()
    
    # Verify the video exists and belongs to the user
    video_data = supabase.table("videos").select("*").eq("id", video_id).eq("user_id", current_user["id"]).execute()
    
    if not video_data.data:
        raise HTTPException(status_code=404, detail="Video not found or does not belong to you")
    
    # Get all shorts for this video
    shorts_data = supabase.table("shorts").select("*").eq("video_id", video_id).eq("user_id", current_user["id"]).execute()
    
    return shorts_data.data
