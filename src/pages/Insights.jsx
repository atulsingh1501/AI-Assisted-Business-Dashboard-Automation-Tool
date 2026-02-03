import { useState, useEffect } from 'react'
import { useBusiness } from '../context/BusinessContext'
import { getDashboardAnalytics } from '../services/analytics'
import { generateForecast, detectCashFlowRisks } from '../services/forecasting'
import { generateInsights } from '../services/ai'
import './Insights.css'

function Insights() {
    const { business } = useBusiness()
    const [analytics, setAnalytics] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [insights, setInsights] = useState(null)
    const [risks, setRisks] = useState([])
    const [loading, setLoading] = useState(true)
    const [regenerating, setRegenerating] = useState(false)

    useEffect(() => {
        if (business?.id) {
            fetchInsights()
        }
    }, [business?.id])

    const fetchInsights = async (isRegenerate = false) => {
        if (isRegenerate) {
            setRegenerating(true)
        } else {
            setLoading(true)
        }

        try {
            const analyticsData = await getDashboardAnalytics(business.id)
            setAnalytics(analyticsData)

            const forecastData = generateForecast(analyticsData)
            setForecast(forecastData)

            const risksData = detectCashFlowRisks(analyticsData)
            setRisks(risksData)

            const insightsData = await generateInsights(analyticsData, forecastData)
            setInsights(insightsData)
        } catch (err) {
            console.error('Error fetching insights:', err)
        } finally {
            setLoading(false)
            setRegenerating(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: business?.currency || 'USD',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Analyzing your business data...</p>
            </div>
        )
    }

    return (
        <div className="insights-page">
            <div className="page-header">
                <div>
                    <h1>AI Insights</h1>
                    <p className="page-subtitle">AI-powered analysis of your business performance</p>
                </div>
                <button
                    onClick={() => fetchInsights(true)}
                    className="btn btn-secondary"
                    disabled={regenerating}
                >
                    {regenerating ? (
                        <>
                            <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                            Regenerating...
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Regenerate
                        </>
                    )}
                </button>
            </div>

            {/* Business Summary Card */}
            {insights && (
                <div className="insight-card summary-card">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                        <h2>Business Health Summary</h2>
                        <p className="summary-text">{insights.summary}</p>
                    </div>
                </div>
            )}

            {/* Forecast Section */}
            {forecast && analytics && (
                <div className="forecast-section">
                    <h2 className="section-title">
                        <span className="title-icon">🔮</span>
                        Forecasts & Projections
                    </h2>

                    <div className="forecast-grid">
                        <div className="forecast-card">
                            <span className="forecast-label">Next Month Revenue</span>
                            <span className="forecast-value">
                                {formatCurrency(forecast.nextMonthRevenue.estimate)}
                            </span>
                            <span className="forecast-meta">
                                Based on {forecast.dataPoints}-month {forecast.nextMonthRevenue.method}
                            </span>
                            <span className={`forecast-confidence ${forecast.nextMonthRevenue.confidence}`}>
                                {forecast.nextMonthRevenue.confidence} confidence
                            </span>
                        </div>

                        <div className="forecast-card">
                            <span className="forecast-label">Revenue Trend</span>
                            <span className={`forecast-trend ${forecast.revenueTrend.direction}`}>
                                {forecast.revenueTrend.direction === 'growing' && '📈'}
                                {forecast.revenueTrend.direction === 'declining' && '📉'}
                                {forecast.revenueTrend.direction === 'stable' && '➡️'}
                                {' '}
                                {forecast.revenueTrend.direction.charAt(0).toUpperCase() +
                                    forecast.revenueTrend.direction.slice(1)}
                            </span>
                            <span className="forecast-meta">
                                {forecast.revenueTrend.monthlyChange >= 0 ? '+' : ''}
                                {formatCurrency(forecast.revenueTrend.monthlyChange)} per month
                            </span>
                        </div>

                        <div className="forecast-card">
                            <span className="forecast-label">Projected Profit Margin</span>
                            <span className="forecast-value">
                                {forecast.profitProjection.projectedMargin}%
                            </span>
                            <span className="forecast-meta">
                                Projected profit: {formatCurrency(forecast.profitProjection.projectedProfit)}
                            </span>
                        </div>
                    </div>

                    <p className="forecast-disclaimer">
                        ⚠️ {forecast.disclaimer}
                    </p>
                </div>
            )}

            {/* Risk Warnings */}
            {risks.length > 0 && (
                <div className="risks-section">
                    <h2 className="section-title">
                        <span className="title-icon">⚠️</span>
                        Risk Alerts
                    </h2>

                    <div className="risks-list">
                        {risks.map((risk, index) => (
                            <div key={index} className={`risk-card severity-${risk.severity}`}>
                                <div className="risk-type">{risk.type.replace('_', ' ')}</div>
                                <p className="risk-message">{risk.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Insights */}
            {insights && (
                <div className="detailed-insights">
                    {/* Risks */}
                    {insights.risks && insights.risks.length > 0 && (
                        <div className="insights-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">🎯</span>
                                Risks to Watch
                            </h3>
                            <ul className="insights-list">
                                {insights.risks.map((risk, index) => (
                                    <li key={index} className="insight-item risk">
                                        <span className="item-bullet"></span>
                                        {risk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Opportunities */}
                    {insights.opportunities && insights.opportunities.length > 0 && (
                        <div className="insights-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">💡</span>
                                Opportunities
                            </h3>
                            <ul className="insights-list">
                                {insights.opportunities.map((opp, index) => (
                                    <li key={index} className="insight-item opportunity">
                                        <span className="item-bullet"></span>
                                        {opp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    {insights.actions && insights.actions.length > 0 && (
                        <div className="insights-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">✅</span>
                                Recommended Actions
                            </h3>
                            <ul className="insights-list">
                                {insights.actions.map((action, index) => (
                                    <li key={index} className="insight-item action">
                                        <span className="item-bullet"></span>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* AI Disclaimer */}
            <div className="ai-disclaimer-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                    <strong>About AI Insights</strong>
                    <p>
                        These insights are generated by AI based on your business data.
                        AI provides summaries and suggestions but does not perform financial calculations.
                        All numbers are computed from your actual records. Always verify recommendations
                        before taking action.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Insights
