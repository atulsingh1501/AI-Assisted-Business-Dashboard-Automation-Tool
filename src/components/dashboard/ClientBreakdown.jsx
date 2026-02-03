import './ClientBreakdown.css'

function ClientBreakdown({ clients, currency = 'USD' }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    if (!clients || clients.length === 0) {
        return (
            <div className="client-breakdown-empty">
                <p>No client data yet</p>
            </div>
        )
    }

    const colors = [
        'var(--color-primary)',
        'var(--color-info)',
        'var(--color-success)',
        'var(--color-warning)',
        'var(--color-danger)',
    ]

    return (
        <div className="client-breakdown">
            {clients.map((client, index) => (
                <div key={client.id} className="client-row">
                    <div className="client-info">
                        <div
                            className="client-color"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <div className="client-details">
                            <span className="client-name">{client.name}</span>
                            {client.company && (
                                <span className="client-company">{client.company}</span>
                            )}
                        </div>
                    </div>
                    <div className="client-stats">
                        <span className="client-revenue">{formatCurrency(client.revenue)}</span>
                        <span className="client-percent">{client.percentage}%</span>
                    </div>
                </div>
            ))}

            {/* Visual bar representation */}
            <div className="breakdown-bar">
                {clients.map((client, index) => (
                    <div
                        key={client.id}
                        className="bar-segment"
                        style={{
                            width: `${client.percentage}%`,
                            backgroundColor: colors[index % colors.length],
                        }}
                        title={`${client.name}: ${client.percentage}%`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ClientBreakdown
