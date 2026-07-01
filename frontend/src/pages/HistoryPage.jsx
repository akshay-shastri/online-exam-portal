import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/history.css";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import PremiumCertificate from "../components/PremiumCertificate";
import ReactDOM from "react-dom/client";
import { ShieldCheck,LayoutDashboard,  History, LogOut, BarChart3,  Sparkles,  ArrowLeft,  Download,  TriangleAlert,  FileText,  CalendarDays,  Trophy } from "lucide-react";
import { LineChart, Line, XAxis,  YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from "recharts";

function HistoryPage() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await API.get(`/results/${email}`);
            console.log(response.data);
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

    const averagePercentage = totalExams > 0 ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalExams).toFixed(1) : 0;

    const bestPercentage = results.length > 0 ? Math.max(...results.map((r) => r.percentage || 0)): 0;

    const passedExams = results.filter((r) => r.percentage >= 40).length;

    const passRate = totalExams > 0   ? Math.round((passedExams / totalExams) * 100) : 0;

    const chartData = results.map((r, index) => ({ exam: `Exam ${index + 1}`, percentage: r.percentage, }));

    const filteredResults = results.filter((result) => {

    const matchesSearch = result.examTitle  .toLowerCase() .includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "ALL" || result.examType === typeFilter;

    return matchesSearch && matchesType;
    });


    const practiceResults = filteredResults.filter( r => r.examType === "PRACTICE");

    const mockResults =  filteredResults.filter(  r => r.examType === "MOCK"  );

    const mainResults = filteredResults.filter(    r => r.examType === "MAIN" );


    let performanceInsight = "Complete more exams to unlock AI insights.";

    if (results.length >= 2) {
        const latest = results[results.length - 1].percentage;
        const previous = results[results.length - 2].percentage;
        if (latest > previous) {
            performanceInsight = "Your performance is improving consistently";
        } else if (latest < previous) {
            performanceInsight = "Recent performance dropped slightly. More practice is recommended";
        } else {
            performanceInsight = "Your performance is stable across recent exams";
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

    const downloadCertificate = async (result) => {

    const element = document.createElement("div");

    element.style.position = "fixed";
    element.style.left = "-9999px";
    element.style.top = "0";

    document.body.appendChild(element);

    const root = ReactDOM.createRoot(element);

    root.render(<PremiumCertificate result={result} userName={name}  /> );

    await new Promise(resolve =>
    setTimeout(resolve, 300)
    );

    const canvas = await html2canvas(element.firstChild, {

    scale: 3,useCORS: true,  backgroundColor:null,width: 1123,height: 794,windowWidth: 1123,windowHeight: 794,});

    const imgData = canvas.toDataURL("image/png");

    const pdf =  new jsPDF("landscape", "mm", "a4");

    const pdfWidth =  pdf.internal.pageSize.getWidth();

    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); pdf.save(`${result.examTitle}-certificate.pdf`); root.unmount(); document.body.removeChild(element); };
  

    const renderResultCard = (result) => {

    const passed = result.percentage >= 40;

    return (
        <div
            key={result.id}
            className={`history-result-card premium-shine ${
                passed ? "history-result-pass" : "history-result-fail"
            }`}
        >
            <div className={`hp-result-strip ${passed ? "hp-strip-pass" : "hp-strip-fail"}`} />
            <div className="hp-result-body">

                <div className="hp-result-header">
                    <div className="hp-result-header-left">
                        <div className={`hp-result-icon ${passed ? "hp-result-icon-pass" : "hp-result-icon-fail"}`}>
                            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="hp-result-title">{result.examTitle}</h3>
                    </div>

                    <span className={`hp-result-badge ${passed ? "hp-badge-pass" : "hp-badge-fail"}`}>
                        {passed ? "PASSED" : "FAILED"}
                    </span>
                </div>

                <div className="hp-mini-stats">
                    <div className="hp-mini-stat">
                        <p className="hp-mini-val">{result.score}</p>
                        <p className="hp-mini-label">Final Marks</p>
                    </div>

                    <div className="hp-mini-stat">
                        <p className="hp-mini-val">
                            {Math.round(
                                (result.percentage / 100) *
                                result.totalQuestions
                            )}
                        </p>
                        <p className="hp-mini-label">Correct</p>
                    </div>

                    <div className={`hp-mini-stat ${passed ? "hp-mini-stat-pass" : "hp-mini-stat-fail"}`}>
                        <p className={`hp-mini-val ${passed ? "hp-mini-val-pass" : "hp-mini-val-fail"}`}>
                            {result.percentage}%
                        </p>
                        <p className="hp-mini-label">Score</p>
                    </div>
                </div>

                <div className="hp-bar-track">
                    <div
                        className={`hp-bar-fill ${passed ? "hp-bar-pass" : "hp-bar-fail"}`}
                        style={{ width: `${result.percentage}%` }}
                    />
                </div>

                <div className="hp-result-date">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(result.submittedAt)}
                </div>

                {passed && result.examType === "MAIN" && (
                    <button
                        onClick={() => downloadCertificate(result)}
                        className="premium-button premium-shine w-full mt-5"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" />
                            <span>Download Certificate</span>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};


    return (
        <div className="premium-root min-h-screen" onClick={() => showDropdown && setShowDropdown(false)}>
            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />

            {/* Navbar */}
            <nav className="premium-navbar mx-6 md:mx-12">
                <div className="navbar-logo">
                    <div className="logo-mark">
                        <ShieldCheck className="w-5 h-5 text-white" />
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
                                    <div className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /><span>Dashboard</span></div>
                                </div>
                                {/* <div className="dropdown-item" onClick={() => navigate('/history')}> */}
                                    {/* <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>Exam History</span></div> */}
                                {/* </div> */}
                                <div className="dropdown-divider" />
                                <div className="dropdown-item dropdown-item-danger" onClick={logout}>
                                    <div className="dropdown-item-icon"><LogOut className="w-4 h-4" /></div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div id="history-content" className="px-6 md:px-12 py-10 max-w-[1800px] mx-auto space-y-10">

                {/* ── Hero ── */}
                <div className="hp-hero mb-10">
                    <div className="hp-hero-glow" />
                    <div className="hp-hero-inner">
                        <div>
                            <span className="hero-accent">Student History</span>
                            <h2 className="hero-title mt-3">Exam History</h2>
                            <p className="hero-sub">All your past exam attempts and results.</p>
                        </div>
                        <div className="stats-card premium-shine min-w-[220px]">
                            <p className="text-cyan-300 text-3xl font-extrabold">{results.length}</p>
                            <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.5px] mt-2">Exams Taken</p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="hp-stats-grid mb-8">
                    <div className="activity-violation-card premium-shine p-6">
                        <div className="hp-stat-icon hp-stat-icon-blue">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                        <p className="hp-stat-label">Average Score</p>
                        <p className="hp-stat-value hp-stat-value-blue">{averagePercentage}%</p>
                    </div>
                    <div className="activity-violation-card premium-shine p-6">
                        <div className="hp-stat-icon hp-stat-icon-emerald">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <p className="hp-stat-label">Best Score</p>
                        <p className="hp-stat-value hp-stat-value-emerald">{bestPercentage}%</p>
                    </div>
                    <div className="activity-violation-card premium-shine p-6  ">
                        <div className="hp-stat-icon hp-stat-icon-cyan">
                        <FileText className="w-4 h-4" />                        </div>
                        <p className="hp-stat-label">Exams Attempted</p>
                        <p className="hp-stat-value hp-stat-value-cyan">{totalExams}</p>
                    </div>
                    <div className="activity-violation-card premium-shine p-6">
                        <div className="hp-stat-icon hp-stat-icon-cyan">
                        <ShieldCheck className="w-4 h-4" />                        </div>
                        <p className="hp-stat-label">Pass Rate</p>
                        <p className="hp-stat-value hp-stat-value-cyan">{passRate}%</p>
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,216,107,0.06)" />
                                    <XAxis dataKey="exam" tick={{ fill: "rgba(255,255,255,0.52)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.52)", fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: "rgba(8,12,24,0.96)", border: "1px solid rgba(255,216,107,0.14)", borderRadius: 12, color: "#f8fafc", fontSize: 13 }}
                                        cursor={{ stroke: "rgba(255,216,107,0.2)" }}
                                    />
                                    <Line type="monotone" dataKey="percentage" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 5, fill: "#facc15" , strokeWidth: 0 }} activeDot={{ r: 7, fill: "#fde68a" }} />
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#fde68a" />
                                            <stop offset="50%" stopColor="#facc15" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="activity-violation-card premium-shine p-10 mb-8 text-center">
                        <div className="hp-locked-icon-wrap">
                        <BarChart3 className="w-5 h-5" />                        </div>
                        <h3 className="hp-locked-title">Performance Trend Locked</h3>
                        <p className="hp-locked-sub">Complete at least 2 exams to unlock advanced analytics and trend tracking.</p>
                    </div>
                )}

                {/* ── AI Insight ── */}
                <div className="premium-create-exam-card premium-shine p-8 mb-8 relative overflow-hidden">
                    <div className="hp-insight-glow" />
                    <div className="hp-insight-inner">
                        <div className="hp-insight-badge">
                            <Sparkles className="w-3 h-3" />      
                            AI PERFORMANCE INSIGHT
                        </div>
                        <p className="hp-insight-text">{performanceInsight}</p>
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="hp-toolbar mb-6">
                    <button onClick={() => navigate("/student-dashboard")} className="premium-btn-secondary">
                       <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={exportPDF} className="premium-button premium-shine hp-btn-export">
                    <Download className="w-4 h-4" />                        
                        Export PDF
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && (

                    <PremiumLoader
                        title="Loading Exam History..."
                        subtitle="Fetching your past attempts and performance analytics."
                        height="60vh"
                    />

                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="hp-empty-card">
                        <div className="hp-empty-icon hp-empty-icon-red">
                        <TriangleAlert className="w-5 h-5" />                        </div>
                        <p className="hp-empty-title">Failed to load history</p>
                        <p className="hp-empty-sub">Something went wrong while fetching your results.</p>
                        <button onClick={fetchHistory} className="premium-btn-primary hp-empty-btn">Try Again</button>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && results.length === 0 && (
                    <div className="hp-empty-card">
                        <div className="hp-empty-icon hp-empty-icon-amber premium-empty-icon">
                            <FileText className="w-5 h-5" />                        </div>
                        <p className="hp-empty-title">No exam history yet</p>
                        <p className="hp-empty-sub">Complete an exam to see your results here.</p>
                        <button onClick={() => navigate("/student-dashboard")} className="premium-btn-primary hp-empty-btn">Browse Exams</button>
                    </div>
                )}

                <div className="max-w-[1500px] mx-auto flex flex-col xl:flex-row gap-4 mb-10 p-5 rounded-[32px] border border-white/10 backdrop-blur-2xl bg-[rgba(15,23,42,0.62)] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"><input type="text" placeholder="Search exams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 h-[64px] px-6 rounded-[22px] premium-input text-white" /><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-[64px] px-6 rounded-[22px] premium-input text-white min-w-[190px]"><option value="ALL">All Types</option><option value="PRACTICE">Practice</option><option value="MOCK">Mock</option><option value="MAIN">Main</option></select></div>

                {/* ── Result Cards ── */}
                {!loading && !error && results.length > 0 && (
                    <>
                        {practiceResults.length > 0 && (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Practice Exams
                                </h2>

                                <div className="hp-results-grid">
                                    {practiceResults.map(renderResultCard)}
                                </div>
                            </>
                        )}

                        {mockResults.length > 0 && (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6 mt-10">
                                    Mock Exams
                                </h2>

                                <div className="hp-results-grid">
                                    {mockResults.map(renderResultCard)}
                                </div>
                            </>
                        )}

                        {mainResults.length > 0 && (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6 mt-10">
                                    Main Exams
                                </h2>

                                <div className="hp-results-grid">
                                    {mainResults.map(renderResultCard)}
                                </div>
                            </>
                        )}


                        {!loading &&
                        !error &&
                        results.length > 0 &&
                        practiceResults.length === 0 &&
                        mockResults.length === 0 &&
                        mainResults.length === 0 && (

                    <div className="hp-empty-card">
                        <div className="hp-empty-icon hp-empty-icon-amber premium-empty-icon">
                            <FileText className="w-5 h-5" />
                        </div>

                        <p className="hp-empty-title">
                            No matching exams found
                        </p>

                        <p className="hp-empty-sub">
                            Try changing the search term or filter.
                        </p>
                    </div>
                )}
                    </>
                )}

            </div>
        </div>
    );
}
export default HistoryPage;
