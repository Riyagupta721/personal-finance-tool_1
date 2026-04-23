from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db import schemas
from app.services.expense_service import expense_service

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.get("/", response_model=List[schemas.Expense])
def get_expenses(
    category: Optional[str] = Query(None, description="Filter by category"),
    sort: str = Query("date_desc", description="Sort order: date_desc or date_asc"),
    db: Session = Depends(get_db)
):
    sort_by_date_desc = sort == "date_desc"
    return expense_service.list_expenses(db, category, sort_by_date_desc)

@router.post("/", response_model=schemas.Expense, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: schemas.ExpenseCreate,
    db: Session = Depends(get_db)
):
    return expense_service.add_expense(db, expense_in)

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    return expense_service.get_summary(db)
