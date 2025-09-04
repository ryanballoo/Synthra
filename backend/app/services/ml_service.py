import os
import httpx
import json
from typing import Optional, Dict, Any

class MLService:
    def __init__(self):
        # API configuration
        self.dashscope_api_key = os.getenv("DASHSCOPE_API_KEY")
        self.dashscope_api_url = os.getenv("DASHSCOPE_API_URL")
        # HTTP client
        self.http_client = httpx.AsyncClient(timeout=60.0)
        # Optional: Stability for image generation
        self.stability_api_key = os.getenv("STABILITY_API_KEY")

    async def generate_text(self, prompt: str, type: str, context: Optional[Dict] = None) -> str:
        """Generate text content using DashScope API"""
        if not self.dashscope_api_key:
            raise ValueError("DashScope API key not configured")

        # Create a system message based on content type
        system_messages = {
            "Marketing Copy": "You are a professional marketing copywriter. Create compelling marketing content that highlights key features and benefits.",
            "Social": "You are a social media expert. Create engaging social media posts with appropriate hashtags and calls to action.",
            "Product": "You are a product description specialist. Create detailed, compelling product descriptions that highlight features and benefits.",
            "Email": "You are an email marketing expert. Create persuasive marketing emails that drive engagement and conversions.",
            "Ad": "You are an advertising copywriter. Create compelling ad copy that drives action and conversions."
        }

        # Prepare the prompt with context
        if context:
            prompt = f"""Company Context:
Name: {context.get('companyName', 'Unknown')}
Description: {context.get('companyDescription', '')}
Tone: {context.get('tone', 'Professional')}

Task: {prompt}"""

        try:
            print(f"Making request to DashScope API: {self.dashscope_api_url}/chat/completions")
            response = await self.http_client.post(
                f"{self.dashscope_api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.dashscope_api_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json={
                    "model": "qwen-max",
                    "messages": [
                        {"role": "system", "content": system_messages.get(type, "You are a helpful AI assistant.")},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                }
            )
            response.raise_for_status()
            resp_json = response.json()
            print(f"DashScope API Response: {resp_json}")
            
            # Handle both OpenAI-compatible and native DashScope formats
            try:
                if isinstance(resp_json, dict):
                    # OpenAI compatible
                    if "choices" in resp_json:
                        return resp_json["choices"][0]["message"]["content"]
                    # DashScope native
                    if "output" in resp_json and "choices" in resp_json["output"]:
                        return resp_json["output"]["choices"][0]["message"]["content"]
                print(f"Unexpected response format: {resp_json}")
                raise ValueError("Unexpected API response format")
            except (KeyError, IndexError, TypeError) as e:
                print(f"Error parsing response content: {e}")
                raise ValueError(f"Unexpected API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Text generation failed: {str(e)}")

    async def generate_image(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate image using Stability AI API"""
        if not self.stability_api_key:
            # Gracefully degrade if no Stability key; return placeholder image data URL
            return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZWVlJy8+PHRleHQgeD0nMjAnIHk9JzcwJyBmb250LXNpemU9JzIwJyBmaWxsPScjMzMzJz5JbWFnZSBlbmFibGVkIHdoZW4gU3RhYmlsaXR5IEFLIGlzIHNldDwvdGV4dD48L3N2Zz4="

        # Enhance prompt with context if available
        if context:
            prompt = f"{prompt}\nStyle: Professional, branded for {context.get('companyName', '')}\nBrand colors: {context.get('brandColors', '')}"

        try:
            response = await self.http_client.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers={
                    "Authorization": f"Bearer {self.stability_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "text_prompts": [{"text": prompt}],
                    "cfg_scale": 7,
                    "height": 1024,
                    "width": 1024,
                    "samples": 1,
                    "steps": 30,
                }
            )
            response.raise_for_status()
            
            # Get base64 image from response
            image_data = response.json()["artifacts"][0]["base64"]
            return f"data:image/png;base64,{image_data}"
        except Exception as e:
            raise Exception(f"Image generation failed: {str(e)}")

    async def close(self):
        await self.http_client.aclose()

# Singleton instance
ml_service = MLService()
