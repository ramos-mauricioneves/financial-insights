from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.services.organizze_api import OrganizzeAPI

router = APIRouter(tags=["Organizze"])

def get_organizze_api() -> OrganizzeAPI:
    try:
        return OrganizzeAPI()
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/accounts")
async def get_accounts(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Buscar contas do Organizze"""
    try:
        return await api.get_accounts()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/transactions")
async def get_transactions(
    page: Optional[int] = 1,
    per_page: Optional[int] = 50,
    api: OrganizzeAPI = Depends(get_organizze_api)
):
    """Buscar transações do Organizze com paginação"""
    try:
        return await api.get_transactions(page=page, per_page=per_page)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/categories")
async def get_categories(api: OrganizzeAPI = Depends(get_organizze_api)):
    """Buscar categorias do Organizze"""
    try:
        return await api.get_categories()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
