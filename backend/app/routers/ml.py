from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database import create_history_item
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/ml", tags=["ML"])

class GenerateRequest(BaseModel):
    prompt: str
    type: str

@router.post("/generate")
async def generate_content(req: GenerateRequest, user: dict = Depends(get_current_user)):
    """
    Generate AI content. Guests can use this endpoint, but only logged-in
    users will have history saved.
    """
    if not req.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    # --- Call AI Model here ---
    # Replace this placeholder with real AI model integration
    generated_text = f"[AI GENERATED] {req.type}: {req.prompt}"

    # --- Save to history if user is logged in ---
    if user:
        await create_history_item(user_id=user["_id"], item={
            "type": req.type,
            "content": generated_text
        })

    return {"generated": generated_text}