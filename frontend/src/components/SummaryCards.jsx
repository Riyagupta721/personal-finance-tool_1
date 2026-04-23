import React from 'react';

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const { total, categories } = summary;

  return (
    <div className="summary-container">
      <div className="summary-card main-total">
        <h3>Total Expenses</h3>
        <p className="total-amount">₹{parseFloat(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      
      <div className="category-summary">
        {Object.entries(categories).map(([category, amount]) => (
          <div key={category} className="summary-card category-card">
            <h4>{category}</h4>
            <p>₹{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
