from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.database import create_marketing
from app.routers.auth import get_current_user
import asyncio

router = APIRouter(tags=["Marketing"])

# --- Request Models ---
class SurveyData(BaseModel):
    companyName: str
    companyDescription: str
    country: str
    brandColors: str = ""
    tone: str = ""

class TrendsRequest(BaseModel):
    surveyData: SurveyData

class ScheduleRequest(BaseModel):
    trends: List[str]

class PublishItem(BaseModel):
    day: str
    time: str
    type: str
    content: str

# --- Dummy ML / trends logic ---
def generate_trends(survey: SurveyData):
    # Placeholder: normally call ML model
    return [f"Trend for {survey.companyName} #{i+1}" for i in range(5)]

def generate_schedule(trends: List[str]):
    # Placeholder schedule logic
    schedule = []
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    for i, trend in enumerate(trends):
        schedule.append({
            "day": days[i % len(days)],
            "time": f"{9 + i}:00 AM",
            "type": "Text",
            "content": trend
        })
    return schedule

# --- Endpoints ---
@router.post("/trends")
async def get_trends(request: TrendsRequest, user: dict = Depends(get_current_user)):
    """
    Guests can fetch trends, logged-in users fetch trends + save history.
    """
    trends = generate_trends(request.surveyData)

    # Save trends to DB if authenticated and not guest (non-blocking)
    try:
        if user and not user.get("is_guest"):
            asyncio.create_task(create_marketing(user_id=user["_id"], marketing_data={"trends": trends}))
    except Exception:
        pass

    return {"trends": trends}

@router.post("/schedule")
async def get_schedule(request: ScheduleRequest, user: dict = Depends(get_current_user)):
    """
    Only logged-in users can fetch schedule.
    Guests get 403 Forbidden.
    """
    # Block guests from generating schedule
    if not user or user.get("is_guest"):
        raise HTTPException(status_code=403, detail="Guests cannot generate schedule. Please log in.")
    
    schedule = generate_schedule(request.trends)
    return {"schedule": schedule}

@router.post("/publish")
async def publish_item(item: PublishItem, user: dict = Depends(get_current_user)):
    """
    Only logged-in users can publish content.
    """
    if not user:
        raise HTTPException(status_code=403, detail="Guests cannot publish content. Please log in.")
    
    # Placeholder: normally save to DB or push to social media
    return {"message": f"Content scheduled for {item.day} at {item.time} successfully."}