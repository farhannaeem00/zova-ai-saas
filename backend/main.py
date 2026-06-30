from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI(title="Zova AI API")

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return JSONResponse(
        content={},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        }
    )

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS,PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    return response

from routes import auth, chatbot, chat, upload

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.get("/")
def root():
    return {"status": "Zova AI API Running ✅"}

handler = Mangum(app)