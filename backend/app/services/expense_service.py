from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.repository import expense_repo
from app.db import schemas, models
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class ExpenseService:
    def list_expenses(
        self, 
        db: Session, 
        category: Optional[str] = None, 
        sort_by_date_desc: bool = True
    ) -> List[models.Expense]:
        return expense_repo.get_expenses(db, category, sort_by_date_desc)

    def add_expense(self, db: Session, expense_in: schemas.ExpenseCreate) -> models.Expense:
        # Check for idempotency key to prevent duplicates
        if expense_in.idempotency_key:
            existing_expense = expense_repo.get_expense_by_idempotency_key(db, expense_in.idempotency_key)
            if existing_expense:
                logger.info(f"Duplicate request detected for idempotency key: {expense_in.idempotency_key}")
                # Return the existing expense (Idempotent behavior)
                return existing_expense
        
        try:
            return expense_repo.create_expense(db, expense_in)
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating expense: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create expense"
            )

expense_service = ExpenseService()
