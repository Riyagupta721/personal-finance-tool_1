import React from 'react';
import { format } from 'date-fns';
import { Calendar, Tag, FileText, Trash2 } from 'lucide-react';

const ExpenseList = ({ expenses, loading, onDelete }) => {
  if (loading && expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p color="var(--text-muted)">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <p color="var(--text-muted)">No expenses found. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <h3>{expense.category}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <Calendar size={12} />
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </span>
                {expense.description && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <FileText size={12} />
                    {expense.description}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="expense-amount">
                ₹{parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <button 
                className="delete-btn"
                onClick={() => onDelete(expense.id)}
                title="Delete Expense"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
