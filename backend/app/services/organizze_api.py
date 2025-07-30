import os
import httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException

class OrganizzeAPI:
    def __init__(self):
        self.base_url = "https://api.organizze.com.br"
        self.api_key = os.getenv("ORGANIZZE_API_KEY")
        if not self.api_key:
            raise ValueError("ORGANIZZE_API_KEY environment variable is required")
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Basic {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def get_accounts(self) -> Dict[str, Any]:
        """Buscar contas do Organizze"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/accounts",
                headers=self._get_headers()
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar contas")
            return response.json()
    
    async def get_transactions(self, page: int = 1, per_page: int = 50) -> Dict[str, Any]:
        """Buscar transações do Organizze com paginação"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/transactions",
                headers=self._get_headers(),
                params={"page": page, "per_page": per_page}
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar transações")
            return response.json()
    
    async def get_categories(self) -> Dict[str, Any]:
        """Buscar categorias do Organizze"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/categories",
                headers=self._get_headers()
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar categorias")
            return response.json()
