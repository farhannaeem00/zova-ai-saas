from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from services.pdf_service import extract_text_from_pdf, chunk_text
from services.rag_service import add_documents_to_vectorstore
from db.supabase_client import supabase

router = APIRouter()

@router.post("/{chatbot_id}")
async def upload_pdf(chatbot_id: str, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    temp_path = f"./temp_{file.filename}"
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        text = extract_text_from_pdf(temp_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        chunks = chunk_text(text)
        add_documents_to_vectorstore(chatbot_id, chunks)

        # Save document record to Supabase
        supabase.table("documents").insert({
            "chatbot_id": chatbot_id,
            "file_name": file.filename,
            "status": "ready"
        }).execute()

        return {
            "status": "success",
            "filename": file.filename,
            "chunks_processed": len(chunks)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# Get all documents for a chatbot
@router.get("/{chatbot_id}")
async def get_documents(chatbot_id: str):
    try:
        response = supabase.table("documents").select("*").eq(
            "chatbot_id", chatbot_id
        ).order("created_at", desc=True).execute()
        return {"documents": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete a document
@router.delete("/{document_id}/delete")
async def delete_document(document_id: str):
    try:
        supabase.table("documents").delete().eq("id", document_id).execute()
        return {"status": "success", "message": "Document deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))