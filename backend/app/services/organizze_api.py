import os
import httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException
from app.core.cache import cache
from app.core.logging import get_logger

logger = get_logger(__name__)

class OrganizzeAPI:
    def __init__(self, api_key: Optional[str] = None):
        self.base_url = "https://api.organizze.com.br"
        self.api_key = api_key or os.getenv("ORGANIZZE_API_KEY")
        if not self.api_key:
            raise ValueError("ORGANIZZE_API_KEY environment variable is required")
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Basic {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Financial-Insights/1.0"
        }
    
    async def _make_request(self, endpoint: str, method: str = "GET", **kwargs) -> Dict[str, Any]:
        """Make HTTP request with error handling and logging"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        # Check cache first for GET requests
        cache_key = None
        if method == "GET":
            cache_key = cache.get_cache_key("organizze", endpoint, str(kwargs.get('params', {})))
            cached_data = cache.get(cache_key)
            if cached_data:
                logger.info(f"Cache hit for {endpoint}")
                return cached_data
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"Making API request to {endpoint}")
                response = await client.request(
                    method=method,
                    url=url,
                    headers=self._get_headers(),
                    **kwargs
                )
                
                if response.status_code == 401:
                    logger.error("Unauthorized access to Organizze API")
                    raise HTTPException(
                        status_code=401, 
                        detail="Token da API inválido ou expirado"
                    )
                elif response.status_code == 429:
                    logger.warning("Rate limit exceeded")
                    raise HTTPException(
                        status_code=429,
                        detail="Muitas requisições. Tente novamente em alguns minutos."
                    )
                elif response.status_code != 200:
                    logger.error(f"API request failed: {response.status_code} - {response.text}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Erro na API do Organizze: {response.status_code}"
                    )
                
                data = response.json()
                
                # Cache successful GET responses
                if method == "GET" and cache_key:
                    cache.set(cache_key, data, ttl=1800)  # 30 minutes
                
                logger.info(f"Successfully fetched data from {endpoint}")
                return data
                
        except httpx.TimeoutException:
            logger.error(f"Timeout on request to {endpoint}")
            raise HTTPException(
                status_code=504,
                detail="Timeout na comunicação com a API do Organizze"
            )
        except httpx.NetworkError as e:
            logger.error(f"Network error on request to {endpoint}: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="Erro de conexão com a API do Organizze"
            )
        except Exception as e:
            logger.error(f"Unexpected error on request to {endpoint}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Erro interno do servidor"
            )
    
    async def get_accounts(self) -> Dict[str, Any]:
        """Buscar contas do Organizze"""
        return await self._make_request("/accounts")
    
    async def get_transactions(self, page: int = 1, per_page: int = 50, 
                              start_date: Optional[str] = None, 
                              end_date: Optional[str] = None) -> Dict[str, Any]:
        """Buscar transações do Organizze com paginação e filtros"""
        params = {"page": page, "per_page": per_page}
        
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
            
        return await self._make_request("/transactions", params=params)
    
    async def get_categories(self) -> Dict[str, Any]:
        """Buscar categorias do Organizze"""
        return await self._make_request("/categories")
    
    async def get_budgets(self) -> Dict[str, Any]:
        """Buscar orçamentos do Organizze"""
        return await self._make_request("/budgets")
    
    async def health_check(self) -> bool:
        """Verificar se a API do Organizze está acessível"""
        try:
            await self._make_request("/accounts")
            return True
        except Exception:
            return False
