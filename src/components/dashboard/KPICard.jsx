import './KPICard.css'

const ICONS = {
    revenue: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    expenses: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    ),
    profit: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    pending: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
}

function KPICard({ title, value, trend, trendLabel, subtitle, icon, positive = true }) {
    const getTrendClass = () => {
        if (trend === undefined || trend === null) return ''
        return trend >= 0 ? 'positive' : 'negative'
    }

    const getTrendIcon = () => {
        if (trend === undefined || trend === null) return null
        return trend >= 0 ? '↑' : '↓'
    }

    return (
        <div className="kpi-card">
            <div className="kpi-header">
                <div className={`kpi-icon icon-${icon}`}>
                    {ICONS[icon] || ICONS.revenue}
                </div>
                {trend !== undefined && trend !== null && (
                    <div className={`kpi-trend ${getTrendClass()}`}>
                        <span className="trend-icon">{getTrendIcon()}</span>
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div className="kpi-content">
                <span className="kpi-label">{title}</span>
                <span className={`kpi-value ${!positive ? 'negative' : ''}`}>{value}</span>
                {(trendLabel || subtitle) && (
                    <span className="kpi-subtitle">
                        {trendLabel || subtitle}
                    </span>
                )}
            </div>
        </div>
    )
}

export default KPICard
