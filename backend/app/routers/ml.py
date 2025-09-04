from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from app.database import create_history_item
from app.routers.auth import get_current_user
from app.services.ml_service import ml_service
from datetime import datetime
import asyncio

router = APIRouter(
    tags=["ML"],
    responses={404: {"description": "Not found"}},
)

class ProductContext(BaseModel):
    product: str
    confidence: float
    features: List[str]
    image: Optional[str] = None

class CompanyContext(BaseModel):
    companyName: str
    companyDescription: Optional[str]
    country: Optional[str]
    brandColors: Optional[str]
    tone: Optional[str]

class GenerateRequest(BaseModel):
    prompt: str
    type: str
    context: Optional[Union[ProductContext, CompanyContext]] = None

async def generate_product_content(product_info: ProductContext, content_type: str) -> str:
    """Generate content based on product information"""
    
    # Template for different content types
    templates = {
        "Text": f"""Create marketing content for {product_info.product}:
        
Features detected: {', '.join(product_info.features)}
Confidence: {product_info.confidence}%

Write a compelling product description and marketing copy.""",
        
        "Social": f"""Create social media posts for {product_info.product}:
        
Key features: {', '.join(product_info.features)}
Include relevant hashtags and engaging calls to action.""",
        
        "Image": f"""Create image prompt for {product_info.product}:
        
Features: {', '.join(product_info.features)}
Style: Professional product photography, marketing focused"""
    }
    
    # For demo, return template-based content
    # In production, replace with actual ML model call
    return f"[AI GENERATED {content_type}]\n\n{templates.get(content_type, '')}"

@router.post("/generate")
async def generate_content(req: GenerateRequest, user: dict = Depends(get_current_user) if get_current_user else None):
    """
    Generate AI content based on prompt and context.
    Supports text and image generation with various content types.
    """
    if not req.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        # Convert context to dict if present
        context = req.context.dict() if req.context else None
        
        if req.type == "Image":
            # Generate image content
            generated_content = await ml_service.generate_image(req.prompt, context)
        else:
            # Generate text content
            generated_content = await ml_service.generate_text(req.prompt, req.type, context)

        # Save to history only for authenticated users (non-guest) and do it non-blocking
        try:
            if user and not user.get("is_guest"):
                asyncio.create_task(create_history_item(user_id=user["_id"], item={
                    "type": req.type,
                    "content": generated_content,
                    "context": context,
                    "timestamp": datetime.utcnow().isoformat()
                }))
        except Exception:
            # Ignore history failures to avoid blocking user response
            pass

        return {
            "generated": generated_content,
            "metadata": {
                "type": req.type,
                "hasContext": context is not None,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except ValueError as ve:
        # Handle configuration errors
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=500, detail=str(e))