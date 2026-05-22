from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db.supabase_client import supabase

router = APIRouter()

class ChatbotCreate(BaseModel):
    user_id: str
    name: str
    description: str = ""
    instructions: str = ""
    color: str = "#6366f1"

class ChatbotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    color: Optional[str] = None

# Create chatbot
@router.post("/create")
async def create_chatbot(data: ChatbotCreate):
    try:
        response = supabase.table("chatbots").insert({
            "user_id": data.user_id,
            "name": data.name,
            "description": data.description,
            "instructions": data.instructions,
            "color": data.color
        }).execute()
        return {"status": "success", "chatbot": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all chatbots for a user
@router.get("/user/{user_id}")
async def get_user_chatbots(user_id: str):
    try:
        response = supabase.table("chatbots").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"chatbots": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get single chatbot
@router.get("/{chatbot_id}")
async def get_chatbot(chatbot_id: str):
    try:
        response = supabase.table("chatbots").select("*").eq("id", chatbot_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Chatbot not found")
        return {"chatbot": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update chatbot
@router.put("/{chatbot_id}")
async def update_chatbot(chatbot_id: str, data: ChatbotUpdate):
    try:
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        response = supabase.table("chatbots").update(update_data).eq("id", chatbot_id).execute()
        return {"status": "success", "chatbot": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete chatbot
@router.delete("/{chatbot_id}")
async def delete_chatbot(chatbot_id: str):
    try:
        supabase.table("chatbots").delete().eq("id", chatbot_id).execute()
        return {"status": "success", "message": "Chatbot deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))