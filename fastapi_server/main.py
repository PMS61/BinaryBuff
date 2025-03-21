import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from typing import Optional, List
import uuid
import shutil
from datetime import datetime
import jwt
from pydantic import BaseModel

from models.userModel import userReqMod, GoogleAuthReqMod, userResMod, UserProfile
from models.videoModel import VideoCreate, VideoResponse, ShortCreate, ShortResponse, GenerateShortRequest
from routes import authRoute, videoRoute, shortsRoute
from auth import verify_token, get_current_user
from database import get_supabase_client
from custom_middleware import CustomHeaderMiddleware

app = FastAPI(title="BinaryBuff API")

# Initialize database tables
@app.on_event("startup")
async def startup_db_client():
    print("Supabase handles database initialization. No action required.")

# CORS settings
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://binarybuff.vercel.app",
    # Add your production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(CustomHeaderMiddleware)

# Include routers
app.include_router(authRoute.router, prefix="/auth", tags=["Authentication"])
app.include_router(videoRoute.router, prefix="/videos", tags=["Videos"])
app.include_router(shortsRoute.router, prefix="/shorts", tags=["Shorts"])

@app.get("/")
def read_root():
    return {"message": "Welcome to BinaryBuff API"}

# Add a health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
