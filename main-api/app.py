from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os

app = FastAPI()

class CorsConfig(BaseModel):
    allow_origins: List[str]
    allow_methods: List[str]
    allow_headers: List[str]
    allow_credentials: bool

# Default CORS configuration
cors_config = {
    "allow_origins": ["http://localhost:3000"],
    "allow_methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type"],
    "allow_credentials": False
}

# Initialize CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_config["allow_origins"],
    allow_methods=cors_config["allow_methods"],
    allow_headers=cors_config["allow_headers"],
    allow_credentials=cors_config["allow_credentials"],
)

@app.get("/api/config/cors")
async def get_cors_config():
    return cors_config

@app.post("/api/config/cors")
async def update_cors_config(new_config: CorsConfig):
    global cors_config
    cors_config.update(new_config.dict())
    
    # Update CORS middleware settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_config["allow_origins"],
        allow_methods=cors_config["allow_methods"],
        allow_headers=cors_config["allow_headers"],
        allow_credentials=cors_config["allow_credentials"],
    )
    
    return {"message": "CORS configuration updated", "config": cors_config}

@app.get("/api/data")
async def get_data():
    return {
        "message": "Data from main API",
        "server": "main",
        "cors_config": cors_config
    }

class EchoRequest(BaseModel):
    data: dict

@app.post("/api/echo")
async def echo_data(request: EchoRequest):
    return {
        "message": "Echo from main API",
        "received_data": request.data,
        "server": "main"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) 