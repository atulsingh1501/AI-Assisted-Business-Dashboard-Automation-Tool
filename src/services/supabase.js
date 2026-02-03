import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase credentials not found. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    )
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Auth helpers
export const auth = {
    signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
        return data
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    getSession: async () => {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data.session
    },

    getUser: async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        return data.user
    },

    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback)
    },
}

// Database helpers
export const db = {
    // Businesses
    getBusiness: async (userId) => {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('user_id', userId)
            .single()
        if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
        return data
    },

    createBusiness: async (business) => {
        const { data, error } = await supabase
            .from('businesses')
            .insert(business)
            .select()
            .single()
        if (error) throw error
        return data
    },

    updateBusiness: async (id, updates) => {
        const { data, error } = await supabase
            .from('businesses')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    // Check if user has a business (returns boolean)
    checkBusiness: async (userId) => {
        const { data, error } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', userId)
            .single()
        if (error && error.code !== 'PGRST116') throw error
        return !!data
    },


    // Clients
    getClients: async (businessId) => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data
    },

    getClient: async (id) => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    createClient: async (client) => {
        const { data, error } = await supabase
            .from('clients')
            .insert(client)
            .select()
            .single()
        if (error) throw error
        return data
    },

    updateClient: async (id, updates) => {
        const { data, error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    deleteClient: async (id) => {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
        if (error) throw error
    },

    // Invoices
    getInvoices: async (businessId) => {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        client:clients(id, name, company)
      `)
            .eq('business_id', businessId)
            .order('issue_date', { ascending: false })
        if (error) throw error
        return data
    },

    getInvoice: async (id) => {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        client:clients(id, name, company, email)
      `)
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    createInvoice: async (invoice) => {
        const { data, error } = await supabase
            .from('invoices')
            .insert(invoice)
            .select()
            .single()
        if (error) throw error
        return data
    },

    updateInvoice: async (id, updates) => {
        const { data, error } = await supabase
            .from('invoices')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    deleteInvoice: async (id) => {
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id)
        if (error) throw error
    },

    markInvoicePaid: async (id) => {
        const { data, error } = await supabase
            .from('invoices')
            .update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0] })
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    // Expenses
    getExpenses: async (businessId) => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('business_id', businessId)
            .order('expense_date', { ascending: false })
        if (error) throw error
        return data
    },

    getExpense: async (id) => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    createExpense: async (expense) => {
        const { data, error } = await supabase
            .from('expenses')
            .insert(expense)
            .select()
            .single()
        if (error) throw error
        return data
    },

    updateExpense: async (id, updates) => {
        const { data, error } = await supabase
            .from('expenses')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    deleteExpense: async (id) => {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)
        if (error) throw error
    },
}

export default supabase
