import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import { LogOut, ArrowLeft, CheckCircle2, Plus, UploadCloud, Save } from "lucide-react";

function ExamQuestions() {
    const navigate = useNavigate();
    const { id } = useParams();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Add question form states
    const [questionText, setQuestionText] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    // Edit question form states
    const [editQuestionText, setEditQuestionText] = useState("");
    const [editOptionA, setEditOptionA] = useState("");
    const [editOptionB, setEditOptionB] = useState("");
    const [editOptionC, setEditOptionC] = useState("");
    const [editOptionD, setEditOptionD] = useState("");
    const [editCorrectAnswer, setEditCorrectAnswer] = useState("");

    // Delete confirmation
    const [deletingId, setDeletingId] = useState(null);

    const inputClass = "w-full bg-black/30 border border-amber-500/20 text-amber-100 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400/40 placeholder-amber-300/35 transition-all duration-300 hover:border-amber-400/30 backdrop-blur-xl";

    useEffect(() => {
        fetchExamAndQuestions();
    }, [id]);

    const fetchExamAndQuestions = async () => {
        setLoading(true);
        try {
            // Fetch all exams to get exam details
            const examResponse = await API.get("/exams");
            const exams = examResponse.data;
            const foundExam = exams.find(e => e.id === parseInt(id));

            if (!foundExam) {
                toast.error("Exam not found");
                navigate("/admin-dashboard");
                return;
            }

            setExam(foundExam);

            // Fetch questions for this exam
            const questionsResponse = await API.get(`/questions/${id}`);
            setQuestions(questionsResponse.data || []);
            console.log("QUESTIONS DATA:", questionsResponse.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load exam details");
            navigate("/admin-dashboard");
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = async () => {
        if (loadingQuestion) return;

        if (!questionText.trim()) {
            toast.error("Question text is required");
            return;
        }

        setLoadingQuestion(true);

        try {
            await API.post("/questions", {
                questionText,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                exam: { id: parseInt(id) }
            });

            toast.success("Question added successfully!");
            
            // Reset form
            setQuestionText("");
            setOptionA("");
            setOptionB("");
            setOptionC("");
            setOptionD("");
            setCorrectAnswer("");
            setShowAddModal(false);

            // Refresh questions
            fetchExamAndQuestions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add question");
        } finally {
            setLoadingQuestion(false);
        }
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setEditQuestionText(question.questionText);
        setEditOptionA(question.optionA);
        setEditOptionB(question.optionB);
        setEditOptionC(question.optionC);
        setEditOptionD(question.optionD);
        setEditCorrectAnswer(question.correctAnswer);
    };

    const updateQuestion = async () => {
        if (loadingQuestion) return;

        setLoadingQuestion(true);

        try {
            await API.put(`/questions/${editingQuestion.id}`, {
                questionText: editQuestionText,
                optionA: editOptionA,
                optionB: editOptionB,
                optionC: editOptionC,
                optionD: editOptionD,
                correctAnswer: editCorrectAnswer
            });

            toast.success("Question updated successfully!");
            setEditingQuestion(null);
            fetchExamAndQuestions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update question");
        } finally {
            setLoadingQuestion(false);
        }
    };

    const deleteQuestion = async (questionId) => {
        setDeletingId(questionId);

        try {
            await API.delete(`/questions/${questionId}`);
            toast.success("Question deleted successfully!");
            fetchExamAndQuestions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete question");
        } finally {
            setDeletingId(null);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                toast.error("Excel file is empty");
                return;
            }

            setLoadingQuestion(true);

            for (const row of jsonData) {
                console.log("EXCEL ROW:", row);

                await API.post("/questions", {
                    questionText: row.Question || row.question,
                    optionA: row.OptionA || row["Option A"] || row.optionA,
                    optionB: row.OptionB || row["Option B"] || row.optionB,
                    optionC: row.OptionC || row["Option C"] || row.optionC,
                    optionD: row.OptionD || row["Option D"] || row.optionD,
                    correctAnswer: row.CorrectAnswer || row["Correct Answer"] || row.correctAnswer,
                    exam: {
                        id: parseInt(id)
                    }
                });
            }

            toast.success(`${jsonData.length} questions uploaded successfully!`);
            setShowAddModal(false);
            fetchExamAndQuestions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload questions");
        } finally {
            setLoadingQuestion(false);
            e.target.value = "";
        }
    };

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    if (loading) {
        return (
            <PremiumLoader
                title="Loading Exam Questions..."
                subtitle="Fetching exam details and question bank."
                height="100vh"
            />
        );
    }

    if (!exam) {
        return (
            <div className="premium-root min-h-screen flex items-center justify-center">
                <p className="text-white/70 text-lg">Exam not found</p>
            </div>
        );
    }

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
                    <div>
                        <div className="logo-text-primary">Smart Exam Portal</div>
                        <div className="text-white/45 text-[11px] tracking-wide">Admin Panel</div>
                    </div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/admin/exam/${id}`)} className="premium-btn-secondary">
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
                                <div className="dropdown-item dropdown-item-danger" onClick={logout}>
                                    <div className="dropdown-item-icon"><LogOut className="w-4 h-4" /></div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-6 md:px-12 py-10 max-w-[1800px] mx-auto space-y-10">
                {/* Hero Section */}
                <div className="mb-12 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Question Management</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Add, edit, and manage exam questions.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8 items-start">
                        <div className="stats-card premium-shine min-w-[220px]">
                            <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.5px]">Exam ID</p>
                            <p className="text-white text-2xl font-extrabold mt-2">#{exam.id}</p>
                        </div>

                        <div className="stats-card premium-shine min-w-[220px]">
                            <p className="text-cyan-300/70 text-xs font-semibold uppercase tracking-[0.5px]">Total Questions</p>
                            <p className="text-cyan-300 text-2xl font-extrabold mt-2">{questions.length}</p>
                        </div>

                        <div className="stats-card premium-shine min-w-[220px]">
                            <p className="text-emerald-300/70 text-xs font-semibold uppercase tracking-[0.5px]">Duration</p>
                            <p className="text-emerald-300 text-2xl font-extrabold mt-2">{exam.duration} min</p>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="premium-section-title text-3xl">All Questions</h3>
                    <div className="group relative">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="premium-button premium-shine flex items-center gap-2 px-6 py-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Question</span>
                        </button>
                    </div>
                </div>

                {/* Questions Grid */}
                {questions.length === 0 ? (
                    <div className="empty-state-card premium-shine text-center py-24">
                        <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(255,216,107,0.18)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <p style={{ color: '#ffffff' }} className="font-semibold text-lg mb-2">No Questions Yet</p>
                        <p style={{ color: 'rgba(255,255,255,0.60)' }}>Use the Add Question button above to create your first question.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className="question-management-card premium-shine p-7"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="question-number-badge">{index + 1}</span>
                                            <p className="text-white font-semibold text-lg">{question.questionText}</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                            {[
                                                { label: 'A', value: question.optionA },
                                                { label: 'B', value: question.optionB },
                                                { label: 'C', value: question.optionC },
                                                { label: 'D', value: question.optionD }
                                            ].map((opt) => (
                                                <div key={opt.label} className="question-option-card" style={{ background: 'rgba(255,216,107,0.05)', border: '1px solid rgba(255,216,107,0.10)' }}>
                                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Option {opt.label}</p>
                                                    <p style={{ color: '#ffffff', marginTop: '4px', fontSize: '13px' }} className="font-medium">{opt.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="question-answer-badge flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Answer: {question.correctAnswer}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => openEditModal(question)}
                                            className="premium-action-btn premium-action-btn-edit"
                                            title="Edit Question"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            disabled={deletingId === question.id}
                                            className="premium-action-btn premium-action-btn-delete disabled:opacity-60 disabled:cursor-not-allowed"
                                            title="Delete Question"
                                        >
                                            {deletingId === question.id ? (
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Question Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
                    <div className="premium-modal-card w-full max-w-2xl my-auto p-8 premium-shine">
                        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full mb-6" />

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="premium-button premium-shine flex-1 flex items-center justify-center gap-2">Add Question</h2>
                                <p className="text-sm text-amber-300/55 mt-1">Add a new question to the exam</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: 'rgba(196,181,253,0.7)'
                                }}
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div>
                                <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Question</label>
                                <textarea
                                    placeholder="Enter question text"
                                    className={`${inputClass} resize-none h-24`}
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option A</label>
                                    <input type="text" placeholder="Option A" className={inputClass} value={optionA} onChange={(e) => setOptionA(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option B</label>
                                    <input type="text" placeholder="Option B" className={inputClass} value={optionB} onChange={(e) => setOptionB(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option C</label>
                                    <input type="text" placeholder="Option C" className={inputClass} value={optionC} onChange={(e) => setOptionC(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option D</label>
                                    <input type="text" placeholder="Option D" className={inputClass} value={optionD} onChange={(e) => setOptionD(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Correct Answer</label>
                                <select className={inputClass} value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                                    <option value="">— Select correct answer —</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div className="pt-3 border-t border-white/5">
                                <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-3">Bulk Upload (Optional)</label>
                                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-amber-500/25 rounded-xl cursor-pointer hover:bg-amber-500/10 transition-colors">
                                    <UploadCloud className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-700">Upload Excel file</p>
                                        <p className="text-xs text-amber-300/65">Columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleBulkUpload}
                                        disabled={loadingQuestion}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="premium-btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addQuestion}
                                disabled={loadingQuestion}
                                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loadingQuestion ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Question
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Question Modal */}
            {editingQuestion && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
                    <div className="premium-modal-card w-full max-w-2xl my-auto p-8 premium-shine">
                        <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 rounded-full mb-6" />

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Edit Question</h2>
                                <p className="text-sm text-amber-300/55 mt-1">Update question details</p>
                            </div>
                            <button
                                onClick={() => setEditingQuestion(null)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-amber-200/80 transition-all border border-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div>
                                <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Question</label>
                                <textarea
                                    placeholder="Enter question text"
                                    className={`${inputClass} resize-none h-24`}
                                    value={editQuestionText}
                                    onChange={(e) => setEditQuestionText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option A</label>
                                    <input type="text" placeholder="Option A" className={inputClass} value={editOptionA} onChange={(e) => setEditOptionA(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option B</label>
                                    <input type="text" placeholder="Option B" className={inputClass} value={editOptionB} onChange={(e) => setEditOptionB(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option C</label>
                                    <input type="text" placeholder="Option C" className={inputClass} value={editOptionC} onChange={(e) => setEditOptionC(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Option D</label>
                                    <input type="text" placeholder="Option D" className={inputClass} value={editOptionD} onChange={(e) => setEditOptionD(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-amber-300/65 uppercase tracking-wider mb-1.5">Correct Answer</label>
                                <select className={inputClass} value={editCorrectAnswer} onChange={(e) => setEditCorrectAnswer(e.target.value)}>
                                    <option value="">— Select correct answer —</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                            <button
                                onClick={() => setEditingQuestion(null)}
                                className="premium-btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateQuestion}
                                disabled={loadingQuestion}
                                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loadingQuestion ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExamQuestions;