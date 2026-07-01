import { useState, useEffect } from "react";
import { LogOut, FileText, BarChart3,Users, Camera,BookOpenCheck, Trophy, Activity,ArrowRight, Info,ShieldCheck} from "lucide-react";import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";

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
        icon: <FileText className="w-7 h-7" />,
        title: "Edit Questions",
        description: "Manage, add, or edit exam questions",
        route: `/admin/exam/${id}/questions`,
        color: "from-amber-500 to-amber-600"
    },
    {
        id: "activity",
        icon: <BarChart3 className="w-7 h-7" />,
        title: "View Activity",
        description: "Monitor student exam attempts and submissions",
        route: `/admin/exam/${id}/activity`,
        color: "from-cyan-500 to-blue-600"
    },
    {
        id: "face-logs",
        icon: <Camera className="w-7 h-7" />,
        title: "Face Verification Logs",
        description: "Review facial recognition records",
        route: `/admin/exam/${id}/face-logs`,
        color: "from-yellow-500 to-rose-600"
    },
    {
        id: "leaderboard",
        icon: <Trophy className="w-7 h-7" />,
        title: "Leaderboard",
        description: "View student rankings and scores",
        route: `/admin/exam/${id}/leaderboard`,
        color: "from-amber-500 to-orange-600"
    },
    {
        id: "live-monitor",
        icon: <Activity className="w-7 h-7" />,
        title: "Live Monitoring",
        description: "Monitor active students in real-time",
        route: `/admin/exam/${id}/live-monitor`,
        color: "from-emerald-500 to-green-600"
    },

    {
        id: "candidates",
        icon: <Users className="w-7 h-7" />,
        title: "Candidate Analytics",
        description: "Performance, timeline and face verification",
        route: `/admin/exam/${id}/candidates`,
        color: "from-amber-500 to-yellow-600"
    }
    ];

    if (loading) {
        return (
            <PremiumLoader
                title="Loading Exam Details..."
                subtitle="Preparing examination analytics and controls."
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
                    <button onClick={() => navigate("/admin-dashboard")} className="premium-btn-secondary">
                        <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4 rotate-180" /><span>Back</span></div>
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
                                    <div className="dropdown-item-icon"> <LogOut className="w-4 h-4" /></div>
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
                        <span className="hero-accent">Exam Management</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Manage questions, monitor activity, and review exam records.</p>
                </div>

                    
                    <div className="flex flex-wrap gap-6 mt-8 items-start">
                        <div className="stats-card premium-shine">
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exam ID</p>
                            <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>#{exam.id}</p>
                        </div>
                        <div className="stats-card premium-shine">
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</p>
                            <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>{exam.duration} min</p>
                        </div>
                        <div className="stats-card premium-shine">
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                            <p style={{ color: '#86efac', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>Active</p>
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featureCards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => navigate(card.route)}
                            className="exam-feature-card premium-shine group"
                        >
                            <div className="exam-feature-top-line" />

                            <div className="exam-feature-content">
                                <div className="exam-feature-icon">
                                    {card.icon}
                                </div>

                                <div className="space-y-3">
                                    <h3 className="exam-feature-title">
                                        {card.title}
                                    </h3>

                                    <p className="exam-feature-description">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="exam-feature-action">
                                    <span>Access</span>
                                    <svg
                                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div className="activity-violation-card premium-shine mt-12 p-8">
                    <h3 className="premium-section-title text-xl mb-6 flex items-center gap-3" style={{ color: '#ffffff' }}> <Info className="w-5 h-5 text-amber-300" /><span>About This Exam</span></h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div className="flex flex-col items-center text-center">
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>Positive Marks</p>
                            <p style={{ color: '#ffffff', marginTop: '10px', fontSize: '28px', fontWeight: 800 }}>{exam.positiveMarks || 1}</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>Negative Marks</p>
                            <p style={{ color: '#ffffff', marginTop: '10px', fontSize: '28px', fontWeight: 800 }}>{exam.negativeMarks || 0}</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>Status</p>
                            <div className="flex items-center gap-2 mt-3" style={{ color: '#86efac', fontSize: '18px', fontWeight: 700 }}><ShieldCheck className="w-4 h-4" /><span>{exam.active ? "Active" : "Inactive"}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamDetails;