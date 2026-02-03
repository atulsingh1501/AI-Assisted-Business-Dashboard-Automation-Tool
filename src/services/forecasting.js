/**
 * Forecasting Module
 * Simple, explainable forecasting methods based on historical data.
 * All forecasts are clearly labeled as estimates.
 */

/**
 * Calculate 3-month moving average for revenue prediction
 * @param {Array} monthlyData - Array of {month, revenue} objects
 * @returns {number} - Predicted next month revenue
 */
export function movingAverage(monthlyData, periods = 3) {
    if (!monthlyData || monthlyData.length === 0) {
        return 0
    }

    const recentData = monthlyData.slice(-periods)
    if (recentData.length === 0) return 0

    const sum = recentData.reduce((acc, item) => acc + (item.revenue || 0), 0)
    return Math.round(sum / recentData.length)
}

/**
 * Simple linear trend projection
 * @param {Array} monthlyData - Array of {month, revenue} objects
 * @returns {Object} - { slope, nextMonthEstimate, trend }
 */
export function linearTrend(monthlyData) {
    if (!monthlyData || monthlyData.length < 2) {
        return {
            slope: 0,
            nextMonthEstimate: monthlyData?.[0]?.revenue || 0,
            trend: 'stable',
        }
    }

    const n = monthlyData.length
    const values = monthlyData.map((d) => d.revenue || 0)

    // Calculate means
    const xMean = (n - 1) / 2
    const yMean = values.reduce((a, b) => a + b, 0) / n

    // Calculate slope using least squares
    let numerator = 0
    let denominator = 0

    for (let i = 0; i < n; i++) {
        numerator += (i - xMean) * (values[i] - yMean)
        denominator += (i - xMean) ** 2
    }

    const slope = denominator !== 0 ? numerator / denominator : 0
    const intercept = yMean - slope * xMean

    // Predict next month (index n)
    const nextMonthEstimate = Math.max(0, Math.round(intercept + slope * n))

    // Determine trend direction
    let trend = 'stable'
    const avgRevenue = yMean
    const slopePercent = avgRevenue > 0 ? (slope / avgRevenue) * 100 : 0

    if (slopePercent > 5) {
        trend = 'growing'
    } else if (slopePercent < -5) {
        trend = 'declining'
    }

    return {
        slope: Math.round(slope),
        nextMonthEstimate,
        trend,
    }
}

/**
 * Calculate projected profit margin based on trends
 * @param {Array} monthlyRevenue - Array of monthly revenue data
 * @param {Array} monthlyExpenses - Array of monthly expense data
 * @returns {Object} - { projectedRevenue, projectedExpenses, projectedProfit, projectedMargin }
 */
export function projectProfit(monthlyRevenue, monthlyExpenses) {
    const projectedRevenue = movingAverage(monthlyRevenue)
    const projectedExpenses = movingAverage(
        monthlyExpenses.map((d) => ({ ...d, revenue: d.expenses }))
    )

    const projectedProfit = projectedRevenue - projectedExpenses
    const projectedMargin = projectedRevenue > 0
        ? Math.round((projectedProfit / projectedRevenue) * 100)
        : 0

    return {
        projectedRevenue,
        projectedExpenses,
        projectedProfit,
        projectedMargin,
    }
}

/**
 * Generate comprehensive forecast
 * @param {Object} analytics - Analytics data from getDashboardAnalytics
 * @returns {Object} - Complete forecast with explanations
 */
export function generateForecast(analytics) {
    const { monthlyRevenue, monthlyExpenses } = analytics

    const revenueMA = movingAverage(monthlyRevenue)
    const revenueTrend = linearTrend(monthlyRevenue)
    const profitProjection = projectProfit(monthlyRevenue, monthlyExpenses)

    return {
        nextMonthRevenue: {
            estimate: revenueMA,
            method: '3-month moving average',
            confidence: monthlyRevenue.length >= 3 ? 'moderate' : 'low',
        },
        revenueTrend: {
            direction: revenueTrend.trend,
            monthlyChange: revenueTrend.slope,
            trendEstimate: revenueTrend.nextMonthEstimate,
        },
        profitProjection: {
            ...profitProjection,
            note: 'Based on historical expense patterns',
        },
        dataPoints: monthlyRevenue.length,
        disclaimer: 'These are estimates based on historical data. Actual results may vary.',
    }
}

/**
 * Detect potential cash flow issues
 * @param {Object} analytics - Analytics data
 * @returns {Array} - List of warnings
 */
export function detectCashFlowRisks(analytics) {
    const warnings = []
    const {
        pendingPayments,
        monthlyExpenses,
        topClientPercent,
        momGrowth
    } = analytics

    // High pending payments relative to monthly expenses
    const avgMonthlyExpense = monthlyExpenses.length > 0
        ? monthlyExpenses.reduce((sum, m) => sum + m.expenses, 0) / monthlyExpenses.length
        : 0

    if (pendingPayments.total > avgMonthlyExpense * 2) {
        warnings.push({
            type: 'pending_payments',
            severity: 'warning',
            message: `Pending payments (${pendingPayments.count} invoices) exceed 2 months of average expenses.`,
        })
    }

    // High client concentration
    if (topClientPercent > 40) {
        warnings.push({
            type: 'client_concentration',
            severity: 'caution',
            message: `${topClientPercent}% of revenue comes from your top client. Consider diversifying.`,
        })
    }

    // Negative growth trend
    if (momGrowth < -10) {
        warnings.push({
            type: 'declining_revenue',
            severity: 'warning',
            message: `Revenue declined by ${Math.abs(momGrowth)}% compared to last month.`,
        })
    }

    return warnings
}
