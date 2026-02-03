import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBusiness } from '../context/BusinessContext'
import { getDashboardAnalytics } from '../services/analytics'
import { generateForecast, detectCashFlowRisks } from '../services/forecasting'
import { generateInsights } from '../services/ai'
import KPICard from '../components/dashboard/KPICard'
import RevenueChart from '../components/dashboard/RevenueChart'
import PendingInvoices from '../components/dashboard/PendingInvoices'
import ClientBreakdown from '../components/dashboard/ClientBreakdown'
import AIInsights from '../components/ai/AIInsights'
import './Dashboard.css'

function Dashboard() {
    const { business } = useBusiness()
    const [analytics, setAnalytics] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [insights, setInsights] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!business?.id) return

        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                // Fetch analytics
                const analyticsData = await getDashboardAnalytics(business.id)
                setAnalytics(analyticsData)

                // Generate forecast
                const forecastData = generateForecast(analyticsData)
                setForecast(forecastData)

                // Generate AI insights
                const insightsData = await generateInsights(analyticsData, forecastData)
                setInsights(insightsData)
            } catch (err) {
                console.error('Error fetching dashboard data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [business?.id])

    const formatCurrency = (amount) => {
        const currency = business?.currency || 'USD'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="error-icon">⚠️</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        )
    }

    // Handle empty state
    if (!analytics || (analytics.totalRevenue === 0 && analytics.totalExpenses === 0)) {
        return (
            <div className="dashboard-empty">
                <div className="empty-illustration">📊</div>
                <h2>Welcome to your dashboard!</h2>
                <p>Start by adding some clients and creating invoices to see your analytics.</p>
                <div className="empty-actions">
                    <Link to="/clients" className="btn btn-primary">
                        Add Your First Client
                    </Link>
                    <Link to="/invoices" className="btn btn-secondary">
                        Create an Invoice
                    </Link>
                </div>
            </div>
        )
    }

    const cashFlowRisks = detectCashFlowRisks(analytics)

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back, here's how your business is doing
                    </p>
                </div>
            </div>

            {/* Cash Flow Alerts */}
            {cashFlowRisks.length > 0 && (
                <div className="alerts-section">
                    {cashFlowRisks.map((risk, index) => (
                        <div key={index} className={`alert alert-${risk.severity}`}>
                            <span className="alert-icon">
                                {risk.severity === 'warning' ? '⚠️' : '💡'}
                            </span>
                            <span>{risk.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* KPI Cards */}
            <div className="kpi-grid">
                <KPICard
                    title="Total Revenue"
                    value={formatCurrency(analytics.totalRevenue)}
                    trend={analytics.momGrowth}
                    trendLabel="vs last month"
                    icon="revenue"
                />
                <KPICard
                    title="Total Expenses"
                    value={formatCurrency(analytics.totalExpenses)}
                    icon="expenses"
                />
                <KPICard
                    title="Net Profit"
                    value={formatCurrency(analytics.profit)}
                    subtitle={`${analytics.profitMargin}% margin`}
                    icon="profit"
                    positive={analytics.profit > 0}
                />
                <KPICard
                    title="Pending Payments"
                    value={formatCurrency(analytics.pendingPayments.total)}
                    subtitle={`${analytics.pendingPayments.count} invoices`}
                    icon="pending"
                />
            </div>

            {/* Forecast Banner */}
            {forecast && (
                <div className="forecast-banner">
                    <div className="forecast-icon">🔮</div>
                    <div className="forecast-content">
                        <h3>Next Month Forecast</h3>
                        <p>
                            Estimated revenue: <strong>{formatCurrency(forecast.nextMonthRevenue.estimate)}</strong>
                            {' · '}
                            Projected margin: <strong>{forecast.profitProjection.projectedMargin}%</strong>
                        </p>
                        <span className="forecast-note">Based on {forecast.dataPoints}-month historical data</span>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Revenue vs Expenses</h3>
                        <span className="card-subtitle">Last 6 months</span>
                    </div>
                    <RevenueChart
                        revenueData={analytics.monthlyRevenue}
                        expenseData={analytics.monthlyExpenses}
                        currency={business?.currency}
                    />
                </div>

                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Top Clients</h3>
                        <span className="card-subtitle">By revenue contribution</span>
                    </div>
                    <ClientBreakdown
                        clients={analytics.topClients}
                        currency={business?.currency}
                    />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-grid">
                <div className="invoices-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Invoices</h3>
                        <Link to="/invoices" className="card-link">View all</Link>
                    </div>
                    <PendingInvoices
                        invoices={analytics.recentInvoices}
                        currency={business?.currency}
                    />
                </div>

                <div className="insights-card">
                    <div className="card-header">
                        <h3 className="card-title">AI Insights</h3>
                        <span className="badge badge-info">Beta</span>
                    </div>
                    <AIInsights insights={insights} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
