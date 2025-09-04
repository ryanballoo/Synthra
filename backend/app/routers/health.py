from fastapi import APIRouter
from app.database import client

router = APIRouter(tags=["Health"])

@router.get("/health/ping")
async def ping():
    return {"status": "ok"}

@router.get("/health/db")
async def db_health():
    try:
        result = await client.admin.command("ping")
        return {"status": "ok", "mongo": result}
    except Exception as e:
        return {"status": "error", "error": str(e)}
