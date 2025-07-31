import os
import time
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

from app.routers import organizze, auth, analytics
from app.core.logging import setup_logging, get_logger, log_api_call

# Setup logging first
setup_logging()
logger = get_logger(__name__)

app = FastAPI(
    title="Financial Insights API", 
    version="1.0.0",
    description="API para análise financeira integrada com Organizze",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None
)

# Security middlewares - Apenas em produção
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(","),
    )
    logger.info("Production security middlewares enabled")

# CORS configurado de forma mais segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens no Railway
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Log API calls
    try:
        log_api_call(
            endpoint=request.url.path,
            method=request.method,
            status_code=response.status_code,
            duration=process_time,
            user_agent=request.headers.get("user-agent", ""),
            ip=request.client.host if request.client else "unknown"
        )
    except Exception as e:
        logger.error(f"Error logging API call: {e}")
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# API routes
app.include_router(auth.router, prefix="/api/auth")
app.include_router(organizze.router, prefix="/api")
app.include_router(analytics.router, prefix="/api/analytics")

# Serve static assets
frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
assets_path = os.path.join(frontend_dist, "assets")

# Verificar se o diretório existe antes de montar
if os.path.exists(assets_path):
    app.mount("/static", StaticFiles(directory=assets_path), name="static")
    logger.info("Static assets mounted")

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "service": "financial-insights", 
        "version": "1.0.0",
        "timestamp": time.time(),
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# API info
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Financial Insights API", 
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs" if os.getenv("ENVIRONMENT") != "production" else "Documentation disabled in production"
    }

# SPA fallback
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str, request: Request):
    """Single Page Application fallback"""
    # Skip API and static routes
    if request.url.path.startswith(("/api", "/static", "/health")):
        raise HTTPException(status_code=404, detail="Endpoint not found")
    
    # Verificar se o arquivo index.html existe
    index_path = os.path.join(frontend_dist, "index.html")
    if not os.path.exists(index_path):
        logger.error("Frontend not built - index.html not found")
        raise HTTPException(status_code=404, detail="Frontend not built")
    
    return FileResponse(index_path)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup"""
    logger.info("Financial Insights API starting up")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown"""
    logger.info("Financial Insights API shutting down")
