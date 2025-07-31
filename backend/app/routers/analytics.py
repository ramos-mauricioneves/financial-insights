from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from decimal import Decimal
from app.core.security import get_current_user
from app.services.organizze_api import OrganizzeAPI
from app.core.cache import cache
from app.core.logging import get_logger

router = APIRouter(tags=["Análises"], dependencies=[Depends(get_current_user)])
logger = get_logger(__name__)

@router.get("/summary")
async def get_financial_summary(current_user: dict = Depends(get_current_user)):
    """Obter resumo financeiro"""
    try:
        api = OrganizzeAPI(api_key=current_user["organizze_token"])
        
        # Check cache first
        cache_key = cache.get_cache_key("summary", current_user["id"])
        cached_summary = cache.get(cache_key)
        if cached_summary:
            return cached_summary
        
        # Fetch data from API
        accounts_data = await api.get_accounts()
        transactions_data = await api.get_transactions(per_page=100)
        categories_data = await api.get_categories()
        
        # Calculate summary
        total_balance = sum(
            Decimal(str(account.get('balance', 0))) 
            for account in accounts_data.get('accounts', [])
        )
        
        # Get current month transactions
        current_month = datetime.now().replace(day=1)
        monthly_income = Decimal('0')
        monthly_expenses = Decimal('0')
        
        for transaction in transactions_data.get('transactions', []):
            amount = Decimal(str(transaction.get('amount', 0)))
            if amount > 0:
                monthly_income += amount
            else:
                monthly_expenses += abs(amount)
        
        # Category summary
        category_totals = {}
        for transaction in transactions_data.get('transactions', []):
            category_id = transaction.get('category_id')
            amount = abs(Decimal(str(transaction.get('amount', 0))))
            
            if category_id and amount > 0:
                category_name = next(
                    (cat['name'] for cat in categories_data.get('categories', []) 
                     if cat['id'] == category_id), 
                    'Outros'
                )
                category_totals[category_name] = category_totals.get(category_name, 0) + float(amount)
        
        summary = {
            "total_balance": float(total_balance),
            "monthly_income": float(monthly_income),
            "monthly_expenses": float(monthly_expenses),
            "net_income": float(monthly_income - monthly_expenses),
            "budget_used": min(100, (float(monthly_expenses) / max(float(monthly_income), 1)) * 100),
            "categories_summary": [
                {"name": name, "value": value, "color": _get_category_color(i)}
                for i, (name, value) in enumerate(sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:5])
            ]
        }
        
        # Cache for 30 minutes
        cache.set(cache_key, summary, ttl=1800)
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating financial summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao gerar resumo financeiro")

@router.get("/trends")
async def get_spending_trends(
    months: int = 6,
    current_user: dict = Depends(get_current_user)
):
    """Obter tendências de gastos dos últimos meses"""
    try:
        api = OrganizzeAPI(api_key=current_user["organizze_token"])
        
        # Get transactions for the last N months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months * 30)
        
        transactions_data = await api.get_transactions(
            per_page=1000,
            start_date=start_date.strftime('%Y-%m-%d'),
            end_date=end_date.strftime('%Y-%m-%d')
        )
        
        # Group by month
        monthly_data = {}
        for transaction in transactions_data.get('transactions', []):
            date = datetime.fromisoformat(transaction.get('date', '').replace('Z', '+00:00'))
            month_key = date.strftime('%Y-%m')
            amount = Decimal(str(transaction.get('amount', 0)))
            
            if month_key not in monthly_data:
                monthly_data[month_key] = {"income": 0, "expenses": 0}
            
            if amount > 0:
                monthly_data[month_key]["income"] += float(amount)
            else:
                monthly_data[month_key]["expenses"] += float(abs(amount))
        
        # Format for chart
        trend_data = [
            {
                "month": month,
                "receitas": data["income"],
                "despesas": data["expenses"],
                "saldo": data["income"] - data["expenses"]
            }
            for month, data in sorted(monthly_data.items())
        ]
        
        return {"trends": trend_data}
        
    except Exception as e:
        logger.error(f"Error generating spending trends: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao gerar tendências de gastos")

@router.get("/goals")
async def get_financial_goals(current_user: dict = Depends(get_current_user)):
    """Obter metas financeiras (simulado)"""
    # This would be stored in a database in a real implementation
    mock_goals = [
        {
            "id": 1,
            "name": "Reserva de Emergência",
            "target_amount": 30000.00,
            "current_amount": 15000.00,
            "deadline": "2024-12-31",
            "category": "emergencia"
        },
        {
            "id": 2,
            "name": "Viagem de Férias",
            "target_amount": 8000.00,
            "current_amount": 3500.00,
            "deadline": "2024-07-15",
            "category": "lazer"
        }
    ]
    
    return {"goals": mock_goals}

def _get_category_color(index: int) -> str:
    """Get color for category by index"""
    colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#387908', '#ff6b6b']
    return colors[index % len(colors)]