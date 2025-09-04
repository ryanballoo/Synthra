from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, Dict
from pydantic import BaseModel
from jose import JWTError, jwt
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Secret key for JWT (replace with environment variable in production)
SECRET_KEY = "your-secret-key-that-is-long-enough-for-hs256"
ALGORITHM = "HS256"

# --- Models ---
class User(BaseModel):
    _id: str
    email: Optional[str] = None
    name: Optional[str] = "Guest"
    is_guest: bool = True

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: User

# --- Dependency ---
async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    """
    Returns:
    - Logged-in user dict if valid JWT is provided
    - Guest dict if no auth header is provided
    """
    logger.info(f"Authorization header received: {authorization[:20]}...")
    
    if authorization:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        try:
            logger.info("Attempting to decode JWT token")
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("_id")
            if user_id is None:
                logger.error("No user_id found in token payload")
                raise HTTPException(status_code=401, detail="Invalid token")
            logger.info(f"Successfully authenticated user: {user_id}")
            return {
                "_id": user_id,
                "email": payload.get("email"),
                "name": payload.get("name"),
                "is_guest": False
            }
        except JWTError as e:
            logger.error(f"JWT decode error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token")
    
    # Return guest user if no token
    return {"_id": "guest", "email": None, "name": "Guest", "is_guest": True}

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login endpoint - For demo, accepts any email/password"""
    try:
        logger.info(f"Login attempt for email: {request.email}")
        
        # In production, verify credentials against database
        user = {
            "_id": "user_" + request.email.split("@")[0],
            "email": request.email,
            "name": request.email.split("@")[0].title(),
            "is_guest": False
        }
        
        logger.info(f"Created user object for {user['_id']}")
        
        # Generate token
        token_payload = {
            "_id": user["_id"], 
            "email": user["email"], 
            "name": user["name"]
        }
        logger.info("Generating JWT token with payload")
        
        token = jwt.encode(
            token_payload,
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        
        logger.info("Login successful, returning token and user")
        return {"token": token, "user": user}
    except Exception as e:
        logger.error(f"Login failed with error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")