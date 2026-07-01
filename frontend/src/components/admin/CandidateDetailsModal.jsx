import React from "react";
import "../../styles/candidateDetailsModal.css";
import { CheckCircle2, XCircle } from "lucide-react";

function CandidateDetailsModal({ open, onClose, data }) {
    if (!open || !data) return null;

    const violations = data?.violationTimelineJson ? JSON.parse(data.violationTimelineJson) : [];
    const questions = data?.questionsJson ? JSON.parse(data.questionsJson) : [];
    const answers = data?.answersJson ? JSON.parse(data.answersJson) : {};

    const isPassed = data.percentage >= 40;

    const overviewCards = [
        { label: "Score", value: data.score },
        { label: "Percentage", value: `${data.percentage}%` },
        { label: "Result", value: isPassed ? "PASS" : "FAIL" }
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="candidate-modal custom-scrollbar">
                
                {/* ─── MODAL MAIN HEADER ─── */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                    <div>
                        <div className="hero-accent mb-3">STUDENT ANALYTICS</div>
                        <h2 className="candidate-report-title">Candidate Report</h2>
                        <p className="candidate-report-subtitle">
                            {data.studentName} &bull; {data.examTitle}
                        </p>
                    </div>
                    <button className="premium-btn-secondary self-start sm:self-center" onClick={onClose}>
                        Close
                    </button>
                </div>

                {/* ─── OVERVIEW METRICS GRID ─── */}
                <div className="modal-stats-grid">
                    {overviewCards.map((card) => (
                        <div key={card.label} className="modal-stat-card">
                            <div className="modal-stat-label">{card.label}</div>
                            <div className="modal-stat-value">
                                {card.label === "Result" ? (
                                    <span className={isPassed ? "pass-badge" : "fail-badge"}>
                                        {card.value}
                                    </span>
                                ) : (
                                    card.value
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── DIV 1: CANDIDATE INFORMATION ─── */}
                <div className="section-block">
                    <h3 className="modal-section-title">Candidate Information</h3>
                    <div className="candidate-info-grid">
                        <div>
                            <div className="candidate-info-label">Name</div>
                            <div className="candidate-info-value">{data.studentName}</div>
                        </div>
                        <div>
                            <div className="candidate-info-label">Email</div>
                            <div className="candidate-info-value">{data.email}</div>
                        </div>
                        <div>
                            <div className="candidate-info-label">Exam Profile</div>
                            <div className="candidate-info-value">{data.examTitle}</div>
                        </div>
                        <div>
                            <div className="candidate-info-label">Total Questions</div>
                            <div className="candidate-info-value">{data.totalQuestions}</div>
                        </div>
                    </div>
                </div>

                {/* ─── DIV 2: EXAM TIMELINE (SIDE-BY-SIDE ROW) ─── */}
                <div className="section-block">
                    <h3 className="modal-section-title">Exam Timeline</h3>
                    <div className="timeline-grid timeline-grid-4">
                        <div className="timeline-card">
                            <span>Started At</span>
                            <h4>{new Date(data.startedAt).toLocaleString("en-GB")}</h4>
                        </div>
                        <div className="timeline-card">
                            <span>Submitted At</span>
                            <h4>{new Date(data.submittedAt).toLocaleString("en-GB")}</h4>
                        </div>
                        <div className="timeline-card">
                            <span>Duration</span>
                            <h4>{data.duration || "N/A"}</h4>
                        </div>

                        <div className="timeline-card">
                            <span>Violations</span>
                            <h4>{violations.length}</h4>
                        </div>

                    </div>
                </div>

                {/* ─── DIV 3: VIOLATION TIMELINE ─── */}
                <div className="section-block">
                    <h3 className="modal-section-title">Violation Timeline</h3>
                    {violations.length === 0 ? (
                        <div className="no-violations">No violations detected</div>
                    ) : (
                        <div className="space-y-3">
                            {violations.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                    <div className="font-semibold text-red-200 text-sm">{item.reason}</div>
                                    <div className="text-xs text-gray-400 font-medium">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── DIV 4: FACE VERIFICATION ─── */}
                <div className="section-block">
                    <h3 className="modal-section-title">Face Verification</h3>
                    <div className="face-grid">
                        <div>
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Start Face Capture</p>
                            {data.startFaceImage ? (
                                <img src={data.startFaceImage} alt="Start Snapshot" className="face-image" />
                            ) : (
                                <div className="text-gray-500 text-sm italic p-8 bg-black/20 rounded-xl border border-white/5 text-center">No snapshot capture recorded</div>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">End Face Capture</p>
                            {data.endFaceImage ? (
                                <img src={data.endFaceImage} alt="End Snapshot" className="face-image" />
                            ) : (
                                <div className="text-gray-500 text-sm italic p-8 bg-black/20 rounded-xl border border-white/5 text-center">No snapshot capture recorded</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── DIV 5: QUESTION REVIEW ─── */}
                <div className="section-block">
                    <h3 className="modal-section-title">Question Review</h3>
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const studentAnswer = answers[question.id];
                            const correct = studentAnswer === question.correctAnswer;

                            return (
                                <div key={question.id} className="review-card">
                                    <div className="question-badge">
                                        Q{index + 1}. {question.questionText}
                                    </div>
                                    <div className="review-grid">
                                        <div>
                                            <div className="candidate-info-label">Student Response</div>
                                            <div className={`candidate-info-value ${correct ? "text-green-400" : "text-red-400"}`}>
                                                {studentAnswer || "[No Answer Selected]"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="candidate-info-label">Correct Key</div>
                                            <div className="candidate-info-value text-green-400">{question.correctAnswer}</div>
                                        </div>
                                       <div className="review-status"><span className={correct ? "correct-pill" : "wrong-pill"}>{correct ? (<><CheckCircle2 size={14} />CORRECT</>) : (<><XCircle size={14} />WRONG</>)}</span></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CandidateDetailsModal;