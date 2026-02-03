import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../services/supabase'
import { useAuth } from './AuthContext'

const BusinessContext = createContext(null)

export function BusinessProvider({ children }) {
    const { user, isAuthenticated } = useAuth()
    const [business, setBusiness] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setBusiness(null)
            setLoading(false)
            return
        }

        const fetchBusiness = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await db.getBusiness(user.id)
                setBusiness(data)
            } catch (err) {
                console.error('Error fetching business:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBusiness()
    }, [user, isAuthenticated])

    const createBusiness = async (businessData) => {
        if (!user) throw new Error('User not authenticated')

        setLoading(true)
        setError(null)
        try {
            const newBusiness = await db.createBusiness({
                ...businessData,
                user_id: user.id,
            })
            setBusiness(newBusiness)
            return newBusiness
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateBusiness = async (updates) => {
        if (!business) throw new Error('No business to update')

        setLoading(true)
        setError(null)
        try {
            const updatedBusiness = await db.updateBusiness(business.id, updates)
            setBusiness(updatedBusiness)
            return updatedBusiness
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const refreshBusiness = async () => {
        if (!user) return

        setLoading(true)
        try {
            const data = await db.getBusiness(user.id)
            setBusiness(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const value = {
        business,
        loading,
        error,
        createBusiness,
        updateBusiness,
        refreshBusiness,
        hasBusiness: !!business,
    }

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    )
}

export function useBusiness() {
    const context = useContext(BusinessContext)
    if (!context) {
        throw new Error('useBusiness must be used within a BusinessProvider')
    }
    return context
}

export default BusinessContext
