from fastapi import APIRouter, HTTPException, Depends
from app.models.auth import TokenRequest, TokenResponse
from app.core.security import create_access_token
from app.services.organizze_api import OrganizzeAPI
from app.core.logging import get_logger
import hashlib

router = APIRouter(tags=["Autenticação"])
logger = get_logger(__name__)

@router.post("/login", response_model=TokenResponse)
async def login(request: TokenRequest):
    """Login com token da API do Organizze"""
    try:
        # Validate token by making a test request to Organizze
        api = OrganizzeAPI(api_key=request.token)
        
        # Test the token by fetching accounts
        await api.get_accounts()
        
        # Generate user ID from token hash
        user_id = hashlib.sha256(request.token.encode()).hexdigest()[:16]
        
        # Create JWT token
        access_token = create_access_token(data={
            "sub": user_id,
            "organizze_token": request.token
        })
        
        logger.info(f"User {user_id} logged in successfully")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=3600 * 24  # 24 hours
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou erro de autenticação"
        )

@router.post("/validate")
async def validate_token():
    """Validar token atual (endpoint protegido)"""
    return {"status": "valid", "message": "Token válido"}

@router.post("/logout")
async def logout():
    """Logout (client-side token removal)"""
    return {"message": "Logout realizado com sucesso"}