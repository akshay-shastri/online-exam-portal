import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/dashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");

    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exams, setExams] = useState([]);

    const [selectedExamId, setSelectedExamId] = useState("");

    const [questionText, setQuestionText] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");

    const [examQuestions, setExamQuestions] = useState([]);

    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const [editingQuestion, setEditingQuestion] = useState(null);

    const [editQuestionText, setEditQuestionText] = useState("");

    const [editOptionA, setEditOptionA] = useState("");

    const [editOptionB, setEditOptionB] = useState("");

    const [editOptionC, setEditOptionC] = useState("");

    const [editOptionD, setEditOptionD] = useState("");

    const [editCorrectAnswer, setEditCorrectAnswer] = useState("");

    const [violations, setViolations] = useState([]);

    const [results, setResults] = useState([]);

    const [liveSessions, setLiveSessions] = useState([]);

    // ── Analytics derived values (UI only) ──
    const activeStudents = liveSessions.filter(s => s.status === 'ACTIVE').length;
    const avgScore = results.length > 0
        ? parseFloat((results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length).toFixed(1))
        : 0;

    // ── Animated counter (RAF ease-out cubic) ──
    const useAnimatedCounter = (target, duration = 1100) => {
        const [display, setDisplay] = useState(0);
        const rafRef = useRef(null);
        useEffect(() => {
            const start = performance.now();
            const animate = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                const isFloat = target % 1 !== 0;
                setDisplay(isFloat
                    ? parseFloat((target * eased).toFixed(1))
                    : Math.round(target * eased)
                );
                if (p < 1) rafRef.current = requestAnimationFrame(animate);
            };
            rafRef.current = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(rafRef.current);
        }, [target, duration]);
        return display;
    };

    const animExams      = useAnimatedCounter(exams.length);
    const animActive     = useAnimatedCounter(activeStudents);
    const animViolations = useAnimatedCounter(violations.length);
    const animAvgScore   = useAnimatedCounter(avgScore);

    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


    useEffect(() => {

    fetchExams();

    fetchViolations();

    fetchResults();

    fetchLiveSessions();

}, []);

useEffect(() => {
    const interval = setInterval(() => { fetchLiveSessions(); }, 5000);
    return () => clearInterval(interval);
}, []);


    const fetchExams = async () => {

        try {

            const response = await API.get("/exams");

            setExams(response.data);

        } catch (error) {

            console.log(error);
        }
    };

const fetchViolations = async () => {

    try {

        const response =
            await API.get("/violations");

        setViolations(response.data);

    } catch (error) {

        console.log(error);
    }
};

const fetchResults = async () => {

    try {

        const response =
            await API.get(
                "/results"
            );

        setResults(
            response.data
        );

        console.log(response.data);

    } catch (error) {

        console.log(error);
    }
};

const fetchLiveSessions = async () => {
    try {
        const response = await API.get("/monitor/live");
        setLiveSessions(response.data || []);
    } catch (error) {
        console.log(error);
    }
};

    const addQuestion = async () => {

        if (loadingQuestion) return;

        setLoadingQuestion(true);

        try {

            const response = await API.post("/questions", {
                questionText,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                exam: {
                    id: selectedExamId
                }
            });

            toast.success("Question added successfully!");

            console.log(response.data);

        } catch (error) {

            toast.error("Failed to add question. Please try again.");

        } finally {

            setLoadingQuestion(false);
        }
    };

    const handleBulkUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!selectedExamId) {

        toast.error(
            "Please select an exam first."
        );

        return;
    }

    try {

        const data =
            await file.arrayBuffer();

        const workbook =
            XLSX.read(data);

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const jsonData =
            XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {

            toast.error(
                "Excel file is empty."
            );

            return;
        }

        for (const row of jsonData) {

            await API.post(
                "/questions",
                {
                    questionText:
                        row.Question,

                    optionA:
                        row.OptionA,

                    optionB:
                        row.OptionB,

                    optionC:
                        row.OptionC,

                    optionD:
                        row.OptionD,

                    correctAnswer:
                        row.CorrectAnswer,

                    exam: {
                        id: selectedExamId
                    }
                }
            );
        }

        toast.success(
            `${jsonData.length} questions uploaded successfully!`
        );

        fetchQuestions(
            selectedExamId
        );

    } catch (error) {

        console.log(error);

        toast.error(
            "Bulk upload failed."
        );
    }
};

    const fetchQuestions = async (examId) => {

    if (!examId) return;

    setLoadingQuestions(true);

    try {

        const response =
            await API.get(`/questions/${examId}`);

        setExamQuestions(response.data);

    } catch (error) {

        console.log(error);

        toast.error(
            "Failed to load questions."
        );

    } finally {

        setLoadingQuestions(false);
    }
};

