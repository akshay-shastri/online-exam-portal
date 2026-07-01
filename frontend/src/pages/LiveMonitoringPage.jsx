import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import {
    ShieldCheck,
    ArrowLeft,
    LogOut,
    Activity,
    AlertTriangle,
    Radio,
    User,
    Webcam,
    Expand,
    Users,
    Timer
} from "lucide-react";

function LiveMonitoringPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sessions, setSessions] = useState([]);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const fetchData = async () => {
        try {
            setLoading(true);
            const examResponse = await API.get("/exams");
            const foundExam = examResponse.data.find(e => e.id === parseInt(id));
            setExam(foundExam);

            const response = await API.get("/monitor/live");
            const filtered = response.data.filter(s => s.examTitle === foundExam?.title);
            setSessions(filtered);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="premium-root min-h-screen">
            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />
            
            <nav className="premium-navbar mx-6 md:mx-12">
                <div className="navbar-logo">
                    <div className="logo-mark">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="logo-text-primary">Smart Exam Portal</div>
                        <div className="text-white/45 text-[11px] tracking-wide">Admin Panel</div>
                    </div>
                </div>

                <div
                    className="relative flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="premium-btn-secondary"
                    >
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </div>
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
                                <div
                                    className="dropdown-item dropdown-item-danger"
                                    onClick={logout}
                                >
                                    <div className="dropdown-item-icon"><LogOut className="w-4 h-4" /></div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {loading && (
                <PremiumLoader
                    title="Initializing Live Monitoring..."
                    subtitle="Connecting to active student sessions and AI proctoring feed."
                    height="75vh"
                />
            )}

            {!loading && (
                <div className="px-6 md:px-12 py-10 max-w-[1800px] mx-auto space-y-10">
                    <div className="mb-10 glass-hero">
                        <div>
                            <span className="hero-accent">Live Monitoring</span>
                            <h2 className="hero-title">{exam?.title}</h2>
                            <p className="hero-sub">Real-time active student monitoring</p>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-8 items-start">
                            <div className="stats-card premium-shine min-w-[220px]">
                                <p className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-[0.5px]">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Active Sessions</span>
                                </p>
                                <p className="text-emerald-300 text-2xl font-extrabold mt-2">
                                    {sessions.filter(s => s.status === "ACTIVE").length}
                                </p>
                            </div>

                            <div className="stats-card premium-shine min-w-[220px]">
                                <p className="flex items-center gap-2 text-red-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Violations</span>
                                </p>
                                <p className="text-red-300 text-2xl font-extrabold mt-2">
                                    {sessions.reduce((sum, s) => sum + (s.violations || 0), 0)}
                                </p>
                            </div>

                            <div className="stats-card premium-shine min-w-[220px]">
                                <p className="flex items-center gap-2 text-red-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Violations</span>
                                </p>
                                <p className="text-cyan-300 text-2xl font-extrabold mt-2">LIVE</p>
                            </div>
                        </div>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="empty-state-card premium-shine p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.12)]"> <Users className="w-10 h-10 text-amber-300" /> </div>
                            <h3 className="text-white text-xl font-bold mb-2">No Active Students</h3>
                            <p className="text-white/60">No students are currently attempting this exam.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sessions.map((s) => {
                                const integrity = s.violations === 0 ? 'low' : s.violations <= 2 ? 'medium' : 'high';
                                const integrityLabel = integrity === 'low' ? 'Low Risk' : integrity === 'medium' ? 'Medium Risk' : 'High Risk';
                                const integrityColor = integrity === 'low' ? { text: '#86efac', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)' } : integrity === 'medium' ? { text: '#fdba74', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.35)' } : { text: '#fca5a5', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)' };
                                const cardGlowBorder = integrity === 'low' ? 'rgba(34,197,94,0.22)' : integrity === 'medium' ? 'rgba(249,115,22,0.28)' : 'rgba(239,68,68,0.35)';
                                const topStripBg = integrity === 'low' ? 'linear-gradient(90deg,#10b981,#22c55e)' : integrity === 'medium' ? 'linear-gradient(90deg,#f97316,#fb923c)' : 'linear-gradient(90deg,#ef4444,#f43f5e)';
                                const isActive = s.status === 'ACTIVE';

                                return (
                                    <div
                                        key={s.id}
                                        className="lm-card premium-shine"
                                        style={{ '--lm-glow': cardGlowBorder }}
                                    >
                                        <div className="h-1 w-full" style={{ background: topStripBg }} />

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-5 gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="lm-avatar" style={{ background: 'linear-gradient(135deg, rgba(255,216,107,0.22), rgba(250,204,21,0.10))', border: '1px solid rgba(255,216,107,0.18)', boxShadow: '0 0 24px rgba(255,216,107,0.10)' }}>
                                                        {s.studentName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-white font-bold text-base leading-tight truncate">{s.studentName}</h3>
                                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.examTitle}</p>
                                                    </div>
                                                </div>

                                                {isActive ? (
                                                    <div className="lm-live-badge flex-shrink-0 premium-live-pulse">
                                                        <span className="lm-live-dot" />
                                                        LIVE
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
                                                        style={{ background: 'rgba(148,163,184,0.12)', color: 'rgba(148,163,184,0.8)', border: '1px solid rgba(148,163,184,0.18)' }}
                                                    >
                                                        SUBMITTED
                                                    </div>
                                                )}
                                            </div>

                                            <div className="lm-indicators">
                                                <div className="lm-indicator">
                                                    <div className={`lm-indicator-dot ${isActive ? 'lm-dot-green' : 'lm-dot-gray'}`} />
                                                    <span className="lm-indicator-label flex items-center gap-1"><Webcam className="w-3 h-3" />Webcam</span>
                                                </div>

                                                <div className="lm-indicator">
                                                    <div className={`lm-indicator-dot ${isActive ? 'lm-dot-green' : 'lm-dot-gray'}`} />
                                                    <span className="lm-indicator-label flex items-center gap-1"><Expand className="w-3 h-3" />Fullscreen</span>
                                                </div>

                                                <div className="lm-indicator">
                                                    <div className="lm-indicator-dot" style={{ background: integrityColor.text, boxShadow: `0 0 6px ${integrityColor.text}` }} />
                                                    <span className="lm-indicator-label flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Integrity</span>
                                                </div>
                                            </div>

                                            <div className="lm-divider" />

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="lm-stat-label">Violations</span>
                                                    <span className="lm-stat-val" style={{ color: s.violations > 0 ? '#fca5a5' : '#86efac' }}>{s.violations}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="lm-stat-label flex items-center gap-1"><Timer className="w-3.5 h-3.5" />Time Left</span>
                                                    <span className="lm-stat-val" style={{ color: '#67e8f9' }}>{Math.floor(s.timeLeft / 60)}m {s.timeLeft % 60}s</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="lm-stat-label">Integrity</span>
                                                    <span className="lm-integrity-badge" style={{ color: integrityColor.text, background: integrityColor.bg, border: `1px solid ${integrityColor.border}` }}>{integrityLabel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LiveMonitoringPage;