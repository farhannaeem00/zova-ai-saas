import chromadb
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./vector_store")

# Initialize Groq for embeddings (we use a local sentence transformer instead)
from sentence_transformers import SentenceTransformer
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")  # Free & Local

def get_embeddings(text: str) -> list:
    return embedding_model.encode(text).tolist()

def add_documents_to_vectorstore(chatbot_id: str, chunks: list):
    collection = chroma_client.get_or_create_collection(
        name=f"chatbot_{chatbot_id}",
        metadata={"hnsw:space": "cosine"}
    )
    embeddings = [get_embeddings(chunk) for chunk in chunks]
    ids = [f"{chatbot_id}_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

def search_similar_chunks(chatbot_id: str, query: str, n_results: int = 5) -> list:
    try:
        collection = chroma_client.get_or_create_collection(
            name=f"chatbot_{chatbot_id}"
        )
        query_embedding = get_embeddings(query)
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results["documents"][0] if results["documents"] else []
    except Exception as e:
        print(f"Search error: {e}")
        return []