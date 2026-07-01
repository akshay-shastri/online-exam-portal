import React from "react";

function PracticeResult({
    percentage,
    correctAnswers,
    wrong,
    totalQuestions,
    navigate,
    examId
}) {
    return (
        <div className="premium-root min-h-screen flex items-center justify-center p-6">
            <div className="premium-create-exam-card premium-shine w-full max-w-4xl p-8 sm:p-10 rounded-[32px] border border-white/[0.06]">
                <div className="text-center">
                    <p className="text-cyan-300 text-sm font-semibold tracking-[0.22em] uppercase">
                        Practice Result
                    </p>

                    <h1 className="text-5xl font-black text-white mt-4 tracking-tight">
                        Keep Practicing 🚀
                    </h1>

                    <p className="text-white/60 mt-4 text-lg">
                        Practice exams help improve speed and accuracy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="activity-violation-card premium-shine p-8 text-center">
                        <p className="text-4xl font-black text-cyan-300">
                            {percentage}%
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            Accuracy
                        </p>
                    </div>

                    <div className="activity-violation-card premium-shine p-8 text-center">
                        <p className="text-4xl font-black text-amber-200">
                            {correctAnswers}
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            Correct
                        </p>
                    </div>

                    <div className="activity-violation-card premium-shine p-8 text-center">
                        <p className="text-4xl font-black text-red-400">
                            {wrong}
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            Wrong
                        </p>
                    </div>
                </div>

                <div className="premium-create-exam-card premium-shine mt-12 p-8 rounded-[28px] border border-white/[0.06]">
                    <h2 className="text-2xl font-bold text-[#ffe27a]">
                        Practice Insights
                    </h2>

                    <ul className="mt-5 space-y-4 text-white/68 leading-7">
                        <li>
                            • Attempt more practice exams regularly
                        </li>
                        <li>
                            • Focus on weak questions and accuracy
                        </li>
                        <li>
                            • Improve time management skills
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mt-12">
                    <button
                        onClick={() => navigate("/student-dashboard")}
                        className="premium-btn-secondary flex-1 h-14"
                    >
                        Back to Dashboard
                    </button>

                    <button
                        onClick={() => {
                            navigate(`/exam/${examId}`, {
                                replace: true
                            });
                            window.location.reload();
                        }}
                        className="premium-button premium-shine flex-1 h-14"
                    >
                        Retry Practice
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PracticeResult;