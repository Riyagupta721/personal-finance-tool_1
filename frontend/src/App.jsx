import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryCards from './components/SummaryCards';
import api from './api';
import { Filter, SortDesc } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date_desc');

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.category = filter;
      params.sort = sort;

      const [expensesRes, summaryRes] = await Promise.all([
        api.get('/expenses/', { params }),
        api.get('/expenses/summary')
      ]);
      
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter, sort]);

  const handleExpenseAdded = (newExpense) => {
    fetchExpenses(); // Refetch to get updated summary
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${expenseId}`);
        fetchExpenses(); // Refetch to update list and summary
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const categories = [
    'All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other'
  ];

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <SummaryCards summary={summary} />

      <ExpenseForm onExpenseAdded={handleExpenseAdded} />

      <div className="filter-bar">
        <div className="input-group" style={{ flex: 1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={14} /> Filter by Category
          </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c === 'All' ? '' : c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SortDesc size={14} /> Sort Order
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>

      <ExpenseList expenses={expenses} loading={loading} onDelete={handleDeleteExpense} />
    </div>
  );
}

export default App;
