import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Check current session on mount
        const checkSession = async () => {
            try {
                const session = await auth.getSession()
                setUser(session?.user || null)
            } catch (err) {
                console.error('Error checking session:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Listen for auth state changes
        const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            setLoading(false)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const signUp = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const data = await auth.signUp(email, password)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const data = await auth.signIn(email, password)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        setLoading(true)
        setError(null)
        try {
            await auth.signOut()
            setUser(null)
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
