import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 py-8">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl px-8 py-10 text-white shadow-2xl shadow-blue-900/30 mb-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🏆</span>
                                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Rankings</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">Student Leaderboard</h1>
                            <p className="text-blue-200 text-sm font-medium">Top performers across all examinations</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/20 shrink-0">
                            <p className="text-3xl font-black">{leaders.length}</p>
                            <p className="text-blue-200 text-xs font-semibold mt-0.5">Students Ranked</p>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative w-16 h-16 mb-5">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-blue-500 animate-spin" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading leaderboard...</p>
                    </div>
                )}

                {/* Podium — Top 3 */}
                {!loading && topThree.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 text-center">Top Performers</h2>

                        {/* Podium visual */}
                        <div className="flex items-end justify-center gap-4 mb-6">
                            {[1, 0, 2].map((leaderIdx) => {
                                const leader = topThree[leaderIdx];
                                if (!leader) return null;
                                const cfg = podiumConfig[leaderIdx];
                                const isFirst = leaderIdx === 0;
                                return (
                                    <div key={leaderIdx} className="flex flex-col items-center gap-3" style={{ order: cfg.order }}>
                                        {/* Avatar */}
                                        <div className={`relative ${isFirst ? "scale-110" : ""} transition-transform`}>
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cfg.bg} text-white flex items-center justify-center text-2xl font-black shadow-xl ${cfg.shadow} ring-4 ${cfg.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-950`}>
                                                {leader.studentName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -top-3 -right-2 text-xl">{getMedal(leaderIdx)}</div>
                                        </div>
                                        {/* Name */}
                                        <div className="text-center">
                                            <p className={`font-bold text-gray-800 dark:text-gray-100 ${isFirst ? "text-base" : "text-sm"} max-w-[90px] truncate`}>{leader.studentName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{leader.attempts} attempts</p>
                                        </div>
                                        {/* Score */}
                                        <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${cfg.bg} text-white text-sm font-black shadow-md`}>
                                            {leader.averageScore}
                                        </div>
                                        {/* Podium block */}
                                        <div className={`w-24 ${cfg.height} bg-gradient-to-b ${cfg.bg} rounded-t-2xl opacity-30 dark:opacity-20`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Remaining table */}
                {!loading && remainingLeaders.length > 0 && (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-black/30 border border-white/60 dark:border-gray-700/60 overflow-hidden mb-8">

                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">Full Rankings</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Positions 4 and beyond</p>
                            </div>
                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                                {remainingLeaders.length} students
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attempts</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {remainingLeaders.map((leader, index) => (
                                        <tr key={index} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-bold flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                                    {index + 4}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                        {leader.studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{leader.studentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{leader.attempts}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                                                    {leader.averageScore}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && leaders.length === 0 && (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-dashed border-blue-200 dark:border-blue-800/50 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
                            <span className="text-4xl">🏆</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Rankings Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                            Complete exams to appear on the leaderboard and compete with other students.
                        </p>
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={() => navigate("/student-dashboard")}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

            </div>
        </div>
    );
}

export default Leaderboard;
