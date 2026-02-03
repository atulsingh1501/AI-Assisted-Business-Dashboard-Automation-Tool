import './AIInsights.css'

function AIInsights({ insights }) {
    if (!insights) {
        return (
            <div className="ai-insights-loading">
                <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                <p>Generating insights...</p>
            </div>
        )
    }

    return (
        <div className="ai-insights">
            {/* Summary */}
            <div className="insight-summary">
                <p>{insights.summary}</p>
            </div>

            {/* Risks */}
            {insights.risks && insights.risks.length > 0 && (
                <div className="insight-section">
                    <h4 className="section-label risk-label">
                        <span className="label-icon">⚠️</span>
                        Risks to Watch
                    </h4>
                    <ul className="insight-list">
                        {insights.risks.map((risk, index) => (
                            <li key={index} className="insight-item risk-item">
                                {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Opportunities */}
            {insights.opportunities && insights.opportunities.length > 0 && (
                <div className="insight-section">
                    <h4 className="section-label opportunity-label">
                        <span className="label-icon">💡</span>
                        Opportunities
                    </h4>
                    <ul className="insight-list">
                        {insights.opportunities.map((opp, index) => (
                            <li key={index} className="insight-item opportunity-item">
                                {opp}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            {insights.actions && insights.actions.length > 0 && (
                <div className="insight-section">
                    <h4 className="section-label action-label">
                        <span className="label-icon">✅</span>
                        Recommended Actions
                    </h4>
                    <ul className="insight-list">
                        {insights.actions.map((action, index) => (
                            <li key={index} className="insight-item action-item">
                                {action}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="ai-disclaimer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>AI-generated insights based on your data. Always verify before taking action.</span>
            </div>
        </div>
    )
}

export default AIInsights
