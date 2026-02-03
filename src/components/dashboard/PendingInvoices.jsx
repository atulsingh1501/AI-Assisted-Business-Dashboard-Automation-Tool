import { format, parseISO } from 'date-fns'
import './PendingInvoices.css'

function PendingInvoices({ invoices, currency = 'USD' }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
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

    if (!invoices || invoices.length === 0) {
        return (
            <div className="invoices-empty">
                <p>No invoices yet</p>
            </div>
        )
    }

    return (
        <div className="pending-invoices">
            <div className="table-container">
                <table className="invoices-table">
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>
                                    <span className="invoice-number">{invoice.invoice_number}</span>
                                </td>
                                <td>
                                    <div className="client-cell">
                                        <span className="client-name">
                                            {invoice.client?.name || 'Unknown'}
                                        </span>
                                        {invoice.client?.company && (
                                            <span className="client-company">
                                                {invoice.client.company}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>{formatDate(invoice.issue_date)}</td>
                                <td className="amount-cell">
                                    {formatCurrency(invoice.amount)}
                                </td>
                                <td>
                                    <span className={`badge ${getStatusBadge(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PendingInvoices
