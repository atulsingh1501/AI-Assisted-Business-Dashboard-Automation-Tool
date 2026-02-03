import { useState, useEffect } from 'react'
import { useBusiness } from '../context/BusinessContext'
import { db } from '../services/supabase'
import { format, parseISO } from 'date-fns'
import './DataPages.css'

function Invoices() {
    const { business } = useBusiness()
    const [invoices, setInvoices] = useState([])
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingInvoice, setEditingInvoice] = useState(null)
    const [filter, setFilter] = useState('all')
    const [formData, setFormData] = useState({
        invoice_number: '',
        client_id: '',
        description: '',
        amount: '',
        status: 'pending',
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: '',
    })
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (business?.id) {
            fetchData()
        }
    }, [business?.id])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [invoicesData, clientsData] = await Promise.all([
                db.getInvoices(business.id),
                db.getClients(business.id),
            ])
            setInvoices(invoicesData)
            setClients(clientsData)
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const generateInvoiceNumber = () => {
        const prefix = 'INV'
        const date = format(new Date(), 'yyyyMM')
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        return `${prefix}-${date}-${random}`
    }

    const openModal = (invoice = null) => {
        if (invoice) {
            setEditingInvoice(invoice)
            setFormData({
                invoice_number: invoice.invoice_number,
                client_id: invoice.client_id || '',
                description: invoice.description || '',
                amount: invoice.amount,
                status: invoice.status,
                issue_date: invoice.issue_date,
                due_date: invoice.due_date || '',
            })
        } else {
            setEditingInvoice(null)
            setFormData({
                invoice_number: generateInvoiceNumber(),
                client_id: '',
                description: '',
                amount: '',
                status: 'pending',
                issue_date: format(new Date(), 'yyyy-MM-dd'),
                due_date: '',
            })
        }
        setError('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingInvoice(null)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount')
            return
        }

        setSaving(true)
        try {
            const invoiceData = {
                ...formData,
                amount: parseFloat(formData.amount),
                client_id: formData.client_id || null,
                due_date: formData.due_date || null,
            }

            if (editingInvoice) {
                await db.updateInvoice(editingInvoice.id, invoiceData)
            } else {
                await db.createInvoice({
                    ...invoiceData,
                    business_id: business.id,
                })
            }
            await fetchData()
            closeModal()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleMarkPaid = async (invoiceId) => {
        try {
            await db.markInvoicePaid(invoiceId)
            await fetchData()
        } catch (err) {
            console.error('Error marking invoice paid:', err)
        }
    }

    const handleDelete = async (invoiceId) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return

        try {
            await db.deleteInvoice(invoiceId)
            await fetchData()
        } catch (err) {
            console.error('Error deleting invoice:', err)
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

    const getStatusBadge = (status) => {
        const classes = {
            paid: 'badge-success',
            pending: 'badge-warning',
            overdue: 'badge-danger',
            cancelled: 'badge-neutral',
        }
        return classes[status] || 'badge-neutral'
    }

    const filteredInvoices = filter === 'all'
        ? invoices
        : invoices.filter(inv => inv.status === filter)

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading invoices...</p>
            </div>
        )
    }

    return (
        <div className="data-page">
            <div className="page-header">
                <div>
                    <h1>Invoices</h1>
                    <p className="page-subtitle">Track and manage your invoices</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Invoice
                </button>
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs">
                {['all', 'pending', 'paid', 'overdue'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="tab-count">
                            {status === 'all'
                                ? invoices.length
                                : invoices.filter(inv => inv.status === status).length}
                        </span>
                    </button>
                ))}
            </div>

            {invoices.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <h3 className="empty-state-title">No invoices yet</h3>
                    <p className="empty-state-text">
                        Create your first invoice to start tracking payments.
                    </p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        Create Your First Invoice
                    </button>
                </div>
            ) : (
                <div className="data-grid">
                    {filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="data-card">
                            <div className="card-header-row">
                                <div>
                                    <span className="invoice-number">{invoice.invoice_number}</span>
                                    <span className={`badge ${getStatusBadge(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                                <span className="card-amount">{formatCurrency(invoice.amount)}</span>
                            </div>

                            <div className="card-meta">
                                <div className="meta-row">
                                    <span className="meta-label">Client:</span>
                                    <span>{invoice.client?.name || 'No client'}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Issued:</span>
                                    <span>{formatDate(invoice.issue_date)}</span>
                                </div>
                                {invoice.due_date && (
                                    <div className="meta-row">
                                        <span className="meta-label">Due:</span>
                                        <span>{formatDate(invoice.due_date)}</span>
                                    </div>
                                )}
                                {invoice.description && (
                                    <p className="invoice-desc">{invoice.description}</p>
                                )}
                            </div>

                            <div className="card-actions">
                                {invoice.status === 'pending' && (
                                    <button
                                        onClick={() => handleMarkPaid(invoice.id)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ color: 'var(--color-success)' }}
                                    >
                                        Mark Paid
                                    </button>
                                )}
                                <button onClick={() => openModal(invoice)} className="btn btn-ghost btn-sm">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(invoice.id)} className="btn btn-ghost btn-sm text-danger">
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
                            <h2>{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
                            <button onClick={closeModal} className="btn btn-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {error && <div className="form-error-banner">{error}</div>}

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Invoice Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.invoice_number}
                                        onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                        required
                                    />
                                </div>

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
                            </div>

                            <div className="form-group">
                                <label className="form-label">Client</label>
                                <select
                                    className="form-select"
                                    value={formData.client_id}
                                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} {client.company ? `(${client.company})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Invoice description..."
                                    rows={2}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Issue Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.issue_date}
                                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Invoices
