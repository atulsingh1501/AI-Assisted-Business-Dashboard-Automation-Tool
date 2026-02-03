import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Signup() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            // Sign up with Supabase
            const result = await signUp(formData.email, formData.password)

            console.log('Signup result:', result) // Debug log

            // Check if we got a session (email confirmation disabled)
            if (result?.session) {
                // User is signed in immediately - redirect to onboarding
                navigate('/onboarding', { replace: true })
                return
            }

            // Check if user was created but needs email confirmation
            if (result?.user && !result?.session) {
                setSuccess('Account created! Please check your email to confirm your account, then sign in.')
                setFormData({ email: '', password: '', confirmPassword: '' })
                return
            }

            // If we have a user, try to navigate anyway (session might be set via auth state change)
            if (result?.user) {
                // Wait a moment for auth state to update
                setTimeout(() => {
                    navigate('/onboarding', { replace: true })
                }, 500)
                return
            }

            // Fallback - something unexpected
            setError('Account created but could not sign in. Please try logging in.')
        } catch (err) {
            console.error('Signup error:', err)
            setError(err.message || 'Failed to create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <div className="logo-icon">B</div>
                            <span className="logo-text">BizConsole</span>
                        </Link>
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Start managing your business smarter</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                {success}
                                <Link to="/login" className="auth-link" style={{ marginLeft: '8px' }}>
                                    Go to Login →
                                </Link>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <span className="form-hint">At least 6 characters</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">Sign in</Link>
                        </p>
                    </div>
                </div>

                <div className="auth-decoration">
                    <div className="decoration-shape shape-1"></div>
                    <div className="decoration-shape shape-2"></div>
                    <div className="decoration-shape shape-3"></div>
                </div>
            </div>
        </div>
    )
}

export default Signup
