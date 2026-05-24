from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from services.rag_service import search_similar_chunks
from services.gemini_service import get_ai_response
from db.supabase_client import supabase

router = APIRouter()

class ChatRequest(BaseModel):
    chatbot_id: str
    message: str
    history: List[dict] = []
    system_instructions: str = ""
    session_id: Optional[str] = None

@router.post("/message")
async def send_message(request: ChatRequest):
    current_session_id = request.session_id

    try:
        # Step 1 — Create session if not exists
        if not current_session_id:
            raw = request.message.strip()
            chat_title = (raw[:40].rsplit(" ", 1)[0] + "...") if len(raw) > 40 else raw
            result = supabase.table("chat_sessions").insert({
                "chatbot_id": request.chatbot_id,
                "title": chat_title
            }).execute()
            current_session_id = result.data[0]["id"]

        # Step 2 — Search relevant chunks
        context_chunks = search_similar_chunks(
            request.chatbot_id, request.message
        )
        context = "\n\n".join(context_chunks)

        # Step 3 — Build system prompt
        system_prompt = f"""
{request.system_instructions or "You are a helpful assistant."}

Answer questions based on the context below.
If the answer is not in the context, answer from your own knowledge but mention it.

Context:
{context}
"""

        # Step 4 — Get AI response
        messages = request.history + [
            {"role": "user", "content": request.message}
        ]
        response = get_ai_response(messages, system_prompt)

        # Step 5 — Save messages
        supabase.table("messages").insert([
            {"session_id": current_session_id, "role": "user", "content": request.message},
            {"session_id": current_session_id, "role": "assistant", "content": response}
        ]).execute()

        return {
            "response": response,
            "session_id": current_session_id,
            "sources": context_chunks[:2]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get all sessions for a chatbot
@router.get("/sessions/{chatbot_id}")
async def get_sessions(chatbot_id: str):
    try:
        response = supabase.table("chat_sessions").select("*").eq(
            "chatbot_id", chatbot_id
        ).order("created_at", desc=True).execute()
        return {"sessions": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get messages for a session
@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    try:
        response = supabase.table("messages").select("*").eq(
            "session_id", session_id
        ).order("created_at").execute()
        return {"messages": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete a session
@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    try:
        supabase.table("messages").delete().eq("session_id", session_id).execute()
        supabase.table("chat_sessions").delete().eq("id", session_id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/rate/{message_id}")
async def rate_message(message_id: str, request: Request):
    try:
        body = await request.json()
        rating = body.get("rating")
        supabase.table("messages").update(
            {"rating": rating}
        ).eq("id", message_id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))