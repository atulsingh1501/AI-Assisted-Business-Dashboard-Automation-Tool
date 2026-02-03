import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBusiness } from '../context/BusinessContext'
import './Onboarding.css'

const BUSINESS_TYPES = [
    { id: 'freelancer', label: 'Freelancer', icon: '👤', desc: 'Independent professional' },
    { id: 'small_team', label: 'Small Team', icon: '👥', desc: '2-10 people' },
    { id: 'startup', label: 'Startup', icon: '🚀', desc: 'Growing business' },
]

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
]

const COUNTRIES = [
    'United States', 'United Kingdom', 'India', 'Canada', 'Australia',
    'Germany', 'France', 'Netherlands', 'Singapore', 'Other'
]

function Onboarding() {
    const navigate = useNavigate()
    const { createBusiness } = useBusiness()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        currency: 'USD',
        country: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleNext = () => {
        if (step === 1 && !formData.name.trim()) {
            setError('Please enter your business name')
            return
        }
        if (step === 2 && !formData.type) {
            setError('Please select a business type')
            return
        }
        setError('')
        setStep(step + 1)
    }

    const handleBack = () => {
        setError('')
        setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!formData.country) {
            setError('Please select your country')
            return
        }

        setLoading(true)
        setError('')

        try {
            await createBusiness({
                name: formData.name.trim(),
                type: formData.type,
                currency: formData.currency,
                country: formData.country,
            })
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Failed to create business. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                <div className="onboarding-header">
                    <div className="logo-icon">B</div>
                    <h1>Let's set up your business</h1>
                    <p>We'll have you up and running in just a few steps</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Name</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Type</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span>Details</span>
                    </div>
                </div>

                {error && (
                    <div className="onboarding-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Step 1: Business Name */}
                {step === 1 && (
                    <div className="onboarding-step animate-fade-in">
                        <h2>What's your business called?</h2>
                        <p>This is how you'll identify your workspace</p>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input form-input-lg"
                                placeholder="e.g., Acme Freelancing"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                autoFocus
                            />
                        </div>

                        <div className="onboarding-actions">
                            <button onClick={handleNext} className="btn btn-primary btn-lg">
                                Continue
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Business Type */}
                {step === 2 && (
                    <div className="onboarding-step animate-fade-in">
                        <h2>What type of business is this?</h2>
                        <p>This helps us tailor your experience</p>

                        <div className="type-options">
                            {BUSINESS_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    className={`type-option ${formData.type === type.id ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, type: type.id })}
                                >
                                    <span className="type-icon">{type.icon}</span>
                                    <span className="type-label">{type.label}</span>
                                    <span className="type-desc">{type.desc}</span>
                                </button>
                            ))}
                        </div>

                        <div className="onboarding-actions">
                            <button onClick={handleBack} className="btn btn-ghost btn-lg">
                                Back
                            </button>
                            <button onClick={handleNext} className="btn btn-primary btn-lg">
                                Continue
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Currency & Country */}
                {step === 3 && (
                    <div className="onboarding-step animate-fade-in">
                        <h2>One last thing...</h2>
                        <p>Set your currency and location</p>

                        <div className="details-form">
                            <div className="form-group">
                                <label className="form-label">Currency</label>
                                <select
                                    className="form-select"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.symbol} {currency.code} - {currency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <select
                                    className="form-select"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                >
                                    <option value="">Select your country</option>
                                    {COUNTRIES.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="onboarding-actions">
                            <button onClick={handleBack} className="btn btn-ghost btn-lg">
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Launch Dashboard
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Onboarding
