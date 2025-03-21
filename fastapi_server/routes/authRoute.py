from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
import os
import requests
from auth import hashed_pass, verify_hash_pass, jwt_encode, verify_token
from database import get_supabase_client
import uuid
from models.userModel import userReqMod, userResMod, GoogleAuthReqMod, UserProfile
from typing import Annotated
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from pydantic import BaseModel

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Add OPTIONS handlers for CORS pre-flight requests
@router.options("/login")
async def options_login():
    return JSONResponse(content={"message": "OK"})

@router.options("/register")
async def options_register():
    return JSONResponse(content={"message": "OK"})

@router.options("/google")
async def options_google():
    return JSONResponse(content={"message": "OK"})

@router.options("/me")
async def options_me():
    return JSONResponse(content={"message": "OK"})

# Create a model for Google code exchange
class GoogleCodeExchange(BaseModel):
    code: str

# Add new Google OAuth login endpoint
@router.get("/google/login")
async def google_login():
    """
    Redirect to Google OAuth login
    """
    # Google OAuth URL
    oauth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    
    # Get redirect URI from environment
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    # Set parameters
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,  # Use the environment variable
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    
    # Build the URL
    param_string = "&".join([f"{key}={value}" for key, value in params.items()])
    authorization_url = f"{oauth_url}?{param_string}"
    
    return RedirectResponse(url=authorization_url)

@router.post("/google/token")
async def exchange_google_code(request: GoogleCodeExchange):
    """
    Exchange Google authorization code for tokens and authenticate user
    """
    token_url = "https://oauth2.googleapis.com/token"
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    # Exchange code for token
    token_payload = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": request.code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri  # Use the environment variable
    }
    
    try:
        # Request tokens from Google
        response = requests.post(token_url, data=token_payload)
        token_data = response.json()
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=f"Google OAuth error: {token_data['error']}")
        
        # Get ID token
        id_token_value = token_data.get("id_token")
        if not id_token_value:
            raise HTTPException(status_code=400, detail="No ID token received from Google")
        
        # Get user info from ID token
        google_user = id_token.verify_oauth2_token(
            id_token_value, google_requests.Request(), GOOGLE_CLIENT_ID
        )
        
        # Check if user exists in our system
        user_email = google_user["email"]
        supabase = get_supabase_client()
        supabase_response = supabase.table("users").select("*").eq("email", user_email).execute()
        
        if supabase_response.data:
            # User exists, create a session
            user = supabase_response.data[0]
            token = jwt_encode(user["id"])
        else:
            # Create new user
            new_user_id = str(uuid.uuid4())
            supabase.table("users").insert({
                "id": new_user_id,
                "email": google_user["email"],
                "name": google_user.get("name"),
                "avatar_url": google_user.get("picture"),
                "provider": "google"
            }).execute()
            
            token = jwt_encode(new_user_id)
        
        # Return JWT token
        return {"error": False, "token": token}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during OAuth flow: {str(e)}")

@router.get("/google/callback")
async def google_callback(code: str):
    """
    Handle Google OAuth callback
    """
    token_jwt = jwt_encode("temp_user_id")  # Temporary, replace with real implementation
    
    # Redirect to frontend with token
    return RedirectResponse(url=f"{FRONTEND_URL}/auth/success?token={token_jwt}")

@router.post("/login", response_model=userResMod)
async def login(req: userReqMod):
    supabase = get_supabase_client()
    response = supabase.table("users").select("id, password").eq("email", req.email).single().execute()
    if response.data:
        user = response.data
        if verify_hash_pass(req.password, user["password"]):
            token = jwt_encode(user["id"])
            return {"error": False, "token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/register", response_model=userResMod)
async def register(req: userReqMod):
    supabase = get_supabase_client()
    response = supabase.table("users").select("id").eq("email", req.email).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="User already exists")
    hash_pass = hashed_pass(req.password)
    user_id = str(uuid.uuid4())
    supabase.table("users").insert({
        "id": user_id,
        "email": req.email,
        "password": hash_pass,
        "provider": "email"
    }).execute()
    token = jwt_encode(user_id)
    return {"error": False, "token": token}

@router.post("/google", response_model=userResMod)
async def google_auth(req: GoogleAuthReqMod):
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(req.id_token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        # Get user info from the token
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        
        # Check if the user exists
        supabase = get_supabase_client()
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        if response.data:
            # User exists, return a token
            user = response.data[0]
            token = jwt_encode(user["id"])
            return {"error": False, "token": token}
        else:
            # Create a new user
            new_user_id = str(uuid.uuid4())
            response = supabase.table("users").insert({
                "id": new_user_id,
                "email": email,
                "password": "", # No password for Google auth
                "name": name,
                "avatar_url": picture,
                "provider": "google"
            }).execute()
            
            token = jwt_encode(new_user_id)
            return {"error": False, "token": token}
            
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid Google token")

@router.get("/me", response_model=UserProfile)
async def get_user_profile(token: str = Depends(verify_token)):
    # Get the user from the token
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    supabase = get_supabase_client()
    response = supabase.table("users").select("id, email, name, avatar_url").eq("id", token).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    return response.data
