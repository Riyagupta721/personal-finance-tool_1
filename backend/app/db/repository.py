from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from app.db import models, schemas
from decimal import Decimal

class ExpenseRepository:
    def get_expenses(
        self, 
        db: Session, 
        category: Optional[str] = None, 
        sort_by_date_desc: bool = True
    ) -> List[models.Expense]:
        query = db.query(models.Expense)
        if category:
            query = query.filter(models.Expense.category == category)
        
        if sort_by_date_desc:
            query = query.order_by(desc(models.Expense.date))
        else:
            query = query.order_by(models.Expense.date)
            
        return query.all()

    def get_expense_by_idempotency_key(self, db: Session, key: str) -> Optional[models.Expense]:
        return db.query(models.Expense).filter(models.Expense.idempotency_key == key).first()

    def create_expense(self, db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
        db_expense = models.Expense(
            amount=expense.amount,
            category=expense.category,
            description=expense.description,
            date=expense.date,
            idempotency_key=expense.idempotency_key
        )
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return db_expense

    def get_summary(self, db: Session):
        from sqlalchemy import func
        total = db.query(func.sum(models.Expense.amount)).scalar() or Decimal('0')
        categories = db.query(
            models.Expense.category, 
            func.sum(models.Expense.amount).label('total')
        ).group_by(models.Expense.category).all()
        
        return {
            "total": total,
            "categories": {cat: amt for cat, amt in categories}
        }

expense_repo = ExpenseRepository()
