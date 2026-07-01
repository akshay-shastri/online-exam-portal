import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import {   LogOut,  ArrowLeft,  Camera,  PlayCircle, StopCircle,  Search,  ClipboardList, ShieldCheck, AlertTriangle,XCircle } from "lucide-react";

function ExamLeaderboard() {
    const navigate = useNavigate();
    const { id } = useParams();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exam, setExam] = useState(null);
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchExamAndResults();
    }, [id]);

    const fetchExamAndResults = async () => {
        setLoading(true);
        try {
            // Fetch exam details
            const examResponse = await API.get("/exams");
            const exams = examResponse.data;
            const foundExam = exams.find(e => e.id === parseInt(id));

            if (!foundExam) {
                toast.error("Exam not found");
                navigate("/admin-dashboard");
                return;
            }

            setExam(foundExam);

            // Fetch all results
            const resultsResponse = await API.get("/results");
            const allResults = resultsResponse.data || [];

            setResults(allResults);

            // Filter results for this exam and sort by score (highest first)
            const examResults = allResults
                .filter(r => r.examTitle && r.examTitle === foundExam.title)
                .sort((a, b) => (b.score || 0) - (a.score || 0));

            setFilteredResults(examResults);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load leaderboard data");
            navigate("/admin-dashboard");
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (score, totalMarks = 100) => {
        return ((score / totalMarks) * 100).toFixed(1);
    };

    const isPassed = (score, passingScore = 40) => {
        return (score || 0) >= passingScore;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return { bg: "rgba(217,119,6,0.15)", border: "rgba(217,119,6,0.3)", text: "#fdba74", glow: "0 0 20px rgba(217,119,6,0.4)" };
        if (rank === 2) return { bg: "rgba(156,163,175,0.15)", border: "rgba(156,163,175,0.3)", text: "#d1d5db", glow: "0 0 20px rgba(156,163,175,0.3)" };
        if (rank === 3) return { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", text: "#ffe27a", glow: "0 0 20px rgba(167,139,250,0.2)" };
        return { bg: "transparent", border: "rgba(255,255,255,0.07)", text: "#e9d5ff", glow: "none" };
    };

    // const getRankMedal = (rank) => {
    //     if (rank === 1) return "🥇";
    //     if (rank === 2) return "🥈";
    //     if (rank === 3) return "🥉";
    //     return `${rank}`;
    // };

    const totalParticipants = filteredResults.length;
    const averageScore = totalParticipants > 0 
        ? (filteredResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalParticipants).toFixed(1)
        : 0;
    const highestScore = filteredResults.length > 0 ? filteredResults[0].score : 0;
    const passedCount = filteredResults.filter(r => isPassed(r.score)).length;
    const passPercentage = totalParticipants > 0 ? ((passedCount / totalParticipants) * 100).toFixed(1) : 0;

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    if (loading) {
        return (

    <PremiumLoader
    title="Loading Leaderboard Data..."
    subtitle="Analyzing student rankings and performance metrics."
    height="100vh"
/>

);
    }

    if (!exam) {
        return (
            <div className="premium-root min-h-screen flex items-center justify-center">
                <p className="text-white/70 text-lg">Exam not found</p>
            </div>
        );
    }

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
                    <div>
                        <div className="logo-text-primary">Smart Exam Portal</div>
                        <div className="text-white/45 text-[11px] tracking-wide">Admin Panel</div>
                    </div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/admin/exam/${id}`)} className="premium-btn-secondary">
                     <div className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /><span>Back</span></div>
                    </button>

                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="profile-btn"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className="profile-dropdown animate-fade-in">
                            <div className="profile-top">
                                <div className="profile-avatar">{firstLetter}</div>
                                <div>
                                    <div className="profile-name">{name}</div>
                                    <div className="profile-role">Administrator • Online</div>
                                </div>
                            </div>
                            <div className="dropdown-menu">
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

            <div className="px-6 md:px-12 py-10 max-w-[1800px] mx-auto space-y-10">
                {/* Hero Section */}
                <div className="mb-12 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Performance Rankings</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">View student performance and rankings for this exam.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8 items-start">

                    <div className="stats-card premium-shine min-w-[220px]">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.5px]">
                            Exam ID
                        </p>

                        <p className="text-white text-2xl font-extrabold mt-2">
                            #{exam.id}
                        </p>
                    </div>

                    <div className="stats-card premium-shine min-w-[220px]">
                        <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
                            Participants
                        </p>

                        <p className="text-blue-300 text-2xl font-extrabold mt-2">
                            {totalParticipants}
                        </p>
                    </div>

                    <div className="stats-card premium-shine min-w-[220px]">
                        <p className="text-emerald-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
                            Average Score
                        </p>

                        <p className="text-emerald-300 text-2xl font-extrabold mt-2">
                            {averageScore}
                        </p>
                    </div>

                </div>
                </div>

                {/* Summary Stats Cards */}
                {filteredResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                        <div className="activity-violation-card premium-shine p-5">
                            <p style={{ color: 'rgba(217,119,6,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><p className="flex items-center gap-2" style={{ color: 'rgba(217,119,6,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><Trophy className="w-4 h-4" /><span>Highest Score</span></p></p>
                            <p style={{ color: '#fdba74', fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>{highestScore}</p>
                        </div>

                        <div className="activity-violation-card premium-shine p-5" >
                            <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><p className="flex items-center gap-2" style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><BarChart3 className="w-4 h-4" /><span>Average Score</span></p></p>
                            <p style={{ color: '#86efac', fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>{averageScore}</p>
                        </div>

                        <div className="activity-violation-card premium-shine p-5" >
                            <p style={{ color: 'rgba(96,165,250,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><p className="flex items-center gap-2" style={{ color: 'rgba(96,165,250,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><CheckCircle2 className="w-4 h-4" /><span>Pass Rate</span></p></p>
                            <p style={{ color: '#93c5fd', fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>{passPercentage}%</p>
                        </div>

                        <div className="activity-violation-card premium-shine p-5" >
                            <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><p className="flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.6)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}><Award className="w-4 h-4" /><span>Total Participants</span></p></p>
                            <p style={{ color: '#ffe27a', fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>{totalParticipants}</p>
                        </div>
                    </div>
                )}

                {/* Leaderboard */}
                {filteredResults.length === 0 ? (
                    <div className="empty-state-card text-center py-24 premium-shine">
                        <svg className="w-20 h-20 mx-auto mb-4 premium-empty-icon" style={{ color: 'rgba(255,216,107,0.16)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p style={{ color: '#ffffff' }} className="font-semibold text-xl mb-2">No Leaderboard Data</p>
                        <p style={{ color: 'rgba(255,255,255,0.55)' }}>No student submissions available for this exam yet.</p>
                        {/* <button
    onClick={() => navigate(`/admin/exam/${id}`)}
    className="premium-btn-primary mt-6"
>
    Back to Exam
</button> */}


                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredResults.map((result, index) => {
                            const rank = index + 1;
                            const rankColor = getRankColor(rank);
                            const percentage = calculatePercentage(result.score);
                            const passed = isPassed(result.score);

                            return (
                                <div
                                    key={result.id || index}
                                    className="leaderboard-row-card premium-shine p-5"
                                >
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        {/* Rank Medal */}
                                        <div className="flex items-center gap-4">
                                            <div className="leaderboard-rank-badge"                                    
                                            >
                                                <>
                                                    {
                                                        rank === 1 ? (
                                                            <Trophy className="w-5 h-5 text-amber-300" />
                                                        ) : rank === 2 ? (
                                                            <Medal className="w-5 h-5 text-slate-300" />
                                                        ) : rank === 3 ? (
                                                            <Award className="w-5 h-5 text-orange-300" />
                                                        ) : (
                                                            <span>{rank}</span>
                                                        )
                                                    }
                                                </>
                                            </div>

                                            {/* Student Info */}
                                            <div>
                                                <p style={{ color: '#ffffff' }} className="font-bold text-lg">
                                                    {result.studentName}
                                                </p>
                                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' }}>
                                                    {result.submissionTime ? new Date(result.submissionTime).toLocaleString() : "No submission time"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 md:flex md:items-center gap-5 md:gap-8">
                                            <div className="text-center">
                                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Score</p>
                                                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                    {result.score}
                                                </p>
                                            </div>

                                            <div className="text-center">
                                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Percentage</p>
                                                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                                                    {percentage}%
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <span
                                                className="text-xs font-semibold px-4 py-2 rounded-full border"
                                                style={{
                                                    background: passed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                                    borderColor: passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                                                    color: passed ? '#86efac' : '#fca5a5'
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {
                                                        passed ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4" />
                                                        )
                                                    }

                                                    <span>
                                                        {passed ? "PASS" : "FAIL"}
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                                background: passed 
                                                    ? 'linear-gradient(90deg, rgba(34,197,94,0.8), rgba(34,197,94,0.4))'
                                                    : 'linear-gradient(90deg, rgba(239,68,68,0.8), rgba(239,68,68,0.4))',
                                                transition: 'width 0.5s ease-out'
                                            }}
                                            className="h-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Ranking Legend */}
                {filteredResults.length > 0 && (
                    <div className="activity-violation-card premium-shine mt-12 p-8">
                        <h3 className="premium-section-title text-xl mb-6" style={{ color: '#ffffff' }}><div className="flex items-center gap-3"><BarChart3 className="w-5 h-5 text-amber-300" /><span>Ranking Information</span></div></h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p style={{ color: 'rgba(217,119,6,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(217,119,6,0.7)', fontSize: '12px', fontWeight: 600 }}><Trophy className="w-4 h-4" /><span>First Place</span></p></p>
                                <p style={{ color: '#fdba74', marginTop: '8px', fontSize: '14px' }}>
                                    {filteredResults[0]?.studentName || "N/A"} - {filteredResults[0]?.score} pts
                                </p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(156,163,175,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(156,163,175,0.7)', fontSize: '12px', fontWeight: 600 }}><Medal className="w-4 h-4" /><span>Second Place</span></p></p>
                                <p style={{ color: '#d1d5db', marginTop: '8px', fontSize: '14px' }}>
                                    {filteredResults[1]?.studentName || "N/A"} - {filteredResults[1]?.score || 0} pts
                                </p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(167,139,250,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.7)', fontSize: '12px', fontWeight: 600 }}><Award className="w-4 h-4" /><span>Third Place</span></p></p>
                                <p style={{ color: '#ffe27a', marginTop: '8px', fontSize: '14px' }}>
                                    {filteredResults[2]?.studentName || "N/A"} - {filteredResults[2]?.score || 0} pts
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExamLeaderboard;
