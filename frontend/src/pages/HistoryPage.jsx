import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/dashboard.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

function HistoryPage() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await API.get(`/results/${email}`);
            setResults(response.data);
        } catch (error) {
            console.log(error);
            setError(true);
            toast.error("Failed to load exam history. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const totalExams = results.length;

    const averagePercentage =
        totalExams > 0
            ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalExams).toFixed(1)
            : 0;

    const bestPercentage =
        results.length > 0
            ? Math.max(...results.map((r) => r.percentage || 0))
            : 0;

    const passedExams = results.filter((r) => r.percentage >= 40).length;

    const passRate =
        totalExams > 0
            ? Math.round((passedExams / totalExams) * 100)
            : 0;

    const chartData = results.map((r, index) => ({
        exam: `Exam ${index + 1}`,
        percentage: r.percentage,
    }));

    let performanceInsight = "Complete more exams to unlock AI insights.";

    if (results.length >= 2) {
        const latest = results[results.length - 1].percentage;
        const previous = results[results.length - 2].percentage;
        if (latest > previous) {
            performanceInsight = "Your performance is improving consistently 📈";
        } else if (latest < previous) {
            performanceInsight = "Recent performance dropped slightly. More practice is recommended 📚";
        } else {
            performanceInsight = "Your performance is stable across recent exams ⚖️";
        }
    }

    const exportPDF = async () => {
        const input = document.getElementById("history-content");
        if (!input) return;
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("exam-history.pdf");
    };

    return (
        <div className="premium-root min-h-screen" onClick={() => showDropdown && setShowDropdown(false)}>
            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />

            {/* Navbar */}
            <nav className="premium-navbar mx-6 md:mx-12">
                <div className="navbar-logo">
                    <div className="logo-mark">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                    </div>
                    <div className="logo-text-primary">Smart Exam Portal</div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowDropdown(!showDropdown)} className="profile-btn">
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className="profile-dropdown animate-fade-in">
                            <div className="profile-top">
                                <div className="profile-avatar">{firstLetter}</div>
                                <div>
                                    <div className="profile-name">{name}</div>
                                    <div className="profile-role">Student • Online</div>
                                </div>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => navigate('/student-dashboard')}>
                                    <span>🏠</span><span>Dashboard</span>
                                </div>
                                <div className="dropdown-item" onClick={() => navigate('/history')}>
                                    <span>📋</span><span>Exam History</span>
                                </div>
                                <div className="dropdown-divider" />
                                <div className="dropdown-item dropdown-item-danger" onClick={logout}>
                                    <div className="dropdown-item-icon">🚪</div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div id="history-content" className="px-6 md:px-12 py-10 max-w-6xl mx-auto">

                {/* ── Hero ── */}
                <div className="hp-hero mb-10">
                    <div className="hp-hero-glow" />
                    <div className="hp-hero-inner">
                        <div>
                            <span className="hero-accent">Student History</span>
                            <h2 className="hero-title mt-3">Exam History</h2>
                            <p className="hero-sub">All your past exam attempts and results.</p>
                        </div>
                        <div className="hp-hero-counter">
                            <p className="hp-hero-counter-num">{results.length}</p>
                            <p className="hp-hero-counter-label">Exams Taken</p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="hp-stats-grid mb-8">
                    <div className="hp-stat-card">
                        <div className="hp-stat-icon hp-stat-icon-blue">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <p className="hp-stat-label">Average Score</p>
                        <p className="hp-stat-value hp-stat-value-blue">{averagePercentage}%</p>
                    </div>
                    <div className="hp-stat-card">
                        <div className="hp-stat-icon hp-stat-icon-emerald">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <p className="hp-stat-label">Best Score</p>
                        <p className="hp-stat-value hp-stat-value-emerald">{bestPercentage}%</p>
                    </div>
                    <div className="hp-stat-card">
                        <div className="hp-stat-icon hp-stat-icon-purple">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <p className="hp-stat-label">Exams Attempted</p>
                        <p className="hp-stat-value hp-stat-value-purple">{totalExams}</p>
                    </div>
                    <div className="hp-stat-card">
                        <div className="hp-stat-icon hp-stat-icon-amber">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="hp-stat-label">Pass Rate</p>
                        <p className="hp-stat-value hp-stat-value-amber">{passRate}%</p>
                    </div>
                </div>

                {/* ── Performance Chart / Locked ── */}
                {results.length >= 2 ? (
                    <div className="hp-chart-card mb-8">
                        <div className="hp-chart-header">
                            <div>
                                <h3 className="hp-chart-title">Performance Trend</h3>
                                <p className="hp-chart-sub">Track your exam performance over time</p>
                            </div>
                            <span className="hp-analytics-badge">
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Analytics
                            </span>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)" />
                                    <XAxis dataKey="exam" tick={{ fill: "rgba(196,181,253,0.6)", fontSize: 12 }} axisLine={{ stroke: "rgba(167,139,250,0.12)" }} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fill: "rgba(196,181,253,0.6)", fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: "rgba(15,10,35,0.95)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, color: "#f8fafc", fontSize: 13 }}
                                        cursor={{ stroke: "rgba(167,139,250,0.2)" }}
                                    />
                                    <Line type="monotone" dataKey="percentage" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 5, fill: "#a855f7", strokeWidth: 0 }} activeDot={{ r: 7, fill: "#d946ef" }} />
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#d946ef" />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="hp-locked-card mb-8">
                        <div className="hp-locked-icon-wrap">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3 className="hp-locked-title">Performance Trend Locked</h3>
                        <p className="hp-locked-sub">Complete at least 2 exams to unlock advanced analytics and trend tracking.</p>
                    </div>
                )}

                {/* ── AI Insight ── */}
                <div className="hp-insight-card mb-8">
                    <div className="hp-insight-glow" />
                    <div className="hp-insight-inner">
                        <div className="hp-insight-badge">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l1.41 1.42a1 1 0 01-1.42 1.41L4.22 5.64a1 1 0 010-1.42zm12.72 12.72a1 1 0 011.41 0l1.42 1.41a1 1 0 01-1.42 1.42l-1.41-1.42a1 1 0 010-1.41zM2 12a1 1 0 011-1h2a1 1 0 010 2H3a1 1 0 01-1-1zm16 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM4.22 19.78a1 1 0 010-1.41l1.41-1.42a1 1 0 111.42 1.42L5.64 19.78a1 1 0 01-1.42 0zm12.72-12.72a1 1 0 010-1.41l1.41-1.42a1 1 0 111.42 1.42l-1.42 1.41a1 1 0 01-1.41 0zM12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                            AI PERFORMANCE INSIGHT
                        </div>
                        <p className="hp-insight-text">{performanceInsight}</p>
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="hp-toolbar mb-6">
                    <button onClick={() => navigate("/student-dashboard")} className="hp-btn-back">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Dashboard
                    </button>
                    <button onClick={exportPDF} className="premium-btn-primary hp-btn-export">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 8h10" /></svg>
                        Export PDF
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="hp-loading">
                        <div className="hp-spinner" />
                        <p className="hp-loading-text">Loading your history...</p>
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="hp-empty-card">
                        <div className="hp-empty-icon hp-empty-icon-red">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="hp-empty-title">Failed to load history</p>
                        <p className="hp-empty-sub">Something went wrong while fetching your results.</p>
                        <button onClick={fetchHistory} className="premium-btn-primary hp-empty-btn">Try Again</button>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && results.length === 0 && (
                    <div className="hp-empty-card">
                        <div className="hp-empty-icon hp-empty-icon-purple">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <p className="hp-empty-title">No exam history yet</p>
                        <p className="hp-empty-sub">Complete an exam to see your results here.</p>
                        <button onClick={() => navigate("/student-dashboard")} className="premium-btn-primary hp-empty-btn">Browse Exams</button>
                    </div>
                )}

                {/* ── Result Cards ── */}
                {!loading && !error && results.length > 0 && (
                    <div className="hp-results-grid">
                        {results.map((result) => {
                            const passed = result.percentage >= 40;
                            return (
                                <div key={result.id} className={`hp-result-card ${passed ? "hp-result-card-pass" : "hp-result-card-fail"}`}>
                                    <div className={`hp-result-strip ${passed ? "hp-strip-pass" : "hp-strip-fail"}`} />
                                    <div className="hp-result-body">

                                        {/* Header */}
                                        <div className="hp-result-header">
                                            <div className="hp-result-header-left">
                                                <div className={`hp-result-icon ${passed ? "hp-result-icon-pass" : "hp-result-icon-fail"}`}>
                                                    <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <h3 className="hp-result-title">{result.examTitle}</h3>
                                            </div>
                                            <span className={`hp-result-badge ${passed ? "hp-badge-pass" : "hp-badge-fail"}`}>
                                                {passed ? "PASSED" : "FAILED"}
                                            </span>
                                        </div>

                                        {/* Mini stats */}
                                        <div className="hp-mini-stats">
                                            <div className="hp-mini-stat">
                                                <p className="hp-mini-val">{result.score}</p>
                                                <p className="hp-mini-label">Final Marks</p>
                                            </div>
                                            <div className="hp-mini-stat">
                                                <p className="hp-mini-val">
                                                    {Math.round((result.percentage / 100) * result.totalQuestions)}
                                                </p>
                                                <p className="hp-mini-label">Correct</p>
                                            </div>
                                            <div className={`hp-mini-stat ${passed ? "hp-mini-stat-pass" : "hp-mini-stat-fail"}`}>
                                                <p className={`hp-mini-val ${passed ? "hp-mini-val-pass" : "hp-mini-val-fail"}`}>{result.percentage}%</p>
                                                <p className="hp-mini-label">Score</p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="hp-bar-track">
                                            <div
                                                className={`hp-bar-fill ${passed ? "hp-bar-pass" : "hp-bar-fail"}`}
                                                style={{ width: `${result.percentage}%` }}
                                            />
                                        </div>

                                        {/* Date */}
                                        <div className="hp-result-date">
                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {formatDate(result.submittedAt)}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
export default HistoryPage;