const deleteQuestion = async (id) => {

    try {

        await API.delete(`/questions/${id}`);

        toast.success(
            "Question deleted successfully!"
        );

        fetchQuestions(selectedExamId);

    } catch (error) {

        console.log(error);

        toast.error(
            "Failed to delete question."
        );
    }
};

const openEditModal = (question) => {

    setEditingQuestion(question);

    setEditQuestionText(
        question.questionText
    );

    setEditOptionA(question.optionA);

    setEditOptionB(question.optionB);

    setEditOptionC(question.optionC);

    setEditOptionD(question.optionD);

    setEditCorrectAnswer(
        question.correctAnswer
    );
};

const updateQuestion = async () => {

    try {

        await API.put(
            `/questions/${editingQuestion.id}`,
            {
                questionText: editQuestionText,
                optionA: editOptionA,
                optionB: editOptionB,
                optionC: editOptionC,
                optionD: editOptionD,
                correctAnswer: editCorrectAnswer
            }
        );

        toast.success(
            "Question updated successfully!"
        );

        setEditingQuestion(null);

        fetchQuestions(selectedExamId);

    } catch (error) {

        console.log(error);

        toast.error(
            "Failed to update question."
        );
    }
};



    const deleteExam = (examId, examTitle) => {
        setDeleteTarget({ id: examId, title: examTitle });
    };

    const confirmDeleteExam = async () => {
        const { id: examId, title: examTitle } = deleteTarget;
        setDeleteTarget(null);
        setDeletingId(examId);

        try {
            await API.delete(`/exams/${examId}`);
            toast.success(`"${examTitle}" deleted successfully.`);
            fetchExams();
        } catch (error) {
            toast.error("Failed to delete exam. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const logout = () => {
        setShowLogoutConfirm(true);
        setShowDropdown(false);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-blue-300";

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
                    <div className="logo-text-primary">Smart Exam Portal</div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                                    <div className="dropdown-item-icon">🚪</div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-6 md:px-12 py-10 max-w-screen-2xl mx-auto">

                {/* Hero Banner */}
                <div className="mb-10 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Admin Dashboard</span>
                        <h2 className="hero-title">Welcome back, {name} 👋</h2>
                        <p className="hero-sub">Manage your exams, questions, and monitor student activity from one place.</p>
                    </div>
                </div>

                {/* Analytics Summary Cards */}
                <div className="ad-analytics-grid mb-10">

                    {/* Total Exams */}
                    <div className="ad-stat-card" style={{'--ad-glow':'rgba(124,58,237,0.45)','--ad-border':'rgba(124,58,237,0.22)'}}>
                        <div className="h-0.5 w-full" style={{background:'linear-gradient(90deg,#7c3aed,#a855f7)'}} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-5">
                                <div className="ad-stat-icon" style={{background:'rgba(124,58,237,0.18)',border:'1px solid rgba(124,58,237,0.3)',boxShadow:'0 0 18px rgba(124,58,237,0.25)'}}>
                                    <svg width="18" height="18" fill="none" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="ad-stat-trend" style={{color:'#c4b5fd',background:'rgba(124,58,237,0.12)',border:'1px solid rgba(124,58,237,0.2)'}}>
                                    Total
                                </span>
                            </div>
                            <p className="ad-stat-value" style={{color:'#e9d5ff'}}>{animExams}</p>
                            <p className="ad-stat-label">Total Exams</p>
                            <div className="ad-stat-bar-track">
                                <div className="ad-stat-bar-fill" style={{width:'100%',background:'linear-gradient(90deg,#7c3aed,#a855f7)'}} />
                            </div>
                        </div>
                    </div>

                    {/* Active Students */}
                    <div className="ad-stat-card" style={{'--ad-glow':'rgba(34,197,94,0.4)','--ad-border':'rgba(34,197,94,0.2)'}}>
                        <div className="h-0.5 w-full" style={{background:'linear-gradient(90deg,#16a34a,#22c55e)'}} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-5">
                                <div className="ad-stat-icon" style={{background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',boxShadow:'0 0 18px rgba(34,197,94,0.2)'}}>
                                    <svg width="18" height="18" fill="none" stroke="#86efac" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                    </svg>
                                </div>
                                <span className="ad-stat-trend" style={{color:'#86efac',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)'}}>
                                    {activeStudents > 0 ? 'Live' : 'Idle'}
                                </span>
                            </div>
                            <p className="ad-stat-value" style={{color:'#86efac'}}>{animActive}</p>
                            <p className="ad-stat-label">Active Students</p>
                            <div className="ad-stat-bar-track">
                                <div className="ad-stat-bar-fill" style={{width: exams.length > 0 ? `${Math.min((activeStudents / Math.max(exams.length, 1)) * 100, 100)}%` : '0%', background:'linear-gradient(90deg,#16a34a,#22c55e)'}} />
                            </div>
                        </div>
                    </div>

                    {/* Total Violations */}
                    <div className="ad-stat-card" style={{'--ad-glow':'rgba(239,68,68,0.4)','--ad-border':'rgba(239,68,68,0.2)'}}>
                        <div className="h-0.5 w-full" style={{background:'linear-gradient(90deg,#dc2626,#ef4444)'}} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-5">
                                <div className="ad-stat-icon" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.22)',boxShadow:'0 0 18px rgba(239,68,68,0.18)'}}>
                                    <svg width="18" height="18" fill="none" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <span className="ad-stat-trend" style={{color:'#fca5a5',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}>
                                    {violations.length === 0 ? 'Clean' : 'Flagged'}
                                </span>
                            </div>
                            <p className="ad-stat-value" style={{color:'#fca5a5'}}>{animViolations}</p>
                            <p className="ad-stat-label">Total Violations</p>
                            <div className="ad-stat-bar-track">
                                <div className="ad-stat-bar-fill" style={{width: violations.length > 0 ? '100%' : '0%', background:'linear-gradient(90deg,#dc2626,#ef4444)'}} />
                            </div>
                        </div>
                    </div>

                    {/* Average Score */}
                    <div className="ad-stat-card" style={{'--ad-glow':'rgba(6,182,212,0.4)','--ad-border':'rgba(6,182,212,0.2)'}}>
                        <div className="h-0.5 w-full" style={{background:'linear-gradient(90deg,#0891b2,#06b6d4)'}} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-5">
                                <div className="ad-stat-icon" style={{background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.22)',boxShadow:'0 0 18px rgba(6,182,212,0.18)'}}>
                                    <svg width="18" height="18" fill="none" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                                <span className="ad-stat-trend" style={{color:'#67e8f9',background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.2)'}}>
                                    {results.length} Results
                                </span>
                            </div>
                            <p className="ad-stat-value" style={{color:'#67e8f9'}}>{animAvgScore}<span style={{fontSize:'18px',fontWeight:600,opacity:0.7}}>%</span></p>
                            <p className="ad-stat-label">Average Score</p>
                            <div className="ad-stat-bar-track">
                                <div className="ad-stat-bar-fill" style={{width:`${avgScore}%`,background:'linear-gradient(90deg,#0891b2,#06b6d4)'}} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Exams List */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">All Exams</h3>
                            <p className="text-sm mt-0.5" style={{color:'rgba(196,181,253,0.55)'}}>{exams.length} exam{exams.length !== 1 ? "s" : ""} created</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span style={{background:'rgba(124,58,237,0.18)',color:'#c4b5fd',border:'1px solid rgba(167,139,250,0.2)'}} className="text-xs font-semibold px-3 py-1.5 rounded-full">{exams.length} Total</span>
                            <button
                                onClick={() => navigate("/admin/create-exam")}
                                className="premium-btn-primary flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                Create Exam
                            </button>
                        </div>
                    </div>

                    {exams.length === 0 ? (
                        <div className="text-center py-20 rounded-2xl" style={{border:'1px dashed rgba(167,139,250,0.2)',background:'rgba(124,58,237,0.04)'}}>
                            <p className="text-white font-semibold">No exams yet</p>
                            <p className="text-sm mt-1" style={{color:'rgba(196,181,253,0.5)'}}>Click "+ Create Exam" to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {exams.map((exam, index) => {
                                const gradients = [
                                    'linear-gradient(90deg,#7c3aed,#d946ef)',
                                    'linear-gradient(90deg,#9f7aea,#fb7185)',
                                    'linear-gradient(90deg,#06b6d4,#7c3aed)'
                                ];
                                return (
                                    <div
                                        key={exam.id}
                                        className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1"
                                        style={{background:'linear-gradient(160deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.012) 100%)',border:'1px solid rgba(255,255,255,0.07)',boxShadow:'0 4px 24px rgba(0,0,0,0.35)'}}
                                    >
                                        <div className="h-1 w-full" style={{background: gradients[index % 3]}} />
                                        <div className="p-5 flex flex-col gap-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.35),rgba(217,70,239,0.2))',border:'1px solid rgba(167,139,250,0.35)',color:'#e9d5ff',boxShadow:'0 0 16px rgba(124,58,237,0.3),inset 0 1px 0 rgba(255,255,255,0.08)'}}>
                                                    {exam.id}
                                                </div>
                                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:'rgba(124,58,237,0.12)',border:'1px solid rgba(167,139,250,0.18)',color:'rgba(196,181,253,0.8)'}}>
                                                    ⏱ {exam.duration} mins
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-white text-base leading-snug">{exam.title}</h3>

                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    onClick={() => navigate(`/admin/exam/${exam.id}`)}
                                                    className="premium-btn-primary flex-1 py-2.5 text-sm"
                                                >
                                                    View Exam
                                                </button>
                                                <button
                                                    onClick={() => deleteExam(exam.id, exam.title)}
                                                    disabled={deletingId === exam.id}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                                    style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#fca5a5'}}
                                                    title="Delete Exam"
                                                >
                                                    {deletingId === exam.id ? (
                                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Confirmation Modals — inside root div */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Exam"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This will also permanently delete all its questions.`}
                confirmLabel="Delete"
                confirmClass="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                onConfirm={confirmDeleteExam}
                onCancel={() => setDeleteTarget(null)}
            />

            <ConfirmModal
                isOpen={showLogoutConfirm}
                title="Logout"
                message="Are you sure you want to log out of your admin account?"
                confirmLabel="Logout"
                confirmClass="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />

            {editingQuestion && (

<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Question
        </h2>

        <div className="space-y-4">

            <input
                type="text"
                value={editQuestionText}
                onChange={(e) =>
                    setEditQuestionText(e.target.value)
                }
                className={inputClass}
                placeholder="Question"
            />

            <input
                type="text"
                value={editOptionA}
                onChange={(e) =>
                    setEditOptionA(e.target.value)
                }
                className={inputClass}
                placeholder="Option A"
            />

            <input
                type="text"
                value={editOptionB}
                onChange={(e) =>
                    setEditOptionB(e.target.value)
                }
                className={inputClass}
                placeholder="Option B"
            />

            <input
                type="text"
                value={editOptionC}
                onChange={(e) =>
                    setEditOptionC(e.target.value)
                }
                className={inputClass}
                placeholder="Option C"
            />

            <input
                type="text"
                value={editOptionD}
                onChange={(e) =>
                    setEditOptionD(e.target.value)
                }
                className={inputClass}
                placeholder="Option D"
            />

            <input
                type="text"
                value={editCorrectAnswer}
                onChange={(e) =>
                    setEditCorrectAnswer(e.target.value)
                }
                className={inputClass}
                placeholder="Correct Answer"
            />

        </div>

        <div className="flex justify-end gap-3 mt-8">

            <button
                onClick={() =>
                    setEditingQuestion(null)
                }
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold"
            >
                Cancel
            </button>

            <button
                onClick={updateQuestion}
                className="premium-btn-primary px-5 py-2.5 text-sm font-semibold"
            >
                Save Changes
            </button>

        </div>

    </div>

</div>
)}



        </div>
    );
}

export default AdminDashboard;
