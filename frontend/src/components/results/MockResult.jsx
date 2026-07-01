import React from "react";
import { BarChart3 } from  "lucide-react";
function MockResult({
    percentage,
    correctAnswers,
    wrong,
    totalQuestions,
    violations,
    navigate
}) {

    return (

        <div className="premium-root result-shell">
            <div className="result-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div>
                       <p className="result-badge">
                            Mock Analysis
                        </p>

                       <h1 className="result-title flex items-center gap-4"><span>Performance Review</span><span className="result-title-icon"><BarChart3 className="w-7 h-7" /></span></h1>

                    </div>

                    <div className="text-right">

                        <p className="result-score">
                            {percentage}%
                        </p>

                        <p className="result-score-label">
                            Final Score
                        </p>

                    </div>

                </div>

                <div className="result-stats-grid">

                    <div className="result-stat-card">
                        <p className="text-3xl font-black text-amber-200">
                            {correctAnswers}
                        </p>
                        <p className="text-white/50 mt-2">
                            Correct
                        </p>
                    </div>

                    <div className="activity-violation-card premium-shine p-7">
                        <p className="result-stat-value text-red-400">
                            {wrong}
                        </p>
                       <p className="result-stat-label">
                            Wrong
                        </p>
                    </div>

                    <div className="activity-violation-card premium-shine p-7">
                        <p className="text-3xl font-black text-cyan-300">
                            {totalQuestions}
                        </p>
                        <p className="result-stat-label">
                            Questions
                        </p>
                    </div>

                    <div className="activity-violation-card premium-shine p-7">
                        <p className="text-3xl font-black text-rose-300">
                            {violations}
                        </p>
                        <p className="result-stat-label">
                            Violations
                        </p>
                    </div>

                </div>

                <div className="result-feedback-card">

                    <h2 className="result-feedback-title">
                        Mock Exam Feedback
                    </h2>

                    <p className="result-feedback-text">
                        Mock exams simulate real examination environments.
                        Analyze your performance, reduce violations, and improve
                        time efficiency before attempting the main exam.
                    </p>

                </div>

                <button
                    onClick={() => navigate("/student-dashboard")}
                    className="result-action-btn"
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default MockResult;