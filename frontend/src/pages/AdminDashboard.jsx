import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

function AdminDashboard() {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");

    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");

    const [exams, setExams] = useState([]);

    const [selectedExamId, setSelectedExamId] = useState("");

    const [questionText, setQuestionText] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");

    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingExam, setLoadingExam] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {

        fetchExams();

    }, []);

    const fetchExams = async () => {

        try {

            const response = await API.get("/exams");

            setExams(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const createExam = async () => {

        if (loadingExam) return;

        setLoadingExam(true);

        try {

            const response = await API.post("/exams", {
                title,
                duration
            });

            toast.success("Exam created successfully!");

            console.log(response.data);

            fetchExams();

        } catch (error) {

            toast.error("Failed to create exam. Please try again.");

        } finally {

            setLoadingExam(false);
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

    const deleteExam = async (examId, examTitle) => {
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

        <div className="min-h-screen bg-[#f0f4ff]" onClick={() => showDropdown && setShowDropdown(false)}>

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm">

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                            Smart Exam Portal
                        </h1>
                        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Admin Panel</p>
                    </div>
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-lg font-bold shadow-md hover:shadow-blue-300 hover:scale-105 transition-all duration-200 ring-2 ring-white"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

                            <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base shadow">
                                        {firstLetter}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm leading-tight">{name}</p>
                                        <p className="text-xs text-blue-500 font-medium mt-0.5">Administrator</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1.5">
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-base">🚪</span>
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>

                        </div>
                    )}
                </div>

            </nav>

            <div className="px-6 md:px-12 py-10 max-w-7xl mx-auto">

                {/* Hero Banner */}
                <div className="mb-10 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-3xl px-8 py-9 md:px-12 shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Admin Dashboard</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 leading-tight">
                            Welcome back, {name} 👋
                        </h2>
                        <p className="text-blue-100 text-sm md:text-base font-medium">
                            Manage your exams and questions from one place.
                        </p>
                    </div>
                    <div className="absolute right-8 bottom-6 hidden md:flex items-center gap-4">
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/20">
                            <p className="text-2xl font-extrabold text-white">{exams.length}</p>
                            <p className="text-blue-100 text-xs font-medium mt-0.5">Total Exams</p>
                        </div>
                    </div>
                </div>

                {/* Forms Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Create Exam Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Create Exam</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Add a new exam to the portal</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Exam Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mathematics Final Exam"
                                        className={inputClass}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Duration</label>
                                    <input
                                        type="number"
                                        placeholder="Duration in minutes"
                                        className={inputClass}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={createExam}
                                    disabled={loadingExam}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-300 hover:shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loadingExam ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Creating Exam...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Exam
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Add Question Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Add Question</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Attach a question to an existing exam</p>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Exam</label>
                                    <select
                                        className={inputClass}
                                        onChange={(e) => setSelectedExamId(e.target.value)}
                                    >
                                        <option value="">— Choose an exam —</option>
                                        {exams.map((exam) => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Question</label>
                                    <input
                                        type="text"
                                        placeholder="Enter the question text"
                                        className={inputClass}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Option A", setter: setOptionA, placeholder: "Option A" },
                                        { label: "Option B", setter: setOptionB, placeholder: "Option B" },
                                        { label: "Option C", setter: setOptionC, placeholder: "Option C" },
                                        { label: "Option D", setter: setOptionD, placeholder: "Option D" },
                                    ].map(({ label, setter, placeholder }) => (
                                        <div key={label}>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                            <input
                                                type="text"
                                                placeholder={placeholder}
                                                className={inputClass}
                                                onChange={(e) => setter(e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Correct Answer</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. A, B, C or D"
                                        className={inputClass}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={addQuestion}
                                    disabled={loadingQuestion}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-emerald-300 hover:shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loadingQuestion ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Adding Question...
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

                </div>

                {/* Exams List */}
                {exams.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">All Exams</h3>
                                <p className="text-sm text-gray-400 mt-0.5">{exams.length} exam{exams.length !== 1 ? "s" : ""} created</p>
                            </div>
                            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">{exams.length} Total</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {exams.map((exam, index) => (
                                <div
                                    key={exam.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                                >
                                    <div className={`h-1 w-full ${index % 3 === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" : index % 3 === 1 ? "bg-gradient-to-r from-indigo-400 to-purple-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`} />
                                    <div className="px-6 py-5 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{exam.title}</p>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {exam.duration} minutes
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                                                #{exam.id}
                                            </span>
                                            <button
                                                onClick={() => deleteExam(exam.id, exam.title)}
                                                disabled={deletingId === exam.id}
                                                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>

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

        </div>
    );
}

export default AdminDashboard;
