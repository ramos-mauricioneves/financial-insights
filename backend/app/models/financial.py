from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime
from decimal import Decimal

class Account(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    type: str
    balance: Decimal

class Category(BaseModel):
    id: int
    name: str
    color: Optional[str] = None
    parent_id: Optional[int] = None

class Transaction(BaseModel):
    id: int
    description: str
    amount: Decimal
    date: datetime
    account_id: int
    category_id: Optional[int] = None
    notes: Optional[str] = None
    paid: bool = True

class PaginatedResponse(BaseModel):
    items: List[Union[Transaction, Account, Category]]
    total: int
    page: int
    per_page: int
    pages: int

class FinancialSummary(BaseModel):
    total_balance: Decimal
    monthly_income: Decimal
    monthly_expenses: Decimal
    budget_used: float
    categories_summary: List[dict]