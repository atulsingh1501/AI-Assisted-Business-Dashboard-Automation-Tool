import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="nav-logo">
                            <div className="logo-icon">B</div>
                            <span className="logo-text">BizConsole</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/login" className="btn btn-ghost">Log In</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge badge-info">✨ AI-Powered Business Insights</span>
                        </div>
                        <h1 className="hero-title">
                            Run Your Business<br />
                            <span className="gradient-text">Smarter, Not Harder</span>
                        </h1>
                        <p className="hero-subtitle">
                            A lightweight operations console for freelancers and small teams.
                            Track clients, monitor revenue, and get AI-driven insights to make better decisions.
                        </p>
                        <div className="hero-cta">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Start Free Trial
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                Sign In
                            </Link>
                        </div>
                        <p className="hero-note">No credit card required • Free tier available</p>
                    </div>

                    {/* Hero Visual */}
                    <div className="hero-visual">
                        <div className="dashboard-preview">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            <div className="preview-content">
                                <div className="preview-kpi">
                                    <div className="kpi-item">
                                        <span className="kpi-label">Revenue</span>
                                        <span className="kpi-value">$24,580</span>
                                        <span className="kpi-trend positive">+12.5%</span>
                                    </div>
                                    <div className="kpi-item">
                                        <span className="kpi-label">Profit</span>
                                        <span className="kpi-value">$18,420</span>
                                        <span className="kpi-trend positive">+8.3%</span>
                                    </div>
                                    <div className="kpi-item">
                                        <span className="kpi-label">Pending</span>
                                        <span className="kpi-value">$4,200</span>
                                        <span className="kpi-trend neutral">3 invoices</span>
                                    </div>
                                </div>
                                <div className="preview-chart">
                                    <div className="chart-bars">
                                        <div className="bar" style={{ height: '40%' }}></div>
                                        <div className="bar" style={{ height: '60%' }}></div>
                                        <div className="bar" style={{ height: '45%' }}></div>
                                        <div className="bar" style={{ height: '70%' }}></div>
                                        <div className="bar" style={{ height: '85%' }}></div>
                                        <div className="bar" style={{ height: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything You Need to Grow</h2>
                        <p className="section-subtitle">
                            Powerful features designed for freelancers and small teams
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Client Management</h3>
                            <p className="feature-desc">
                                Keep all your client information organized. Track contacts, projects, and payment history in one place.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Invoice Tracking</h3>
                            <p className="feature-desc">
                                Create and manage invoices effortlessly. Track payment status and never miss a follow-up again.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Expense Tracking</h3>
                            <p className="feature-desc">
                                Monitor where your money goes. Categorize expenses and understand your true profit margins.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Real-Time Analytics</h3>
                            <p className="feature-desc">
                                Instant visibility into your business health. Revenue, profit, growth trends — all at a glance.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Smart Forecasting</h3>
                            <p className="feature-desc">
                                Predict your next month's revenue based on historical trends. Plan ahead with confidence.
                            </p>
                        </div>

                        <div className="feature-card featured">
                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)', color: 'white' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">AI-Powered Insights</h3>
                            <p className="feature-desc">
                                Get actionable recommendations tailored to your business. Spot risks and opportunities before they become problems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Take Control?</h2>
                        <p className="cta-text">
                            Join thousands of freelancers and small teams who manage their business smarter.
                        </p>
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="nav-logo">
                                <div className="logo-icon">B</div>
                                <span className="logo-text">BizConsole</span>
                            </div>
                            <p className="footer-tagline">AI-powered business operations for modern teams.</p>
                        </div>
                        <div className="footer-links">
                            <p className="footer-copy">© 2024 BizConsole. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
