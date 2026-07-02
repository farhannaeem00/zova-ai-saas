import os
import re
from dotenv import load_dotenv
from db.supabase_client import supabase

load_dotenv()

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


def add_documents_to_vectorstore(chatbot_id: str, chunks: list):
    """Store chunks directly in Supabase instead of ChromaDB"""
    try:
        # Clear old chunks for this chatbot
        supabase.table("document_chunks").delete().eq(
            "chatbot_id", chatbot_id
        ).execute()

        # Insert new chunks
        rows = [
            {
                "chatbot_id": chatbot_id,
                "chunk_index": i,
                "content": chunk
            }
            for i, chunk in enumerate(chunks)
        ]
        if rows:
            supabase.table("document_chunks").insert(rows).execute()
    except Exception as e:
        print(f"Error storing chunks: {e}")


def _keyword_score(query: str, text: str) -> int:
    """Simple keyword overlap scoring"""
    query_words = set(re.findall(r"\w+", query.lower()))
    text_words = set(re.findall(r"\w+", text.lower()))
    return len(query_words & text_words)


def search_similar_chunks(chatbot_id: str, query: str, n_results: int = 5) -> list:
    """Retrieve most relevant chunks using keyword matching"""
    try:
        response = supabase.table("document_chunks").select("content").eq(
            "chatbot_id", chatbot_id
        ).execute()

        chunks = [row["content"] for row in response.data]
        if not chunks:
            return []

        # Score and sort by keyword overlap
        scored = [(chunk, _keyword_score(query, chunk)) for chunk in chunks]
        scored.sort(key=lambda x: x[1], reverse=True)

        # Return top n_results
        top_chunks = [c for c, score in scored if score > 0][:n_results]
        if not top_chunks:
            top_chunks = chunks[:n_results]

        return top_chunks
    except Exception as e:
        print(f"Search error: {e}")
        return []