import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import {
    ShieldCheck,
    Trophy,
    Award,
    Medal,
    LayoutDashboard,
    BarChart3,
    Hash,
    Users
} from "lucide-react";

function Leaderboard() {
    const name = localStorage.getItem("name");
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLeaderboard(); }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await API.get("/results/leaderboard");
            setLeaders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const podiumConfig = [
        {
            order: 1,
            height: "h-44",
            bg: "from-yellow-400 to-amber-500",
            shadow: "shadow-amber-200 dark:shadow-amber-900/40",
            ring: "ring-yellow-300",
            label: "1st Place"
        },
        {
            order: 0,
            height: "h-32",
            bg: "from-slate-400 to-gray-500",
            shadow: "shadow-gray-200 dark:shadow-gray-900/40",
            ring: "ring-gray-300",
            label: "2nd Place"
        },
        {
            order: 2,
            height: "h-24",
            bg: "from-orange-400 to-amber-600",
            shadow: "shadow-orange-200 dark:shadow-orange-900/40",
            ring: "ring-orange-300",
            label: "3rd Place"
        },
    ];

    const topThree = leaders.slice(0, 3);
    const remainingLeaders = leaders.slice(3);

    const currentUserIndex = leaders.findIndex(l => l.studentName === name);
    const currentUser = currentUserIndex !== -1 ? leaders[currentUserIndex] : null;

    return (
        <div className="premium-root min-h-screen">
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
                <button onClick={() => navigate("/student-dashboard")} className="premium-btn-secondary">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </button>
            </nav>

            {loading && (
                <PremiumLoader
                    title="Loading Leaderboard..."
                    subtitle="Preparing student rankings and performance statistics."
                    height="70vh"
                />
            )}

            {!loading && (
                <div className="px-6 md:px-12 py-10 max-w-[1800px] mx-auto space-y-10">
                    {/* ── Hero ── */}
                    <div className="lb-hero mb-10">
                        <div className="lb-hero-glow-tr" />
                        <div className="lb-hero-glow-bl" />
                        <div className="lb-hero-inner">
                            <div>
                                <div className="lb-hero-eyebrow">
                                    <span className="lb-trophy-icon"><Trophy className="w-5 h-5 text-amber-300" /></span>
                                    <span className="hero-accent">Rankings</span>
                                </div>
                                <h1 className="lb-hero-title">Student Leaderboard</h1>
                                <p className="lb-hero-sub">Top performers across all examinations</p>
                            </div>
                            <div className="lb-hero-counter">
                                <p className="lb-hero-counter-num">{leaders.length}</p>
                                <p className="lb-hero-counter-label">Students Ranked</p>
                            </div>
                        </div>
                    </div>

                    {currentUser && (
                        <div className="glass-hero">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <div className="stats-card premium-shine">
                                    <p className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-[0.18em]"><Hash className="w-3.5 h-3.5" /><span>Your Ranking</span></p>
                                    <h2 className="text-5xl font-black text-white mt-3">#{currentUserIndex + 1}</h2>
                                </div>

                                <div className="stats-card premium-shine">
                                    <p className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-[0.18em]"><BarChart3 className="w-3.5 h-3.5" /><span>Average Score</span></p>
                                    <h3 className="text-cyan-300 text-4xl font-black mt-3">{currentUser.averageScore}</h3>
                                </div>

                                <div className="stats-card premium-shine">
                                    <p className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-[0.18em]"><Users className="w-3.5 h-3.5" /><span>Attempts</span></p>
                                    <h3 className="text-[#ffe27a] text-4xl font-black mt-3">{currentUser.attempts}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Podium — Top 3 ── */}
                    {topThree.length > 0 && (
                        <div className="mb-10">
                            <p className="lb-section-label mb-8 text-center">Top Performers</p>

                            <div className={`lb-podium-row leaderboard-podium-card ${topThree.length === 1 ? "lb-podium-single" : ""}`}>
                                {[1, 0, 2].map((leaderIdx) => {
                                    const leader = topThree[leaderIdx];
                                    if (!leader) return null;
                                    const cfg = podiumConfig[leaderIdx];
                                    const isFirst = leaderIdx === 0;

                                    return (
                                        <div key={leaderIdx} className={`lb-podium-col ${isFirst ? "lb-podium-col-first" : ""}`} style={{ order: cfg.order }}>
                                            {/* Avatar */}
                                            <div className="lb-avatar-wrap">
                                                <div className={`lb-avatar lb-avatar-gradient-${leaderIdx} ${isFirst ? "lb-avatar-lg" : ""}`}>
                                                    {leader.studentName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="lb-medal">
                                                    {leaderIdx === 0 ? (
                                                        <Trophy className="w-5 h-5 text-amber-300" />
                                                    ) : leaderIdx === 1 ? (
                                                        <Medal className="w-5 h-5 text-slate-200" />
                                                    ) : (
                                                        <Award className="w-5 h-5 text-orange-300" />
                                                    )}
                                                </span>
                                            </div>
                                            {/* Name */}
                                            <div className="lb-podium-name-wrap">
                                                <p className={`lb-podium-name ${isFirst ? "lb-podium-name-lg" : ""}`}>{leader.studentName}</p>
                                                <p className="lb-podium-attempts">{leader.attempts} attempts</p>
                                            </div>
                                            {/* Score pill */}
                                            <div className={`lb-score-pill lb-score-pill-${leaderIdx}`} style={{ marginTop: "14px" }}>
                                                {leader.averageScore}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Full Rankings Table ── */}
                    {remainingLeaders.length > 0 && (
                        <div className="lb-table-card mb-8">
                            <div className="lb-table-header">
                                <div>
                                    <h3 className="lb-table-title">Full Rankings</h3>
                                    <p className="lb-table-sub">Positions 4 and beyond</p>
                                </div>
                                <span className="lb-count-badge">{remainingLeaders.length} students</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="lb-thead-row">
                                            <th className="lb-th">Rank</th>
                                            <th className="lb-th">Student</th>
                                            <th className="lb-th">Attempts</th>
                                            <th className="lb-th">Avg Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {remainingLeaders.map((leader, index) => {
                                            const isCurrentUser = leader.studentName === name;

                                            return (
                                                <tr
                                                    key={index}
                                                    className="lb-tr"
                                                    style={isCurrentUser ? { background: "rgba(255,216,107,0.08)", border: "1px solid rgba(255,216,107,0.12)", boxShadow: "0 0 24px rgba(255,216,107,0.10)" } : {}}
                                                >
                                                    <td className="lb-td">
                                                        <span className="lb-rank-badge">{index + 4}</span>
                                                    </td>
                                                    <td className="lb-td">
                                                        <div className="lb-student-cell">
                                                            <div className="lb-student-avatar">
                                                                {leader.studentName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="lb-student-name">{leader.studentName}</span>
                                                                {isCurrentUser && (
                                                                    <span style={{ background: "rgba(255,216,107,0.12)", color: "#fde68a", padding: "3px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>YOU</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="lb-td">
                                                        <span className="lb-attempts-val">{leader.attempts}</span>
                                                    </td>
                                                    <td className="lb-td">
                                                        <span className="lb-score-badge">{leader.averageScore}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {leaders.length === 0 && (
                        <div className="lb-empty-card">
                            <div className="lb-empty-icon-wrap premium-empty-icon">
                                <Trophy className="w-16 h-16 text-amber-300/70" />
                            </div>
                            <h3 className="lb-empty-title">No Rankings Yet</h3>
                            <p className="lb-empty-sub">
                                Complete exams to appear on the leaderboard and compete with other students.
                            </p>
                            <button
                                onClick={() => navigate("/student-dashboard")}
                                className="premium-btn-primary mt-6"
                            >
                                Browse Exams
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;