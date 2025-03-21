from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
import shutil
from datetime import datetime
import json

from auth import get_current_user
from database import get_supabase_client
from models.videoModel import VideoCreate, VideoResponse, ShortResponse, GenerateShortRequest

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_video_in_background(video_id: str, context: dict, user_id: str):
    """Background task to process the video and generate shorts."""
    # Here you would implement the actual video processing logic
    # For now, we'll just create dummy short entries in the database
    
    supabase = get_supabase_client()
    
    # Get video info
    video_result = supabase.table("videos").select("*").eq("id", video_id).execute()
    if not video_result.data:
        return
    
    video = video_result.data[0]
    
    # Generate 5 dummy shorts
    for i in range(5):
        short_id = str(uuid.uuid4())
        timestamp = f"{i+1}:00"
        duration = f"0:{30 + i*5}"
        
        # Create short in database
        supabase.table("shorts").insert({
            "id": short_id,
            "video_id": video_id,
            "title": f"Engaging Moment {i+1}",
            "timestamp": timestamp,
            "duration": duration,
            "status": "completed",
            "thumbnail_url": f"/placeholder-thumbnail-{(i % 3) + 1}.jpg"
        }).execute()
    
    # Update video status
    supabase.table("videos").update({"status": "processed"}).eq("id", video_id).execute()

@router.post("/upload", response_model=VideoResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(None),
    user: dict = Depends(get_current_user)
):
    user_id = user["id"]
    video_id = str(uuid.uuid4())
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)
    file_extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(user_dir, f"{video_id}{file_extension}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file_size = os.path.getsize(file_path)
    upload_date = datetime.now().isoformat()
    if not title:
        title = file.filename
    supabase = get_supabase_client()
    supabase.table("videos").insert({
        "id": video_id,
        "user_id": user_id,
        "title": title,
        "filename": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "upload_date": upload_date,
        "status": "uploaded"
    }).execute()
    return {
        "id": video_id,
        "title": title,
        "filename": file.filename,
        "upload_date": upload_date,
        "file_size": file_size,
        "status": "uploaded"
    }

@router.get("", response_model=List[VideoResponse])
async def get_videos(user: dict = Depends(get_current_user)):
    supabase = get_supabase_client()
    
    result = supabase.table("videos").select("*").eq("user_id", user["id"]).execute()
    
    return result.data

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase_client()
    
    result = supabase.table("videos").select("*").eq("id", video_id).eq("user_id", user["id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return result.data[0]

@router.post("/{video_id}/generate-shorts")
async def generate_shorts(
    video_id: str, 
    request: GenerateShortRequest,
    background_tasks: BackgroundTasks,
    user: dict = Depends(get_current_user)
):
    supabase = get_supabase_client()
    
    # Check if video exists and belongs to user
    result = supabase.table("videos").select("*").eq("id", video_id).eq("user_id", user["id"]).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Update video with context info
    supabase.table("videos").update({
        "context": json.dumps(request.context),
        "status": "processing"
    }).eq("id", video_id).execute()
    
    # Start background processing
    background_tasks.add_task(
        process_video_in_background,
        video_id=video_id,
        context=request.context,
        user_id=user["id"]
    )
    
    return {"message": "Video processing started"}

@router.get("/{video_id}/shorts", response_model=List[ShortResponse])
async def get_shorts(video_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase_client()
    
    # Verify video ownership
    video_result = supabase.table("videos").select("id").eq("id", video_id).eq("user_id", user["id"]).execute()
    
    if not video_result.data:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Get shorts for this video
    shorts_result = supabase.table("shorts").select("*").eq("video_id", video_id).execute()
    
    return shorts_result.data
