from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, Dict
from pydantic import BaseModel
from jose import JWTError, jwt  # for token decoding if using JWT
from app.database import db  # optional if you want to fetch user info from MongoDB

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Secret key for JWT (replace with environment variable in production)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

# --- Models ---
class User(BaseModel):
    _id: str
    email: Optional[str] = None
    name: Optional[str] = "Guest"
    is_guest: bool = True

# --- Dependency ---
async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    """
    Returns:
    - Logged-in user dict if valid JWT is provided
    - Guest dict if no auth header is provided
    """
    if authorization:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("_id")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            # Optionally, fetch user from DB
            # user = await db["users"].find_one({"_id": user_id})
            # if not user:
            #     raise HTTPException(status_code=401, detail="User not found")
            return {"_id": user_id, "email": payload.get("email"), "name": payload.get("name"), "is_guest": False}
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    # Guest user
    return {"_id": "guest", "name": "Guest", "is_guest": True}