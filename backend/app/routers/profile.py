from fastapi import APIRouter, Depends, HTTPException
from app.database import get_history, get_marketing
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/")
async def get_profile(user: dict = Depends(get_current_user)):
    """
    Get the logged-in user's profile info.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": user["_id"],
        "email": user.get("email"),
        "name": user.get("name"),
    }

@router.put("/")
async def update_profile(name: str, user: dict = Depends(get_current_user)):
    """
    Update the logged-in user's name.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Update in database
    from app.database import db, serialize_doc
    users_collection = db.get_collection("users")
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"name": name}}
    )
    updated_user = await users_collection.find_one({"_id": user["_id"]})
    return {
        "message": "Profile updated",
        "name": updated_user.get("name")
    }

@router.get("/history")
async def profile_history(user: dict = Depends(get_current_user)):
    """
    Get the user's generated content history.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    history = await get_history(user_id=user["_id"])
    return {"history": history}

@router.get("/marketing")
async def profile_marketing(user: dict = Depends(get_current_user)):
    """
    Get the user's saved marketing data.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    marketing = await get_marketing(user_id=user["_id"])
    return {"marketing": marketing or {}}