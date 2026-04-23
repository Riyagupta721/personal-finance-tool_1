from pydantic import BaseModel, Field, validator
from datetime import datetime
from uuid import UUID
from typing import Optional
from decimal import Decimal

class ExpenseBase(BaseModel):
    amount: Decimal = Field(..., gt=0, description="The amount of the expense, must be positive.")
    category: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=255)
    date: datetime

class ExpenseCreate(ExpenseBase):
    idempotency_key: Optional[str] = Field(None, max_length=100)

class Expense(ExpenseBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseSummary(BaseModel):
    total: Decimal
    count: int
