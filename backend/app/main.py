from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv
import os

# Load .env before importing modules that read env on import
load_dotenv()

# Import your routers (these may instantiate services using env)
from app.routers import ml, marketing, auth, profile, content

app = FastAPI(title="Synthra API")

# Enable CORS for development origins
# In dev, allow all to quickly unblock CORS; tighten later using BACKEND_CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(marketing.router, prefix="/api/marketing", tags=["Marketing"])
app.include_router(ml.router, prefix="/api/ml", tags=["ML"])