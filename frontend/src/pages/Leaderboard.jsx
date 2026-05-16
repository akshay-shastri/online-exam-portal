import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";

function Leaderboard() {

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

    const getMedal = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    const podiumConfig = [
        { order: 1, height: "h-28", bg: "from-yellow-400 to-amber-500", shadow: "shadow-amber-200 dark:shadow-amber-900/40", ring: "ring-yellow-300", label: "1st Place" },
        { order: 0, height: "h-20", bg: "from-slate-400 to-gray-500", shadow: "shadow-gray-200 dark:shadow-gray-900/40", ring: "ring-gray-300", label: "2nd Place" },
        { order: 2, height: "h-16", bg: "from-orange-400 to-amber-600", shadow: "shadow-orange-200 dark:shadow-orange-900/40", ring: "ring-orange-300", label: "3rd Place" },
    ];

    const topThree = leaders.slice(0, 3);
    const remainingLeaders = leaders.slice(3);

    return (
        <div className="premium-root min-h-screen">
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

            {loading && (

    <PremiumLoader
        title="Loading Leaderboard..."
        subtitle="Preparing student rankings and performance statistics."
        height="70vh"
    />

)}

            {!loading && (

                    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">

                {/* ── Hero ── */}
                <div className="lb-hero mb-10">
                    <div className="lb-hero-glow-tr" />
                    <div className="lb-hero-glow-bl" />
                    <div className="lb-hero-inner">
                        <div>
                            <div className="lb-hero-eyebrow">
                                <span className="lb-trophy-icon">🏆</span>
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

                {/* ── Loading ── */}
               {loading && (

    <PremiumLoader
        title="Loading Leaderboard..."
        subtitle="Preparing student rankings and performance statistics."
        height="70vh"
    />

)}

                {/* ── Podium — Top 3 ── */}
                {!loading && topThree.length > 0 && (
                    <div className="mb-10">
                        <p className="lb-section-label">Top Performers</p>

                        <div className="lb-podium-row">
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
                                            <span className="lb-medal">{getMedal(leaderIdx)}</span>
                                        </div>
                                        {/* Name */}
                                        <div className="lb-podium-name-wrap">
                                            <p className={`lb-podium-name ${isFirst ? "lb-podium-name-lg" : ""}`}>{leader.studentName}</p>
                                            <p className="lb-podium-attempts">{leader.attempts} attempts</p>
                                        </div>
                                        {/* Score pill */}
                                        <div className={`lb-score-pill lb-score-pill-${leaderIdx}`}>
                                            {leader.averageScore}
                                        </div>
                                        {/* Podium block */}
                                        <div className={`lb-podium-block lb-podium-block-${leaderIdx} ${cfg.height}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Full Rankings Table ── */}
                {!loading && remainingLeaders.length > 0 && (
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
                                    {remainingLeaders.map((leader, index) => (
                                        <tr key={index} className="lb-tr">
                                            <td className="lb-td">
                                                <span className="lb-rank-badge">{index + 4}</span>
                                            </td>
                                            <td className="lb-td">
                                                <div className="lb-student-cell">
                                                    <div className="lb-student-avatar">
                                                        {leader.studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="lb-student-name">{leader.studentName}</span>
                                                </div>
                                            </td>
                                            <td className="lb-td">
                                                <span className="lb-attempts-val">{leader.attempts}</span>
                                            </td>
                                            <td className="lb-td">
                                                <span className="lb-score-badge">{leader.averageScore}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && leaders.length === 0 && (
                    <div className="lb-empty-card">
                        <div className="lb-empty-icon-wrap premium-empty-icon">
                            <div className="text-6xl">🏆 </div>
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

                {/* ── Back button ── */}
                <button onClick={() => navigate("/student-dashboard")} className="premium-back-btn">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

            </div>
            )}
        </div>
    );
}

export default Leaderboard;
