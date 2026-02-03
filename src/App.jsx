import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useBusiness } from './context/BusinessContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Invoices from './pages/Invoices'
import Expenses from './pages/Expenses'
import Insights from './pages/Insights'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Loading component
function LoadingScreen() {
    return (
        <div className="loading-container" style={{ minHeight: '100vh' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
        </div>
    )
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const { hasBusiness, loading: bizLoading } = useBusiness()

    if (authLoading || bizLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!hasBusiness) {
        return <Navigate to="/onboarding" replace />
    }

    return children
}

// Onboarding Route - requires auth but no business
function OnboardingRoute({ children }) {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const { hasBusiness, loading: bizLoading } = useBusiness()

    if (authLoading || bizLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (hasBusiness) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

// Public Route - redirects to dashboard if authenticated
function PublicRoute({ children }) {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const { hasBusiness, loading: bizLoading } = useBusiness()

    if (authLoading) {
        return <LoadingScreen />
    }

    if (isAuthenticated) {
        if (bizLoading) {
            return <LoadingScreen />
        }
        if (hasBusiness) {
            return <Navigate to="/dashboard" replace />
        }
        return <Navigate to="/onboarding" replace />
    }

    return children
}

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Landing />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                }
            />

            {/* Onboarding Route */}
            <Route
                path="/onboarding"
                element={
                    <OnboardingRoute>
                        <Onboarding />
                    </OnboardingRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/clients"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Clients />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/invoices"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Invoices />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/expenses"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Expenses />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/insights"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Insights />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
