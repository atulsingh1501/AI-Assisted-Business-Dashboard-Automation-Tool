import { useState, useEffect } from 'react'
import { useBusiness } from '../context/BusinessContext'
import { db } from '../services/supabase'
import './DataPages.css'

function Clients() {
    const { business } = useBusiness()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingClient, setEditingClient] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
    })
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (business?.id) {
            fetchClients()
        }
    }, [business?.id])

    const fetchClients = async () => {
        setLoading(true)
        try {
            const data = await db.getClients(business.id)
            setClients(data)
        } catch (err) {
            console.error('Error fetching clients:', err)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client)
            setFormData({
                name: client.name || '',
                email: client.email || '',
                phone: client.phone || '',
                company: client.company || '',
                notes: client.notes || '',
            })
        } else {
            setEditingClient(null)
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                notes: '',
            })
        }
        setError('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingClient(null)
        setFormData({ name: '', email: '', phone: '', company: '', notes: '' })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            setError('Client name is required')
            return
        }

        setSaving(true)
        try {
            if (editingClient) {
                await db.updateClient(editingClient.id, formData)
            } else {
                await db.createClient({
                    ...formData,
                    business_id: business.id,
                })
            }
            await fetchClients()
            closeModal()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (clientId) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return

        try {
            await db.deleteClient(clientId)
            await fetchClients()
        } catch (err) {
            console.error('Error deleting client:', err)
        }
    }

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading clients...</p>
            </div>
        )
    }

    return (
        <div className="data-page">
            <div className="page-header">
                <div>
                    <h1>Clients</h1>
                    <p className="page-subtitle">Manage your client relationships</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Client
                </button>
            </div>

            {clients.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3 className="empty-state-title">No clients yet</h3>
                    <p className="empty-state-text">
                        Add your first client to start tracking projects and invoices.
                    </p>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        Add Your First Client
                    </button>
                </div>
            ) : (
                <div className="data-grid">
                    {clients.map((client) => (
                        <div key={client.id} className="data-card">
                            <div className="card-main">
                                <div className="card-avatar">
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="card-info">
                                    <h3 className="card-name">{client.name}</h3>
                                    {client.company && (
                                        <p className="card-company">{client.company}</p>
                                    )}
                                </div>
                            </div>

                            <div className="card-details">
                                {client.email && (
                                    <div className="detail-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <span>{client.email}</span>
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="detail-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                <button onClick={() => openModal(client)} className="btn btn-ghost btn-sm">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="btn btn-ghost btn-sm text-danger">
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
                            <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
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
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Client name"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Company name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional notes about this client..."
                                    rows={3}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editingClient ? 'Update Client' : 'Add Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Clients
