/**
 * AI Integration Service
 * Responsible use of AI for decision support, not calculations.
 * AI reads pre-calculated analytics and generates insights.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Generate AI-powered business insights
 * @param {Object} analytics - Pre-calculated analytics data
 * @param {Object} forecast - Forecast data
 * @returns {Object} - AI-generated insights
 */
export async function generateInsights(analytics, forecast) {
    if (!OPENAI_API_KEY) {
        // Return mock insights if no API key
        return generateMockInsights(analytics, forecast)
    }

    const prompt = buildPrompt(analytics, forecast)

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a concise business advisor for freelancers and small teams. 
Provide actionable insights based ONLY on the data provided. 
Never invent data or make assumptions beyond what's given.
Keep responses brief and focused on practical actions.
Format your response as JSON with the following structure:
{
  "summary": "2-3 sentence business health summary",
  "risks": ["array of risk warnings"],
  "opportunities": ["array of opportunity signals"],
  "actions": ["array of 2-3 actionable recommendations"]
}`
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        })

        if (!response.ok) {
            throw new Error('AI API request failed')
        }

        const data = await response.json()
        const content = data.choices[0].message.content

        // Parse JSON response
        try {
            return JSON.parse(content)
        } catch {
            // If JSON parsing fails, return structured mock
            return generateMockInsights(analytics, forecast)
        }
    } catch (error) {
        console.error('AI insights error:', error)
        return generateMockInsights(analytics, forecast)
    }
}

/**
 * Build the prompt for AI based on analytics data
 */
function buildPrompt(analytics, forecast) {
    const {
        totalRevenue,
        totalExpenses,
        profit,
        profitMargin,
        pendingPayments,
        topClients,
        topClientPercent,
        momGrowth,
        monthlyRevenue,
    } = analytics

    const { revenueTrend, profitProjection } = forecast

    return `Analyze this business data and provide insights:

CURRENT METRICS:
- Total Revenue: $${totalRevenue.toLocaleString()}
- Total Expenses: $${totalExpenses.toLocaleString()}
- Net Profit: $${profit.toLocaleString()}
- Profit Margin: ${profitMargin}%
- Pending Payments: $${pendingPayments.total.toLocaleString()} (${pendingPayments.count} invoices)
- Month-over-Month Growth: ${momGrowth}%

CLIENT BREAKDOWN:
- Top Client Contribution: ${topClientPercent}%
- Number of Top Clients: ${topClients.length}

TRENDS:
- Revenue Trend: ${revenueTrend.direction}
- Monthly Change: $${revenueTrend.monthlyChange}
- Projected Next Month Revenue: $${forecast.nextMonthRevenue.estimate.toLocaleString()}
- Projected Profit Margin: ${profitProjection.projectedMargin}%

DATA AVAILABILITY: ${monthlyRevenue.length} months of data

Provide a brief analysis with risks, opportunities, and recommended actions.`
}

/**
 * Generate rule-based insights when AI is unavailable
 */
function generateMockInsights(analytics, forecast) {
    const {
        profitMargin,
        pendingPayments,
        topClientPercent,
        momGrowth,
    } = analytics

    const { revenueTrend, profitProjection } = forecast

    const insights = {
        summary: '',
        risks: [],
        opportunities: [],
        actions: [],
    }

    // Generate summary
    if (profitMargin >= 30) {
        insights.summary = `Your business is performing well with a healthy ${profitMargin}% profit margin. `
    } else if (profitMargin >= 15) {
        insights.summary = `Your business has moderate profitability at ${profitMargin}% margin. `
    } else if (profitMargin > 0) {
        insights.summary = `Your profit margin of ${profitMargin}% is thin. Consider strategies to improve margins. `
    } else {
        insights.summary = `Your business is currently operating at a loss. Immediate attention needed. `
    }

    if (momGrowth > 0) {
        insights.summary += `Revenue grew ${momGrowth}% this month, showing positive momentum.`
    } else if (momGrowth < 0) {
        insights.summary += `Revenue declined ${Math.abs(momGrowth)}% this month.`
    } else {
        insights.summary += `Revenue remained stable compared to last month.`
    }

    // Risks
    if (topClientPercent > 40) {
        insights.risks.push(
            `High client concentration: ${topClientPercent}% of revenue depends on one client, creating business risk.`
        )
    }

    if (pendingPayments.count > 3) {
        insights.risks.push(
            `${pendingPayments.count} pending invoices totaling $${pendingPayments.total.toLocaleString()} may impact cash flow.`
        )
    }

    if (revenueTrend.direction === 'declining') {
        insights.risks.push(
            `Revenue trend is declining. Consider investigating root causes.`
        )
    }

    if (profitMargin < 15) {
        insights.risks.push(
            `Low profit margin limits your ability to invest in growth or handle unexpected expenses.`
        )
    }

    // Opportunities
    if (revenueTrend.direction === 'growing') {
        insights.opportunities.push(
            `Revenue is trending upward. Consider reinvesting in marketing or capacity.`
        )
    }

    if (profitMargin > 30) {
        insights.opportunities.push(
            `Strong margins provide room for strategic investments or competitive pricing.`
        )
    }

    if (topClientPercent < 25 && analytics.topClients.length > 3) {
        insights.opportunities.push(
            `Healthy client diversification reduces business risk and creates stability.`
        )
    }

    // Actions
    if (pendingPayments.count > 0) {
        insights.actions.push(
            `Follow up on ${pendingPayments.count} pending invoice(s) to improve cash flow.`
        )
    }

    if (topClientPercent > 40) {
        insights.actions.push(
            `Actively pursue new clients to reduce dependency on your top client.`
        )
    }

    if (profitMargin < 20) {
        insights.actions.push(
            `Review expenses for potential cost savings or consider adjusting pricing.`
        )
    }

    if (insights.actions.length === 0) {
        insights.actions.push(
            `Continue monitoring your metrics and maintain current performance levels.`
        )
    }

    return insights
}

export default { generateInsights }
