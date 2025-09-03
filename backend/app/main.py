from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your routers
from app.routers import ml, marketing, auth, profile, content

app = FastAPI(title="Synthra API")

# Enable CORS for React frontend
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(marketing.router, prefix="/api/marketing", tags=["Marketing"])
app.include_router(ml.router, prefix="/api/ml", tags=["ML"])