import React, { useState } from 'react';

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const { total, categories } = summary;
  const categoryList = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0] || '');

  return (
    <div className="summary-container">
      <div className="summary-card main-total">
        <h3>Total Expenses</h3>
        <p className="total-amount">₹{parseFloat(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      
      <div className="category-explorer">
        <div className="glass-card explorer-card">
          <div className="explorer-header">
            <h4>Category Breakdown</h4>
            <select 
              className="category-select"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoryList.length === 0 ? (
                <option>No data available</option>
              ) : (
                categoryList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
          
          {selectedCategory && categories[selectedCategory] !== undefined && (
            <div className="selected-category-view">
              <span className="cat-label">{selectedCategory} Total</span>
              <span className="cat-value">₹{parseFloat(categories[selectedCategory]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
