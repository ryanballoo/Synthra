from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from bson import ObjectId

# ---------------------------
# MongoDB Connection Settings
# ---------------------------
MONGO_DETAILS = "mongodb://localhost:27017"  # Replace with Alibaba Cloud URI when deploying
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client["synthra_db"]  # Database name

# Collections
survey_collection = db.get_collection("surveys")
history_collection = db.get_collection("history")
marketing_collection = db.get_collection("marketing")


# ---------------------------
# Helper Functions
# ---------------------------

# Convert ObjectId to string for JSON responses
def serialize_doc(doc: dict) -> dict:
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    return doc


# -------- Surveys --------
async def create_survey(survey_data: dict) -> dict:
    result = await survey_collection.insert_one(survey_data)
    survey = await survey_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(survey)


async def get_surveys() -> List[dict]:
    cursor = survey_collection.find()
    return [serialize_doc(doc) for doc in await cursor.to_list(length=100)]


# -------- History / Generated Content --------
async def create_history_item(user_id: str, item: dict) -> dict:
    item["user_id"] = user_id
    result = await history_collection.insert_one(item)
    history_item = await history_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(history_item)


async def get_history(user_id: str) -> List[dict]:
    cursor = history_collection.find({"user_id": user_id}).sort("_id", -1)
    return [serialize_doc(doc) for doc in await cursor.to_list(length=100)]


# -------- Marketing Data --------
async def create_marketing(user_id: str, marketing_data: dict) -> dict:
    marketing_data["user_id"] = user_id
    result = await marketing_collection.insert_one(marketing_data)
    marketing_item = await marketing_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(marketing_item)


async def get_marketing(user_id: str) -> Optional[dict]:
    marketing_item = await marketing_collection.find_one({"user_id": user_id})
    return serialize_doc(marketing_item)