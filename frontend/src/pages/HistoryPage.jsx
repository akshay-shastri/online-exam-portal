import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function HistoryPage() {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
        <div className="min-h-screen bg-[#f0f4ff] dark:bg-gray-950" onClick={() => showDropdown && setShowDropdown(false)}>
    const [showDropdown, setShowDropdown] = useState(false);

            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm dark:bg-gray-900/90 dark:border-gray-700">
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await API.get(`/results/${name}`);
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
                                        <p className="font-semibold text-gray-800 text-sm leading-tight dark:text-gray-100">{name}</p>
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (

        <div className="min-h-screen bg-[#f0f4ff]" onClick={() => showDropdown && setShowDropdown(false)}>

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm">

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        Smart Exam Portal
                    </h1>
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>

                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md hover:shadow-blue-300 hover:scale-105 transition-all duration-200 ring-2 ring-white"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

                            <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow">
                                        {firstLetter}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm leading-tight">{name}</p>
                                        <p className="text-xs text-blue-500 font-medium mt-0.5">Student</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1.5">
                                <button
                        <div className="shrink-0 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/20 dark:bg-gray-800 dark:border-gray-700">
                                    className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-base">🏠</span>
                                    <span className="font-medium">Dashboard</span>
                                </button>

                                <button
                                    onClick={() => navigate("/history")}
                                    className="w-full text-left px-5 py-3 text-sm text-blue-600 bg-blue-50 flex items-center gap-3"
                                >
                                    <span className="text-base">📋</span>
                                    <span className="font-medium">Exam History</span>
                                </button>

                                <button
                                    onClick={logout}
                                    className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-base">🚪</span>
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>

                        </div>
                    )}

                </div>

            </nav>

            <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">

                {/* Hero Banner */}
                <div className="mb-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl px-8 py-9 md:px-12 shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-2">Student History</p>
                            <h2 className="text-3xl font-extrabold text-white mb-1.5 leading-tight">
                                Exam History
                            </h2>
                            <p className="text-blue-100 text-sm font-medium">
                                All your past exam attempts and results.
                            </p>
                        </div>
                        <div className="shrink-0 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/20">
                            <p className="text-3xl font-extrabold text-white">{results.length}</p>
                            <p className="text-blue-100 text-xs font-medium mt-0.5">Exams Taken</p>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate("/student-dashboard")}
                    className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-indigo-600 transition-colors mb-7"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
                        <p className="text-sm text-gray-400 font-medium">Loading your history...</p>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-200 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-semibold text-base">Failed to load history</p>
                        <p className="text-gray-400 text-sm mt-1 mb-5">Something went wrong while fetching your results.</p>
                        <button
                            onClick={fetchHistory}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && results.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-blue-200 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-semibold text-base">No exam history yet</p>
                        <p className="text-gray-400 text-sm mt-1 mb-6">Complete an exam to see your results here.</p>
                        <button
                            onClick={() => navigate("/student-dashboard")}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md"
                        >
                            Browse Exams
                        </button>
                    </div>
                )}

                {/* Results cards */}
                {!loading && !error && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {results.map((result, index) => {

                            const passed = result.percentage >= 40;

                            return (
                                <div
                                    key={result.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Top accent */}
                                    <div className={`h-1.5 w-full ${passed ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`} />

                                    <div className="p-6 flex flex-col flex-1">

                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${passed ? "bg-blue-50" : "bg-red-50"}`}>
                                                    <svg className={`w-5 h-5 ${passed ? "text-blue-500" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-800 leading-snug">{result.examTitle}</h3>
                                            </div>
                                            <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${passed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                                                {passed ? "PASSED" : "FAILED"}
                                            </span>
                                        </div>

                                        {/* Stats grid */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-gray-50 rounded-xl px-2 py-3 text-center border border-gray-100">
                                                <p className="text-lg font-extrabold text-gray-800">{result.score}</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">Score</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl px-2 py-3 text-center border border-gray-100">
                                                <p className="text-lg font-extrabold text-gray-800">{result.totalQuestions}</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">Total</p>
                                            </div>
                                            <div className={`rounded-xl px-2 py-3 text-center border ${passed ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}>
                                                <p className={`text-lg font-extrabold ${passed ? "text-blue-600" : "text-red-500"}`}>{result.percentage}%</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">Accuracy</p>
                                            </div>
                                        </div>

                                        {/* Percentage bar */}
                                        <div className="mb-4">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-700 ${passed ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
                                                    style={{ width: `${result.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
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
