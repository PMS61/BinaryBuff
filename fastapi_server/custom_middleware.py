from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
import time

class CustomHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Add timing for performance monitoring
        start_time = time.time()
        
        # Process the request and get the response
        response = await call_next(request)
        
        # Add custom headers to help with debugging
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Ensure CORS headers are applied even to error responses
        if "access-control-allow-origin" not in response.headers:
            # Use the Origin header from the request if available
            origin = request.headers.get("origin", "http://localhost:3000")
            
            # Check if the origin is in our allowed origins
            # This is a simplified version - in production you'd check against a list
            if origin.startswith("http://localhost") or origin.startswith("https://binarybuff"):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        
        return response
