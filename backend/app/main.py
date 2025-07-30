import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.routers import organizze

app = FastAPI()

# Security middlewares
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

# API routes
app.include_router(organizze.router, prefix="/api")

# Serve static assets
frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
assets_path = os.path.join(frontend_dist, "assets")
app.mount("/static", StaticFiles(directory=assets_path), name="static")

# SPA fallback
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str, request: Request):
    if request.url.path.startswith(("/api", "/static")):
        raise HTTPException(status_code=404)
    return FileResponse(os.path.join(frontend_dist, "index.html"))
