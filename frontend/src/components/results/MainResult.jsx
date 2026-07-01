import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
function MainResult({
    passed,
    percentage,
    studentName,
    correctAnswers,
    wrong,
    totalQuestions,
    navigate,
    ringR,
    ringCirc,
    ringOffset,
    perfLabel,
    perfLabelColor,
    insightStats,
    performanceGradient,
    performanceTitle,
    performanceMessage,
    performanceLevel,
    securityColor,
    securityStatus,
    violations
}) {
    return (
        <div className="premium-root min-h-screen relative overflow-hidden">
            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />

            {/* Navbar */}
            <nav className="premium-navbar exam-topbar mx-6 md:mx-12">
                <div className="navbar-logo">
                    <div className="logo-mark">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                    </div>
                    <div className="logo-text-primary">Smart Exam Portal</div>
                </div>
                <button onClick={() => navigate("/student-dashboard")} className="premium-btn-secondary">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Dashboard
                </button>
            </nav>

            {/* ── 2-column layout ── */}
            <div id="result-report" className="rp-layout">

                {/* ══ LEFT: Result Card ══ */}
                <div className="rp-result-card">
                    <div className={`rp-top-strip ${passed ? "rp-strip-pass" : "rp-strip-fail"}`} />

                    {/* Card header */}
                    <div className={`rp-card-header ${passed ? "rp-card-header-pass" : "rp-card-header-fail"}`}>
                        <span className={`rp-result-badge premium-shine ${passed ? "rp-badge-pass" : "rp-badge-fail"}`}>
                            <span className="rp-badge-icon">{passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}</span>
                            Exam Result
                        </span>
                        <h1 className="rp-card-title">
                            {passed ? "Congratulations!" : "Better Luck Next Time"}
                        </h1>
                        <p className="rp-card-name">{studentName}</p>
                        <p className="rp-card-sub">
                            {passed ? "You have successfully passed the exam." : "You did not meet the passing criteria."}
                        </p>
                    </div>

                    <div className="rp-card-body">
                        {/* Score Ring */}
                        <div className="rp-ring-wrap rp-ring-entrance">
                            {/* Outer glow layer */}
                            <div
                                className="rp-ring-glow-pulse"
                                style={{
                                    background: passed
                                        ? 'radial-gradient(circle, rgba(255,216,107,0.22) 0%, transparent 72%)'
                                        : 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 72%)'
                                }}
                            />

                            <svg
                                className="rp-ring-svg"
                                viewBox="0 0 120 120"
                                style={{
                                    filter: passed
                                        ? 'drop-shadow(0 0 16px rgba(255,216,107,0.40)) drop-shadow(0 0 34px rgba(250,204,21,0.22))'
                                        : 'drop-shadow(0 0 16px rgba(239,68,68,0.45)) drop-shadow(0 0 30px rgba(244,63,94,0.22))'
                                }}
                            >
                                <defs>
                                    <linearGradient id="rpPassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fde68a" />
                                        <stop offset="50%" stopColor="#facc15" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                    <linearGradient id="rpFailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                    </linearGradient>
                                    {/* Glow filter */}
                                    <filter id="rpGlow">
                                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Track ring */}
                                <circle
                                    cx="60" cy="60" r={ringR}
                                    fill="none"
                                    stroke={passed ? 'rgba(255,216,107,0.10)' : 'rgba(239,68,68,0.10)'}
                                    strokeWidth="10"
                                />

                                {/* Soft glow duplicate (blurred) */}
                                <circle
                                    cx="60" cy="60" r={ringR}
                                    fill="none"
                                    stroke={passed ? 'url(#rpPassGrad)' : 'url(#rpFailGrad)'}
                                    strokeWidth="14"
                                    strokeLinecap="round"
                                    strokeDasharray={ringCirc}
                                    strokeDashoffset={ringOffset}
                                    opacity="0.25"
                                    filter="url(#rpGlow)"
                                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                                />

                                {/* Main progress ring */}
                                <circle
                                    cx="60" cy="60" r={ringR}
                                    fill="none"
                                    stroke={passed ? 'url(#rpPassGrad)' : 'url(#rpFailGrad)'}
                                    strokeWidth="11"
                                    strokeLinecap="round"
                                    strokeDasharray={ringCirc}
                                    strokeDashoffset={ringOffset}
                                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                                />
                            </svg>

                            {/* Center content */}
                            <div className="rp-ring-center">
                                <span
                                    className={`rp-ring-pct ${passed ? 'rp-ring-pct-pass' : 'rp-ring-pct-fail'}`}
                                    style={{ transition: 'opacity 0.6s ease 0.3s', opacity: 1 }}
                                >
                                    {percentage}%
                                </span>
                                <span className="rp-ring-label">Score</span>
                                <span
                                    className="rp-ring-perf-label"
                                    style={{
                                        color: perfLabelColor,
                                        transition: 'opacity 0.6s ease 0.6s',
                                        opacity: 1,
                                    }}
                                >
                                    {perfLabel}
                                </span>
                            </div>
                        </div>

                        {/* Mini stats */}
                        <div className="rp-mini-stats">
                            <div className="rp-mini-stat premium-shine">
                                <p className="rp-mini-val rp-mini-val-green">{correctAnswers}</p>
                                <p className="rp-mini-label">Correct</p>
                            </div>
                            <div className="rp-mini-stat">
                                <p className="rp-mini-val rp-mini-val-red">{wrong}</p>
                                <p className="rp-mini-label">Wrong</p>
                            </div>
                            <div className="rp-mini-stat">
                                <p className="rp-mini-val rp-mini-val-gold">{totalQuestions}</p>
                                <p className="rp-mini-label">Total</p>
                            </div>
                        </div>

                        {/* Pass / Fail banner */}
                        <div className={`rp-status-banner premium-shine ${passed ? "rp-status-pass" : "rp-status-fail"}`}>
                            <span className="rp-status-icon">{passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</span>
                            <span className="rp-status-text">{passed ? "Passed" : "Failed"}</span>
                        </div>

                        <button onClick={() => navigate("/student-dashboard")} className="premium-btn-secondary">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>

                {/* ══ RIGHT: Insights ══ */}
                <div className="rp-insights-col">
                    {/* Insights header */}
                    <div className={`rp-insights-hero ${passed ? "rp-insights-hero-pass" : "rp-insights-hero-fail"}`}>
                        <div className="rp-insights-hero-glow" />
                        <div className="rp-insights-hero-inner">
                            <p className="rp-insights-eyebrow">Performance Summary</p>
                            <h2 className="rp-insights-title">Exam Insights</h2>
                            <p className="rp-insights-sub">
                                {passed
                                    ? "Great performance! Review your results below."
                                    : "Analyze your results and prepare better next time."}
                            </p>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="rp-stat-grid">
                        {insightStats.map((stat) => (
                            <div key={stat.label} className="activity-violation-card premium-shine rp-stat-card">
                                <div className="rp-stat-top">
                                    <div className={`rp-stat-icon ${stat.color}`}>{stat.icon}</div>
                                    <span className={`rp-stat-value ${stat.color}`}>{stat.value}</span>
                                </div>
                                <p className="rp-stat-label">{stat.label}</p>
                                <div className="rp-bar-track">
                                    <div className={`rp-bar-fill ${stat.bar}`} style={{ width: `${stat.barWidth}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Smart Performance Card */}
                    <div className="rp-perf-card premium-shine">
                        <div className={`rp-perf-strip bg-gradient-to-r ${performanceGradient}`} />

                        <div className="rp-perf-header">
                            <div>
                                <h3 className="rp-perf-title">{performanceTitle}</h3>
                                <p className="rp-perf-msg">{performanceMessage}</p>
                            </div>
                            <span className={`rp-perf-level bg-gradient-to-r ${performanceGradient}`}>
                                {performanceLevel}
                            </span>
                        </div>

                        {/* AI Proctoring */}
                        <div className="rp-proctor-box">
                            <div className="rp-proctor-header">
                                <h4 className="rp-proctor-title">AI Proctoring Summary</h4>
                                <span className={`rp-proctor-status ${securityColor}`}>{securityStatus}</span>
                            </div>
                            <div className="rp-proctor-grid">
                                <div className="rp-proctor-stat">
                                    <p className="rp-proctor-stat-label">Violations</p>
                                    <p className="rp-proctor-stat-val">{violations}</p>
                                </div>
                                <div className="rp-proctor-stat">
                                    <p className="rp-proctor-stat-label">Face Status</p>
                                    <p className="rp-proctor-stat-val rp-face-verified">Verified</p>
                                </div>
                            </div>
                        </div>

                        {/* Exam status */}
                        <div className="rp-exam-status-box">
                            <p className="rp-exam-status-label">Exam Status</p>
                            <p className={`rp-exam-status-val ${passed ? "rp-status-val-pass" : "rp-status-val-fail"}`}>
                                {passed ? "PASSED" : "FAILED"}
                            </p>
                        </div>
                    </div>

                    {/* Passing criteria note */}
                    <div className="rp-criteria-note premium-shine">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="rp-criteria-text">Passing criteria: 40% and above</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainResult;