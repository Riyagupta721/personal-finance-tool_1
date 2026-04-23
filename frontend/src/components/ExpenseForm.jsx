import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import api from '../api';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: amount,
        date: new Date(formData.date).toISOString()
      };

      const response = await api.post('/expenses/', payload);
      onExpenseAdded(response.data);
      
      // Reset form but keep date
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to add expense. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="input-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, amount: val });
              if (parseFloat(val) <= 0) {
                setError('Amount cannot be negative');
              } else {
                setError(null);
              }
            }}
            placeholder="0.00"
          />
        </div>
        <div className="input-group">
          <label>Category</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label>Description</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What was this for?"
          />
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? <Loader2 className="loading-spinner" /> : <PlusCircle size={20} />}
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
};

export default ExpenseForm;
