from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ai_response(messages: list, system_prompt: str = "") -> str:
    formatted = [{"role": "system", "content": system_prompt or "You are a helpful assistant."}]
    
    for msg in messages:
        formatted.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=formatted,
        max_tokens=1024
    )
    return response.choices[0].message.content