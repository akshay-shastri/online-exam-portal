import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

function CreateExam() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [positiveMarks, setPositiveMarks] = useState("");
    const [negativeMarks, setNegativeMarks] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const inputClass = "w-full bg-black/40 border border-purple-500/25 text-purple-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 placeholder-purple-400/40 transition-all duration-200 hover:border-purple-400/40 backdrop-blur-sm";

    const dateTimeInputClass = "w-full bg-black/50 border border-purple-500/30 text-purple-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-300/60 transition-all duration-300 hover:border-purple-400/50 backdrop-blur-sm cursor-pointer";

    const labelClass = "block text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2";

    const formatDateTimeForDisplay = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const createExam = async () => {
        if (loading) return;

        // Basic validation
        if (!title.trim()) {
            toast.error("Exam title is required.");
            return;
        }
        if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
            toast.error("Please enter a valid duration.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/exams", {
                title,
                duration: parseInt(duration),
                positiveMarks: positiveMarks ? parseFloat(positiveMarks) : 1,
                negativeMarks: negativeMarks ? parseFloat(negativeMarks) : 0,
                startTime: startTime ? `${startTime}:00` : null,
                endTime: endTime ? `${endTime}:00` : null,
                active: true
            });

            toast.success("Exam created successfully!");
            console.log(response.data);

            // Navigate back to admin dashboard
            setTimeout(() => navigate("/admin-dashboard"), 500);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
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
                    <button onClick={() => navigate("/admin-dashboard")} className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        ← Back to Dashboard
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
                                    <div className="dropdown-item-icon">🚪</div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Create Exam</span>
                        <h2 className="hero-title">Add New Examination</h2>
                        <p className="hero-sub">Configure exam details, marking scheme, and time constraints for your assessment.</p>
                    </div>
                </div>

                {/* Create Exam Card */}
                <div 
                    className="rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300"
                    style={{
                        background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%)',
                        border: '1px solid rgba(168,85,247,0.2)',
                        boxShadow: '0 0 40px rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.35)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 60px rgba(168,85,247,0.15), 0 12px 48px rgba(0,0,0,0.4)';
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 40px rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.35)';
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)';
                    }}
                >
                    {/* Accent Strip */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-purple-500/60 via-pink-500/40 to-purple-600/50" />

                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div 
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: 'rgba(168,85,247,0.15)',
                                    border: '1px solid rgba(168,85,247,0.3)',
                                    boxShadow: '0 0 12px rgba(168,85,247,0.2)'
                                }}
                            >
                                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h2 style={{ color: '#f3e8ff' }} className="text-lg font-bold leading-tight">Exam Configuration</h2>
                                <p style={{ color: 'rgba(196,181,253,0.5)' }} className="text-xs mt-1">Set up your examination parameters</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Exam Title */}
                            <div>
                                <label className={labelClass}>📝 Exam Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mathematics Final Exam"
                                    className={inputClass}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Marks Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>➕ Positive Marks</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 1"
                                        className={inputClass}
                                        value={positiveMarks}
                                        onChange={(e) => setPositiveMarks(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>➖ Negative Marks</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 0.25"
                                        className={inputClass}
                                        value={negativeMarks}
                                        onChange={(e) => setNegativeMarks(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className={labelClass}>⏱️ Duration (minutes)</label>
                                <input
                                    type="number"
                                    placeholder="Duration in minutes"
                                    className={inputClass}
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>

                            {/* Time Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>🟢 Start Time (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        className={dateTimeInputClass}
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        title="Select exam start date and time"
                                    />
                                    {startTime && (
                                        <p style={{ color: 'rgba(74,222,128,0.6)' }} className="text-xs mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            {formatDateTimeForDisplay(startTime)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>🔴 End Time (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        className={dateTimeInputClass}
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        title="Select exam end date and time"
                                    />
                                    {endTime && (
                                        <p style={{ color: 'rgba(248,113,113,0.6)' }} className="text-xs mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            {formatDateTimeForDisplay(endTime)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-6">
                                <button
                                    onClick={() => navigate("/admin-dashboard")}
                                    className="flex-1 rounded-xl text-sm font-semibold transition-all duration-200 py-3 border"
                                    style={{
                                        background: 'rgba(124,58,237,0.05)',
                                        border: '1px solid rgba(168,85,247,0.15)',
                                        color: 'rgba(196,181,253,0.8)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.12)';
                                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                                        e.currentTarget.style.color = '#d8b4fe';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.15)';
                                        e.currentTarget.style.color = 'rgba(196,181,253,0.8)';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createExam}
                                    disabled={loading}
                                    className="flex-1 rounded-xl text-sm font-semibold transition-all duration-200 py-3 border flex items-center justify-center gap-2"
                                    style={{
                                        background: loading ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, rgba(168,85,247,0.8), rgba(217,70,239,0.6))',
                                        border: '1px solid rgba(168,85,247,0.4)',
                                        color: '#f3e8ff',
                                        boxShadow: loading ? 'none' : '0 0 20px rgba(168,85,247,0.3)',
                                        opacity: loading ? 0.7 : 1,
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.boxShadow = '0 0 30px rgba(168,85,247,0.5), 0 8px 16px rgba(0,0,0,0.4)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.3)';
                                            e.currentTarget.style.transform = 'translateY(0px)';
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Creating Exam...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Exam
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div 
                    className="mt-10 rounded-2xl p-6 backdrop-blur-md transition-all duration-300"
                    style={{
                        background: 'rgba(124,58,237,0.06)',
                        border: '1px solid rgba(168,85,247,0.12)',
                        boxShadow: '0 0 20px rgba(124,58,237,0.08)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.12)';
                    }}
                >
                    <h3 style={{ color: '#f3e8ff' }} className="text-sm font-bold mb-4">📋 Configuration Guide</h3>
                    <ul style={{ color: 'rgba(196,181,253,0.7)' }} className="space-y-3 text-xs leading-relaxed">
                        <li className="flex gap-2">
                            <span className="text-purple-400 flex-shrink-0">➕</span>
                            <span><strong className="text-purple-300">Positive Marks:</strong> Points awarded for each correct answer (default: 1)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-400 flex-shrink-0">➖</span>
                            <span><strong className="text-purple-300">Negative Marks:</strong> Points deducted for each wrong answer (default: 0)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-400 flex-shrink-0">⏱️</span>
                            <span><strong className="text-purple-300">Duration:</strong> Exam time limit in minutes (required)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-400 flex-shrink-0">🕐</span>
                            <span><strong className="text-purple-300">Start/End Time:</strong> Optional. Leave blank for no time restrictions.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-400 flex-shrink-0">❓</span>
                            <span><strong className="text-purple-300">Questions:</strong> After creating the exam, add questions from the dashboard.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CreateExam;
