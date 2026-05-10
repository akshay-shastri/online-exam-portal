import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

function ExamDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    const fetchExamDetails = async () => {
        setLoading(true);
        try {
            const response = await API.get("/exams");
            const exams = response.data;
            const foundExam = exams.find(e => e.id === parseInt(id));
            
            if (foundExam) {
                setExam(foundExam);
            } else {
                toast.error("Exam not found");
                navigate("/admin-dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load exam details");
            navigate("/admin-dashboard");
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

    const featureCards = [
        {
            id: "questions",
            icon: "📝",
            title: "Edit Questions",
            description: "Manage, add, or edit exam questions",
            route: `/admin/exam/${id}/questions`,
            color: "from-violet-500 to-purple-600"
        },
        {
            id: "activity",
            icon: "📊",
            title: "View Activity",
            description: "Monitor student exam attempts and submissions",
            route: `/admin/exam/${id}/activity`,
            color: "from-cyan-500 to-blue-600"
        },
        {
            id: "face-logs",
            icon: "📸",
            title: "Face Verification Logs",
            description: "Review facial recognition records",
            route: `/admin/exam/${id}/face-logs`,
            color: "from-pink-500 to-rose-600"
        },
        {
            id: "leaderboard",
            icon: "🏆",
            title: "Leaderboard",
            description: "View student rankings and scores",
            route: `/admin/exam/${id}/leaderboard`,
            color: "from-amber-500 to-orange-600"
        }
    ];

    if (loading) {
        return (
            <div className="premium-root min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-400/30 border-t-purple-400 animate-spin mx-auto mb-4" />
                    <p style={{ color: 'rgba(196,181,253,0.7)' }}>Loading exam details...</p>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="premium-root min-h-screen flex items-center justify-center">
                <p style={{ color: 'rgba(196,181,253,0.7)' }}>Exam not found</p>
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
                        <div style={{ fontSize: '11px', color: 'rgba(196,181,253,0.5)', letterSpacing: '0.3px' }}>Admin Panel</div>
                    </div>
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

            <div className="px-6 md:px-12 py-10 max-w-screen-2xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Exam Management</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Manage questions, monitor activity, and review exam records.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 mt-8 items-start">
                        <div className="stats-card">
                            <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exam ID</p>
                            <p style={{ color: '#f3e8ff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>#{exam.id}</p>
                        </div>
                        <div className="stats-card">
                            <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</p>
                            <p style={{ color: '#f3e8ff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>{exam.duration} min</p>
                        </div>
                        <div className="stats-card">
                            <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                            <p style={{ color: '#86efac', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>Active</p>
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {featureCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => navigate(card.route)}
                            className="group cursor-pointer relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                            style={{
                                background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.35)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 12px 48px rgba(124,58,237,0.25)';
                                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                            }}
                        >
                            {/* Gradient accent line */}
                            <div
                                className="h-1 w-full"
                                style={{
                                    background: `linear-gradient(90deg, var(--tw-gradient-stops))`,
                                    '--tw-gradient-from': card.color.split(' ')[1],
                                    '--tw-gradient-to': card.color.split(' ')[3],
                                    background: card.color.includes('violet') 
                                        ? 'linear-gradient(90deg, #a78bfa, #c084fc)' 
                                        : card.color.includes('cyan')
                                        ? 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                                        : card.color.includes('pink')
                                        ? 'linear-gradient(90deg, #ec4899, #f43f5e)'
                                        : 'linear-gradient(90deg, #f59e0b, #fb923c)'
                                }}
                            />

                            <div className="p-7 flex flex-col h-full">
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                    style={{
                                        background: card.color.includes('violet')
                                            ? 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(196,181,253,0.1))'
                                            : card.color.includes('cyan')
                                            ? 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(96,165,250,0.1))'
                                            : card.color.includes('pink')
                                            ? 'linear-gradient(135deg, rgba(244,114,182,0.25), rgba(251,113,133,0.1))'
                                            : 'linear-gradient(135deg, rgba(217,119,6,0.25), rgba(245,158,11,0.1))',
                                        border: '1px solid rgba(167,139,250,0.2)',
                                        fontSize: '32px'
                                    }}
                                >
                                    {card.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-purple-300" style={{ color: '#f3e8ff' }}>
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p
                                    className="text-sm leading-relaxed flex-1 mb-4 transition-colors duration-300"
                                    style={{ color: 'rgba(196,181,253,0.7)' }}
                                >
                                    {card.description}
                                </p>

                                {/* Arrow CTA */}
                                <div
                                    className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:translate-x-1"
                                    style={{ color: 'rgba(196,181,253,0.8)' }}
                                >
                                    <span>Access</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Hover glow effect */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{
                                    background: card.color.includes('violet')
                                        ? 'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.15), transparent 70%)'
                                        : card.color.includes('cyan')
                                        ? 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.15), transparent 70%)'
                                        : card.color.includes('pink')
                                        ? 'radial-gradient(circle at 30% 30%, rgba(244,114,182,0.15), transparent 70%)'
                                        : 'radial-gradient(circle at 30% 30%, rgba(217,119,6,0.15), transparent 70%)'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div className="mt-12 rounded-2xl p-6" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: '#f3e8ff' }}>ℹ️ About This Exam</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Positive Marks</p>
                            <p style={{ color: '#f3e8ff', marginTop: '4px', fontSize: '16px', fontWeight: 700 }}>{exam.positiveMarks || 1}</p>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Negative Marks</p>
                            <p style={{ color: '#f3e8ff', marginTop: '4px', fontSize: '16px', fontWeight: 700 }}>{exam.negativeMarks || 0}</p>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Status</p>
                            <p style={{ color: '#86efac', marginTop: '4px', fontSize: '16px', fontWeight: 700 }}>{exam.active ? '✓ Active' : '✗ Inactive'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamDetails;
