import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

function ExamPage() {

    const { examId } = useParams();

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [questionsError, setQuestionsError] = useState(false);

    const [timeLeft, setTimeLeft] = useState(300);

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    useEffect(() => {

        fetchQuestions();

    }, []);

    useEffect(() => {

        if (submitted) {
            return;
        }

        if (timeLeft <= 0) {

            submitExam();

            return;
        }

        const timer = setInterval(() => {

            setTimeLeft((prevTime) => prevTime - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft, submitted]);

    const fetchQuestions = async () => {

        setQuestionsLoading(true);
        setQuestionsError(false);

        try {

            const response = await API.get(`/questions/${examId}`);

            setQuestions(response.data);

        } catch (error) {

            console.log(error);
            setQuestionsError(true);
            toast.error("Failed to load questions. Please go back and try again.");
        } finally {

            setQuestionsLoading(false);
        }
    };

    const handleOptionSelect = (questionId, option) => {

        if (submitted) {
            return;
        }

        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    const submitExam = async () => {

        if (submitted || submitting) {
            return;
        }

        setShowSubmitConfirm(false);
        setSubmitting(true);

        let correctAnswers = 0;

        questions.forEach((question) => {

            if (answers[question.id] === question.correctAnswer) {

                correctAnswers++;
            }
        });

        setSubmitted(true);

        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0
            ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2))
            : 0;

        const studentName = localStorage.getItem("name") || "Unknown";
        const examTitle = questions.length > 0 && questions[0].exam
            ? questions[0].exam.title
            : `Exam ${examId}`;

        try {
            await API.post("/results", {
                studentName,
                examTitle,
                score: correctAnswers,
                totalQuestions,
                percentage
            });
        } catch (error) {
            console.log("Failed to save result:", error);
        }

        navigate("/result", {
            state: {
                score: correctAnswers,
                totalQuestions
            }
        });
    };

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    const answeredCount = Object.keys(answers).length;

    const isWarning = timeLeft <= 60;
    const isCritical = timeLeft <= 30;

    const optionLabels = ["A", "B", "C", "D"];

    return (

        <div className="min-h-screen bg-[#f0f4ff]">

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                                Smart Exam Portal
                            </h1>
                            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Examination in Progress</p>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-lg transition-all duration-500 shadow-md ${
                        isCritical
                            ? "bg-red-500 text-white shadow-red-200 animate-pulse"
                            : isWarning
                            ? "bg-orange-400 text-white shadow-orange-200"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-200"
                    }`}>
                        <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="tabular-nums tracking-wider">
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </span>
                    </div>

                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Loading state */}
                {questionsLoading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
                        <p className="text-sm text-gray-400 font-medium">Loading questions...</p>
                    </div>
                )}

                {/* Error state */}
                {!questionsLoading && questionsError && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-red-200 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-semibold text-base">Failed to load questions</p>
                        <p className="text-gray-400 text-sm mt-1 mb-5">Something went wrong. Please go back and try again.</p>
                        <button
                            onClick={() => navigate("/student-dashboard")}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Empty state — exam has no questions */}
                {!questionsLoading && !questionsError && questions.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-blue-200 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-semibold text-base">No questions found</p>
                        <p className="text-gray-400 text-sm mt-1 mb-5">This exam has no questions yet. Please check back later.</p>
                        <button
                            onClick={() => navigate("/student-dashboard")}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Main exam content */}
                {!questionsLoading && !questionsError && questions.length > 0 && (
                <>
                <div className="mb-8 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl px-8 py-7 shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-1">Exam Questions</p>
                            <h2 className="text-2xl font-extrabold text-white leading-tight">Answer all questions carefully</h2>
                            <p className="text-blue-100 text-sm mt-1">Select one option per question before submitting.</p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/20">
                                <p className="text-2xl font-extrabold text-white">{questions.length}</p>
                                <p className="text-blue-100 text-xs font-medium mt-0.5">Total</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/20">
                                <p className="text-2xl font-extrabold text-white">{answeredCount}</p>
                                <p className="text-blue-100 text-xs font-medium mt-0.5">Answered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {questions.length > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{answeredCount} / {questions.length} answered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                                style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Questions */}
                <div className="space-y-6">

                    {questions.map((question, index) => (

                        <div
                            key={question.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                        >
                            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-500" />

                            <div className="p-7">

                                <div className="flex items-start gap-4 mb-6">
                                    <span className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                        {index + 1}
                                    </span>
                                    <h2 className="text-base font-semibold text-gray-800 leading-relaxed pt-1.5">
                                        {question.questionText}
                                    </h2>
                                </div>

                                <div className="space-y-3 pl-1">

                                    {[question.optionA, question.optionB, question.optionC, question.optionD].map((option, i) => {

                                        const isSelected = answers[question.id] === option;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleOptionSelect(question.id, option)}
                                                disabled={submitted}
                                                className={`w-full text-left flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                                                        : "border-gray-100 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
                                                } ${submitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                                            >
                                                <span className={`shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-200 ${
                                                    isSelected
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white border border-gray-200 text-gray-500"
                                                }`}>
                                                    {optionLabels[i]}
                                                </span>
                                                <span>{option}</span>
                                                {isSelected && (
                                                    <span className="ml-auto shrink-0">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Submit Button */}
                {!submitted && (

                    <div className="mt-10 flex flex-col items-center gap-3">
                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            disabled={submitted || submitting}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-14 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-lg hover:shadow-emerald-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Exam
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-400">
                            {questions.length - answeredCount > 0
                                ? `${questions.length - answeredCount} question${questions.length - answeredCount !== 1 ? "s" : ""} unanswered`
                                : "All questions answered — ready to submit!"}
                        </p>
                    </div>
                )}

            </>)}

            </div>

            <ConfirmModal
                isOpen={showSubmitConfirm}
                title="Submit Exam"
                message={answeredCount < questions.length
                    ? `You have ${questions.length - answeredCount} unanswered question${questions.length - answeredCount !== 1 ? "s" : ""}. Are you sure you want to submit?`
                    : "Are you sure you want to submit your exam? This action cannot be undone."}
                confirmLabel="Submit"
                confirmClass="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                onConfirm={submitExam}
                onCancel={() => setShowSubmitConfirm(false)}
            />

        </div>
    );
}

export default ExamPage;
