import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {

    const location = useLocation();

    const navigate = useNavigate();

    const score = location.state?.score || 0;

    const totalQuestions = location.state?.totalQuestions || 0;

    const percentage =
        totalQuestions > 0
            ? ((score / totalQuestions) * 100).toFixed(2)
            : 0;

    const passed = percentage >= 40;

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const wrong = totalQuestions - score;
    const accuracy = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(1) : 0;

    const insightStats = [
        {
            label: "Correct Answers",
            value: score,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            bar: "bg-gradient-to-r from-emerald-400 to-teal-500",
            barWidth: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
        },
        {
            label: "Wrong Answers",
            value: wrong,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "text-red-500",
            bg: "bg-red-50",
            border: "border-red-100",
            bar: "bg-gradient-to-r from-red-400 to-rose-500",
            barWidth: totalQuestions > 0 ? (wrong / totalQuestions) * 100 : 0,
        },
        {
            label: "Accuracy",
            value: `${accuracy}%`,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            bar: "bg-gradient-to-r from-blue-400 to-indigo-500",
            barWidth: parseFloat(accuracy),
        },
        {
            label: "Total Questions",
            value: totalQuestions,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            bar: "bg-gradient-to-r from-indigo-400 to-purple-500",
            barWidth: 100,
        },
    ];

    return (

        <div className={`min-h-screen px-4 py-10 relative overflow-hidden ${passed ? "bg-[#f0f7ff]" : "bg-[#fff4f4]"}`}>

            {/* Background blobs */}
            <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${passed ? "bg-blue-300" : "bg-red-200"}`} />
            <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none ${passed ? "bg-indigo-300" : "bg-orange-200"}`} />

            {/* Portal branding */}
            <div className="flex items-center justify-center gap-2.5 mb-10 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    Smart Exam Portal
                </span>
            </div>

            {/* 2-column layout */}
            <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* ── LEFT: Result Card ── */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                    <div className={`h-2 w-full ${passed ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gradient-to-r from-red-400 to-rose-500"}`} />

                    <div className={`px-8 pt-8 pb-6 text-center ${passed ? "bg-gradient-to-b from-blue-50 to-white" : "bg-gradient-to-b from-red-50 to-white"}`}>
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${passed ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-500"}`}>
                            <span>{passed ? "✦" : "✕"}</span>
                            Exam Result
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">
                            {passed ? "Congratulations!" : "Better Luck Next Time"}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1.5">
                            {passed ? "You have successfully passed the exam." : "You did not meet the passing criteria."}
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-8 py-6">

                        {/* Score Ring */}
                        <div className="relative w-40 h-40 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke={passed ? "#e0e7ff" : "#fee2e2"} strokeWidth="10" />
                                <circle
                                    cx="60" cy="60" r="54"
                                    fill="none"
                                    stroke={passed ? "url(#passGrad)" : "url(#failGrad)"}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    style={{ transition: "stroke-dashoffset 1s ease" }}
                                />
                                <defs>
                                    <linearGradient id="passGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                    <linearGradient id="failGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f87171" />
                                        <stop offset="100%" stopColor="#fb7185" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-extrabold leading-none ${passed ? "text-blue-600" : "text-red-500"}`}>
                                    {percentage}%
                                </span>
                                <span className="text-xs text-gray-400 font-medium mt-1">Score</span>
                            </div>
                        </div>

                        {/* Mini stats */}
                        <div className="w-full grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100">
                                <p className="text-2xl font-extrabold text-gray-800">{score}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">Correct</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100">
                                <p className="text-2xl font-extrabold text-gray-800">{wrong}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">Wrong</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100">
                                <p className="text-2xl font-extrabold text-gray-800">{totalQuestions}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">Total</p>
                            </div>
                        </div>

                        {/* Pass/Fail badge */}
                        <div className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl mb-6 ${passed ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200" : "bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-200"}`}>
                            <span className="text-2xl">{passed ? "🎉" : "😔"}</span>
                            <span className="text-white text-xl font-extrabold tracking-widest uppercase">
                                {passed ? "PASSED" : "FAILED"}
                            </span>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => navigate("/student-dashboard")}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-blue-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Dashboard
                        </button>

                    </div>

                </div>

                {/* ── RIGHT: Exam Insights ── */}
                <div className="flex flex-col gap-6">

                    {/* Insights header card */}
                    <div className={`rounded-3xl px-8 py-7 shadow-xl relative overflow-hidden ${passed ? "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-blue-200" : "bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 shadow-red-200"}`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                        <div className="relative z-10">
                            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${passed ? "text-blue-100" : "text-red-100"}`}>Performance Summary</p>
                            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
                                Exam Insights
                            </h2>
                            <p className={`text-sm font-medium ${passed ? "text-blue-100" : "text-red-100"}`}>
                                {passed
                                    ? "Great performance! Review your results below."
                                    : "Analyze your results and prepare better next time."}
                            </p>
                        </div>
                    </div>

                    {/* Stat cards with progress bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {insightStats.map((stat) => (
                            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</span>
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full ${stat.bar} transition-all duration-700`}
                                        style={{ width: `${stat.barWidth}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Motivational card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl shrink-0">{passed ? "🚀" : "📚"}</div>
                            <div>
                                <h3 className="text-base font-bold text-gray-800 mb-1">
                                    {passed ? "Keep up the momentum!" : "Don't give up!"}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {passed
                                        ? "You've demonstrated strong knowledge. Continue practicing to maintain and improve your score on future exams."
                                        : "Every attempt is a learning opportunity. Review the topics you found difficult and try again — improvement is just around the corner."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Passing criteria note */}
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/70 rounded-2xl border border-gray-100 shadow-sm">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-gray-400 font-medium">Passing criteria: 40% and above</p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResultPage;
