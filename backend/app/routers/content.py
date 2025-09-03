from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import history_collection, serialize_doc
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/content", tags=["content"])

# --- Get all content for the current user ---
@router.get("/", response_model=List[dict])
async def get_content(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    cursor = history_collection.find({"user_id": user["_id"]}).sort("_id", -1)
    contents = [serialize_doc(doc) for doc in await cursor.to_list(length=100)]
    return contents


# --- Save new content for the current user ---
@router.post("/")
async def save_content(type: str, content: str, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    item = {
        "type": type,
        "content": content,
        "user_id": user["_id"],
    }
    result = await history_collection.insert_one(item)
    saved_item = await history_collection.find_one({"_id": result.inserted_id})
    return {"message": "Content saved", "content": serialize_doc(saved_item)}