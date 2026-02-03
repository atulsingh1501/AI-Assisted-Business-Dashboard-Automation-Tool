import { useState, useEffect } from 'react'
import { useBusiness } from '../context/BusinessContext'
import { db } from '../services/supabase'
import { format, parseISO } from 'date-fns'
import './DataPages.css'

const EXPENSE_CATEGORIES = [
    'Software & Tools',
    'Marketing',
    'Office Supplies',
    'Travel',
    'Professional Services',
    'Equipment',
    'Utilities',
    'Insurance',
    'Education & Training',
    'Other',
]

function Expenses() {
    const { business } = useBusiness()
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        amount: '',
        expense_date: format(new Date(), 'yyyy-MM-dd'),
    })
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (business?.id) {
            fetchExpenses()
        }
    }, [business?.id])

    const fetchExpenses = async () => {
        setLoading(true)
        try {
            const data = await db.getExpenses(business.id)
            setExpenses(data)
        } catch (err) {
            console.error('Error fetching expenses:', err)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (expense = null) => {
        if (expense) {
            setEditingExpense(expense)
            setFormData({
                category: expense.category || '',
                description: expense.description || '',
                amount: expense.amount,
                expense_date: expense.expense_date,
            })
        } else {
            setEditingExpense(null)
            setFormData({
                category: '',
                description: '',
                amount: '',
                expense_date: format(new Date(), 'yyyy-MM-dd'),
            })
        }
        setError('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingExpense(null)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.category) {
            setError('Please select a category')
            return
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount')
            return
        }

        setSaving(true)
        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
            }

            if (editingExpense) {
                await db.updateExpense(editingExpense.id, expenseData)
            } else {
                await db.createExpense({
                    ...expenseData,
                    business_id: business.id,
                })
            }
            await fetchExpenses()
            closeModal()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return

        try {
            await db.deleteExpense(expenseId)
            await fetchExpenses()
        } catch (err) {
            console.error('Error deleting expense:', err)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: business?.currency || 'USD',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        try {
            return format(parseISO(dateStr), 'MMM d, yyyy')
        } catch {
            return dateStr
        }
    }

    const getCategoryColor = (category) => {
        const colors = {
            'Software & Tools': 'var(--color-primary)',
            'Marketing': 'var(--color-info)',
            'Office Supplies': 'var(--color-warning)',
            'Travel': 'var(--color-success)',
            'Professional Services': '#8b5cf6',
            'Equipment': '#f97316',
            'Utilities': '#06b6d4',
            'Insurance': '#84cc16',
            'Education & Training': '#ec4899',
            'Other': 'var(--color-text-muted)',
        }
        return colors[category] || 'var(--color-text-muted)'
    }

    // Calculate total
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading expenses...</p>
            </div>
        )
    }

    return (
        <div className="data-page">
            <div className="page-header">
                <div>
                    <h1>Expenses</h1>
                    <p className="page-subtitle">Track your business expenses</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Expense
                </button>
            </div>

            {/* Summary */}
            {expenses.length > 0 && (
                <div className="expenses-summary">
                    <div className="summary-card">
                        <span className="summary-label">Total Expenses</span>
                        <span className="summary-value">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">This Month</span>
                        <span className="summary-value">
                            {formatCurrency(
                                expenses
                                    .filter(exp => {
                                        const expDate = parseISO(exp.expense_date)
                                        const now = new Date()
                                        return expDate.getMonth() === now.getMonth() &&
                                            expDate.getFullYear() === now.getFullYear()
                                    })
                                    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                            )}
                        </span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Entries</span>
                        <span className="summary-value">{expenses.length}</span>
                    </div>
                </div>
            )}

            {expenses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💸</div>
                    <h3 className="empty-state-title">No expenses tracked yet</h3>
                    <p className="empty-state-text">
                        Start tracking your expenses to understand your profit margins better.
                    </p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        Add Your First Expense
                    </button>
                </div>
            ) : (
                <div className="data-grid">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="data-card expense-card">
                            <div className="card-header-row">
                                <div className="expense-category">
                                    <span
                                        className="category-dot"
                                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                                    />
                                    <span className="category-name">{expense.category}</span>
                                </div>
                                <span className="card-amount expense-amount">
                                    -{formatCurrency(expense.amount)}
                                </span>
                            </div>

                            <div className="card-meta">
                                <div className="meta-row">
                                    <span className="meta-label">Date:</span>
                                    <span>{formatDate(expense.expense_date)}</span>
                                </div>
                                {expense.description && (
                                    <p className="expense-desc">{expense.description}</p>
                                )}
                            </div>

                            <div className="card-actions">
                                <button onClick={() => openModal(expense)} className="btn btn-ghost btn-sm">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(expense.id)} className="btn btn-ghost btn-sm text-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                            <button onClick={closeModal} className="btn btn-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {error && <div className="form-error-banner">{error}</div>}

                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {EXPENSE_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Amount *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-input"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.expense_date}
                                        onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What was this expense for?"
                                    rows={2}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Expenses
