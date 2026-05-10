import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/dashboard.css";

function ResultPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const score = location.state?.score || 0;
    const totalQuestions = location.state?.totalQuestions || 0;
    const correctAnswers = location.state?.correctAnswers ?? score;
    const wrong = location.state?.wrongAnswers ?? Math.max(0, totalQuestions - correctAnswers);
    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    const passed = percentage >= 40;
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const studentName = localStorage.getItem("name") || "Student";
    const examTitle = location.state?.examTitle || "Exam";
    const timeTaken = location.state?.timeTaken || "5 min";
    const reviewQuestions = location.state?.questions || [];
    const reviewAnswers = location.state?.answers || {};
    const violations = location.state?.violations || 0;

    const [showReview, setShowReview] = useState(false);

    let performanceTitle = "";
    let performanceMessage = "";
    let performanceLevel = "";
    let performanceGradient = "";

    const securityStatus =
        violations === 0 ? "Excellent"
        : violations === 1 ? "Minor Violations"
        : "High Risk";

    const securityColor =
        violations === 0 ? "rp-sec-green"
        : violations === 1 ? "rp-sec-amber"
        : "rp-sec-red";

    if (percentage >= 85) {
        performanceTitle = "Outstanding Performance 🚀";
        performanceMessage = "Exceptional work! You demonstrated excellent subject mastery and consistency throughout the exam.";
        performanceLevel = "Elite";
        performanceGradient = "from-emerald-500 to-green-600";
    } else if (percentage >= 70) {
        performanceTitle = "Great Job 👏";
        performanceMessage = "Strong performance with impressive accuracy and consistency.";
        performanceLevel = "Advanced";
        performanceGradient = "from-blue-500 to-indigo-600";
    } else if (percentage >= 40) {
        performanceTitle = "Good Effort 👍";
        performanceMessage = "You passed successfully. Continue practicing to further improve your performance.";
        performanceLevel = "Intermediate";
        performanceGradient = "from-amber-400 to-orange-500";
    } else {
        performanceTitle = "Needs Improvement 📚";
        performanceMessage = "Review weak topics and try again with confidence.";
        performanceLevel = "Beginner";
        performanceGradient = "from-red-500 to-pink-600";
    }

    const insightStats = [
        {
            label: "Accuracy",
            value: `${percentage}%`,
            icon: (
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: "rp-stat-blue",
            bar: "rp-bar-blue",
            barWidth: parseFloat(percentage),
        },
        {
            label: "Time Taken",
            value: timeTaken,
            icon: "⏱",
            color: "rp-stat-purple",
            bar: "rp-bar-purple",
            barWidth: 100,
        },
    ];

    const exportPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;
        const wrongAnswers = wrong;
        pdf.setFontSize(22);
        pdf.setTextColor(37, 99, 235);
        pdf.text("SMART EXAM PORTAL", centerX, 20, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Exam Performance Report", centerX, 32, { align: "center" });
        pdf.setDrawColor(220);
        pdf.line(20, 38, 190, 38);
        pdf.setFontSize(12);
        let y = 55;
        const rows = [
            ["Student Name", studentName],
            ["Exam Title", examTitle],
            ["Score", `${score}`],
            ["Correct Answers", `${correctAnswers}`],
            ["Wrong Answers", `${wrongAnswers}`],
            ["Percentage", `${percentage}%`],
            ["Accuracy", `${percentage}%`],
            ["Result", passed ? "PASSED" : "FAILED"],
            ["Time Taken", timeTaken]
        ];
        rows.forEach((row) => {
            pdf.setFont(undefined, "bold");
            pdf.text(`${row[0]} :`, 25, y);
            pdf.setFont(undefined, "normal");
            pdf.text(`${row[1]}`, 85, y);
            y += 12;
        });
        y += 10;
        pdf.setDrawColor(230);
        pdf.rect(20, y, 170, 30);
        pdf.setFontSize(14);
        pdf.setTextColor(passed ? 22 : 220, passed ? 163 : 38, passed ? 74 : 38);
        pdf.text(
            passed ? "Congratulations! You passed the exam." : "You did not pass the exam.",
            centerX, y + 18, { align: "center" }
        );
        pdf.setFontSize(10);
        pdf.setTextColor(120);
        pdf.text(`Generated on ${new Date().toLocaleString()}`, centerX, 285, { align: "center" });
        pdf.save(`${examTitle}-report.pdf`);
    };

    const downloadCertificate = () => {
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(2);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        pdf.setFontSize(30);
        pdf.setTextColor(37, 99, 235);
        pdf.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 40, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(80);
        pdf.text("This certificate is proudly presented to", pageWidth / 2, 65, { align: "center" });
        pdf.setFontSize(28);
        pdf.setTextColor(0);
        pdf.text(studentName, pageWidth / 2, 90, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(80);
        pdf.text(`for successfully passing the "${examTitle}" examination`, pageWidth / 2, 115, { align: "center" });
        pdf.text(`with an excellent score of ${percentage}%`, pageWidth / 2, 130, { align: "center" });
        pdf.setFontSize(12);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 30, 175);
        pdf.text("Smart Exam Portal", pageWidth - 60, 175);
        pdf.line(pageWidth - 70, 165, pageWidth - 25, 165);
        pdf.save(`${studentName}-certificate.pdf`);
    };

    return (
        <div className="premium-root min-h-screen relative overflow-hidden">
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
                <button onClick={() => navigate("/student-dashboard")} className="lb-nav-back">
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
                        <span className={`rp-result-badge ${passed ? "rp-badge-pass" : "rp-badge-fail"}`}>
                            <span>{passed ? "✦" : "✕"}</span>
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
                        <div className="rp-ring-wrap">
                            <svg className="rp-ring-svg" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none"
                                    stroke={passed ? "rgba(99,102,241,0.12)" : "rgba(239,68,68,0.12)"}
                                    strokeWidth="10" />
                                <circle cx="60" cy="60" r="50" fill="none"
                                    stroke={passed ? "url(#rpPassGrad)" : "url(#rpFailGrad)"}
                                    strokeWidth="11"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 50}
                                    strokeDashoffset={2 * Math.PI * 50 - (percentage / 100) * (2 * Math.PI * 50)}
                                    style={{ transition: "stroke-dashoffset 1s ease" }}
                                />
                                <defs>
                                    <linearGradient id="rpPassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                    <linearGradient id="rpFailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="rp-ring-center">
                                <span className={`rp-ring-pct ${passed ? "rp-ring-pct-pass" : "rp-ring-pct-fail"}`}>
                                    {percentage}%
                                </span>
                                <span className="rp-ring-label">Final Score</span>
                            </div>
                        </div>

                        {/* Mini stats */}
                        <div className="rp-mini-stats">
                            <div className="rp-mini-stat">
                                <p className="rp-mini-val rp-mini-val-green">{correctAnswers}</p>
                                <p className="rp-mini-label">Correct</p>
                            </div>
                            <div className="rp-mini-stat">
                                <p className="rp-mini-val rp-mini-val-red">{wrong}</p>
                                <p className="rp-mini-label">Wrong</p>
                            </div>
                            <div className="rp-mini-stat">
                                <p className="rp-mini-val">{totalQuestions}</p>
                                <p className="rp-mini-label">Total</p>
                            </div>
                        </div>

                        {/* Pass / Fail banner */}
                        <div className={`rp-status-banner ${passed ? "rp-status-pass" : "rp-status-fail"}`}>
                            <span className="rp-status-icon">{passed ? "✓" : "✕"}</span>
                            <span className="rp-status-text">{passed ? "Passed" : "Failed"}</span>
                        </div>

                        {/* Buttons */}
                        <button onClick={exportPDF} className="premium-btn-secondary rp-btn-full">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16" />
                            </svg>
                            Download PDF Report
                        </button>

                        {passed && (
                            <button onClick={downloadCertificate} className="premium-btn-primary rp-btn-full">
                                🏆 Download Certificate
                            </button>
                        )}

                        <button onClick={() => navigate("/student-dashboard")} className="premium-btn-primary rp-btn-full">
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Dashboard
                        </button>

                        <button onClick={() => setShowReview(!showReview)} className="rp-btn-review">
                            {showReview ? "Hide Answer Review" : "Review Answers"}
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
                            <div key={stat.label} className="rp-stat-card">
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
                    <div className="rp-perf-card">
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
                    <div className="rp-criteria-note">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="rp-criteria-text">Passing criteria: 40% and above</p>
                    </div>

                </div>
            </div>

            {/* ── Answer Review ── */}
            {showReview && (
                <div className="rp-review-wrap">
                    <div className="rp-review-header">
                        <h3 className="rp-review-title">Answer Review</h3>
                        <span className="rp-review-count">{reviewQuestions.length} Questions</span>
                    </div>

                    <div className="rp-review-list">
                        {reviewQuestions.map((q, index) => {
                            const selected = reviewAnswers[q.id];
                            const correct = q.correctAnswer;
                            return (
                                <div key={q.id} className="rp-question-card">
                                    <div className="rp-question-header">
                                        <div className="rp-q-num">{index + 1}</div>
                                        <h4 className="rp-q-text">{q.questionText}</h4>
                                    </div>
                                    <div className="rp-options-list">
                                        {[q.optionA, q.optionB, q.optionC, q.optionD].map((option, i) => {
                                            const optionKey = ["A", "B", "C", "D"][i];
                                            const isCorrect = optionKey === correct;
                                            const isSelected = optionKey === selected;
                                            return (
                                                <div key={i} className={`rp-option ${isCorrect ? "rp-option-correct" : isSelected ? "rp-option-wrong" : "rp-option-neutral"}`}>
                                                    <div className="rp-option-left">
                                                        <div className={`rp-option-key ${isCorrect ? "rp-key-correct" : isSelected ? "rp-key-wrong" : "rp-key-neutral"}`}>
                                                            {optionKey}
                                                        </div>
                                                        <span className="rp-option-text">{option}</span>
                                                    </div>
                                                    <div className="rp-option-tag">
                                                        {isCorrect && <span className="rp-tag-correct">Correct</span>}
                                                        {!isCorrect && isSelected && <span className="rp-tag-wrong">Your Answer</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ResultPage;
