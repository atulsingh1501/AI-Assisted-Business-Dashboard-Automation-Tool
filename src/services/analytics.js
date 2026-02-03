import { supabase } from './supabase'
import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns'

/**
 * Analytics Engine
 * All calculations are deterministic and based on actual stored data.
 * No AI involvement in these calculations.
 */

// Get total revenue (sum of paid invoices)
export async function getTotalRevenue(businessId) {
    const { data, error } = await supabase
        .from('invoices')
        .select('amount')
        .eq('business_id', businessId)
        .eq('status', 'paid')

    if (error) throw error
    return data.reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
}

// Get total expenses
export async function getTotalExpenses(businessId) {
    const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('business_id', businessId)

    if (error) throw error
    return data.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
}

// Get pending payments (unpaid invoices)
export async function getPendingPayments(businessId) {
    const { data, error } = await supabase
        .from('invoices')
        .select('amount')
        .eq('business_id', businessId)
        .eq('status', 'pending')

    if (error) throw error
    return {
        total: data.reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
        count: data.length,
    }
}

// Get monthly revenue for the last N months
export async function getMonthlyRevenue(businessId, months = 6) {
    const results = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
        const monthDate = subMonths(now, i)
        const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd')
        const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd')

        const { data, error } = await supabase
            .from('invoices')
            .select('amount')
            .eq('business_id', businessId)
            .eq('status', 'paid')
            .gte('paid_date', monthStart)
            .lte('paid_date', monthEnd)

        if (error) throw error

        results.push({
            month: format(monthDate, 'MMM'),
            fullMonth: format(monthDate, 'MMMM yyyy'),
            revenue: data.reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
        })
    }

    return results
}

// Get monthly expenses for the last N months
export async function getMonthlyExpenses(businessId, months = 6) {
    const results = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
        const monthDate = subMonths(now, i)
        const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd')
        const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd')

        const { data, error } = await supabase
            .from('expenses')
            .select('amount')
            .eq('business_id', businessId)
            .gte('expense_date', monthStart)
            .lte('expense_date', monthEnd)

        if (error) throw error

        results.push({
            month: format(monthDate, 'MMM'),
            fullMonth: format(monthDate, 'MMMM yyyy'),
            expenses: data.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
        })
    }

    return results
}

// Get top clients by revenue
export async function getTopClients(businessId, limit = 5) {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
      amount,
      client:clients(id, name, company)
    `)
        .eq('business_id', businessId)
        .eq('status', 'paid')

    if (error) throw error

    // Aggregate by client
    const clientRevenue = {}
    data.forEach((inv) => {
        if (inv.client) {
            const clientId = inv.client.id
            if (!clientRevenue[clientId]) {
                clientRevenue[clientId] = {
                    id: clientId,
                    name: inv.client.name,
                    company: inv.client.company,
                    revenue: 0,
                }
            }
            clientRevenue[clientId].revenue += parseFloat(inv.amount)
        }
    })

    // Sort by revenue and get top N
    const sorted = Object.values(clientRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)

    // Calculate total for percentages
    const totalRevenue = sorted.reduce((sum, c) => sum + c.revenue, 0)

    return sorted.map((c) => ({
        ...c,
        percentage: totalRevenue > 0 ? Math.round((c.revenue / totalRevenue) * 100) : 0,
    }))
}

// Get recent invoices
export async function getRecentInvoices(businessId, limit = 5) {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
      *,
      client:clients(id, name, company)
    `)
        .eq('business_id', businessId)
        .order('issue_date', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data
}

// Calculate month-over-month growth
export async function getMoMGrowth(businessId) {
    const now = new Date()
    const thisMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
    const thisMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')
    const lastMonth = subMonths(now, 1)
    const lastMonthStart = format(startOfMonth(lastMonth), 'yyyy-MM-dd')
    const lastMonthEnd = format(endOfMonth(lastMonth), 'yyyy-MM-dd')

    // This month's revenue
    const { data: thisMonthData, error: e1 } = await supabase
        .from('invoices')
        .select('amount')
        .eq('business_id', businessId)
        .eq('status', 'paid')
        .gte('paid_date', thisMonthStart)
        .lte('paid_date', thisMonthEnd)

    if (e1) throw e1

    // Last month's revenue
    const { data: lastMonthData, error: e2 } = await supabase
        .from('invoices')
        .select('amount')
        .eq('business_id', businessId)
        .eq('status', 'paid')
        .gte('paid_date', lastMonthStart)
        .lte('paid_date', lastMonthEnd)

    if (e2) throw e2

    const thisMonthRevenue = thisMonthData.reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
    const lastMonthRevenue = lastMonthData.reduce((sum, inv) => sum + parseFloat(inv.amount), 0)

    if (lastMonthRevenue === 0) {
        return thisMonthRevenue > 0 ? 100 : 0
    }

    return Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
}

// Get expense breakdown by category
export async function getExpensesByCategory(businessId) {
    const { data, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('business_id', businessId)

    if (error) throw error

    const categories = {}
    data.forEach((exp) => {
        const cat = exp.category || 'Other'
        if (!categories[cat]) {
            categories[cat] = 0
        }
        categories[cat] += parseFloat(exp.amount)
    })

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0)

    return Object.entries(categories)
        .map(([name, amount]) => ({
            name,
            amount,
            percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
}

// Get complete dashboard analytics
export async function getDashboardAnalytics(businessId) {
    try {
        const [
            totalRevenue,
            totalExpenses,
            pendingPayments,
            monthlyRevenue,
            monthlyExpenses,
            topClients,
            recentInvoices,
            momGrowth,
            expensesByCategory,
        ] = await Promise.all([
            getTotalRevenue(businessId),
            getTotalExpenses(businessId),
            getPendingPayments(businessId),
            getMonthlyRevenue(businessId, 6),
            getMonthlyExpenses(businessId, 6),
            getTopClients(businessId, 5),
            getRecentInvoices(businessId, 5),
            getMoMGrowth(businessId),
            getExpensesByCategory(businessId),
        ])

        const profit = totalRevenue - totalExpenses
        const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0

        // Calculate top client concentration (risk indicator)
        const topClientPercent = topClients.length > 0 ? topClients[0].percentage : 0

        return {
            totalRevenue,
            totalExpenses,
            profit,
            profitMargin,
            pendingPayments,
            monthlyRevenue,
            monthlyExpenses,
            topClients,
            topClientPercent,
            recentInvoices,
            momGrowth,
            expensesByCategory,
        }
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error)
        throw error
    }
}
