from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime
from app.services.organizze_api import OrganizzeAPI
from app.core.security import get_current_user
from app.core.logging import get_logger
from app.models.financial import PaginatedResponse

router = APIRouter(tags=["Organizze"], dependencies=[Depends(get_current_user)])
logger = get_logger(__name__)

def get_organizze_api(current_user: dict = Depends(get_current_user)) -> OrganizzeAPI:
    """Get Organizze API instance with user's token"""
    try:
        return OrganizzeAPI(api_key=current_user["organizze_token"])
    except ValueError as e:
        logger.error(f"Error creating Organizze API instance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/accounts")
async def get_accounts(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Buscar contas do Organizze"""
    try:
        logger.info("Fetching accounts from Organizze API")
        return await api.get_accounts()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching accounts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/transactions")
async def get_transactions(
    page: int = Query(1, ge=1, description="Número da página"),
    per_page: int = Query(50, ge=1, le=100, description="Itens por página"),
    start_date: Optional[str] = Query(None, description="Data inicial (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Data final (YYYY-MM-DD)"),
    api: OrganizzeAPI = Depends(get_organizze_api)
):
    """Buscar transações do Organizze com paginação e filtros"""
    try:
        # Validate date format if provided
        if start_date:
            try:
                datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                raise HTTPException(status_code=400, detail="Formato de data inicial inválido. Use YYYY-MM-DD")
        
        if end_date:
            try:
                datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                raise HTTPException(status_code=400, detail="Formato de data final inválido. Use YYYY-MM-DD")
        
        logger.info(f"Fetching transactions: page={page}, per_page={per_page}")
        return await api.get_transactions(
            page=page, 
            per_page=per_page,
            start_date=start_date,
            end_date=end_date
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/categories")
async def get_categories(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Buscar categorias do Organizze"""
    try:
        logger.info("Fetching categories from Organizze API")
        return await api.get_categories()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/budgets")
async def get_budgets(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Buscar orçamentos do Organizze"""
    try:
        logger.info("Fetching budgets from Organizze API")
        return await api.get_budgets()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching budgets: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/health")
async def check_organizze_health(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Verificar se a API do Organizze está acessível"""
    try:
        is_healthy = await api.health_check()
        return {
            "status": "healthy" if is_healthy else "unhealthy",
            "service": "organizze-api",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error checking Organizze health: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "organizze-api",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }
