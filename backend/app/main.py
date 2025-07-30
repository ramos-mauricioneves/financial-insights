import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.routers import organizze

app = FastAPI(title="Financial Insights API", version="1.0.0")

# Security middlewares - Apenas em produção
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(","),
    )

# CORS configurado de forma mais segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# API routes
app.include_router(organizze.router, prefix="/api")

# Serve static assets
frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
assets_path = os.path.join(frontend_dist, "assets")

# Verificar se o diretório existe antes de montar
if os.path.exists(assets_path):
    app.mount("/static", StaticFiles(directory=assets_path), name="static")

# SPA fallback
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str, request: Request):
    if request.url.path.startswith(("/api", "/static")):
        raise HTTPException(status_code=404)
    
    # Verificar se o arquivo index.html existe
    index_path = os.path.join(frontend_dist, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="Frontend not built")
    
    return FileResponse(index_path)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "financial-insights", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/")
async def root():
    return {"message": "Financial Insights API", "status": "running"}
