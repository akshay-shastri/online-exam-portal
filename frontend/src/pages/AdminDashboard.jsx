import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import ConfirmModal from "../components/ConfirmModal";
import useTheme from "../hooks/useTheme";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

function AdminDashboard() {

    const navigate = useNavigate();

    const name = localStorage.getItem("name");

    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");

    const [positiveMarks, setPositiveMarks] = useState("");

    const [negativeMarks, setNegativeMarks] = useState("");

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

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const [violations, setViolations] = useState([]);

    const [results,setResults] = useState([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingExam, setLoadingExam] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {

    fetchExams();

    fetchAnalytics();

    fetchViolations();

    fetchResults();

    

}, []);



    const fetchExams = async () => {

        try {

            const response = await API.get("/exams");

            setExams(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const fetchAnalytics = async () => {

    try {

        const response =
            await API.get("/results/analytics");

        setAnalytics(response.data);

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

const fetchResults =
    async () => {

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

    const createExam = async () => {

        if (loadingExam) return;

        setLoadingExam(true);

        try {

            const response = await API.post(
    "/exams",
    {
        title,

        duration:
            parseInt(duration),

        positiveMarks:
            positiveMarks
                ? parseFloat(
                    positiveMarks
                )
                : 1,

        negativeMarks:
            negativeMarks
                ? parseFloat(
                    negativeMarks
                )
                : 0,

        startTime:
            startTime
                ? `${startTime}:00`
                : null,

        endTime:
            endTime
                ? `${endTime}:00`
                : null,

        active: true
    }
);

            toast.success("Exam created successfully!");

            console.log(response.data);

            fetchExams();
            setTitle("");
            setDuration("");
            setPositiveMarks("");
            setNegativeMarks("");

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
    const { dark, toggle: toggleTheme } = useTheme();

    return (

        <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-[#f0f4ff]"}`} onClick={() => showDropdown && setShowDropdown(false)}>

            {/* Navbar */}
            <nav className={`backdrop-blur-md border-b sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm transition-colors duration-300 ${dark ? "bg-gray-900/90 border-gray-700" : "bg-white/80 border-blue-100"}`}>

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

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${dark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {dark ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.061l-1.59 1.59z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-lg font-bold shadow-md hover:shadow-blue-300 hover:scale-105 transition-all duration-200 ring-2 ring-white shrink-0"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl border overflow-hidden ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>

                            <div className={`px-5 py-4 border-b ${dark ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base shadow">
                                        {firstLetter}
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm leading-tight ${dark ? "text-white" : "text-gray-800"}`}>{name}</p>
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

            <div className="px-6 md:px-12 py-10 max-w-screen-2xl mx-auto">

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

                {/* Analytics Section */}

{analytics && (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

    {[
        {
            title: "Total Students",
            value: analytics.totalStudents
        },
        {
            title: "Total Attempts",
            value: analytics.totalAttempts
        },
        {
            title: "Average Score",
            value: `${analytics.averageScore}%`
        },
        {
            title: "Pass Percentage",
            value: `${analytics.passPercentage}%`
        }
    ].map((item, index) => (

        <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >

            <p className="text-sm text-gray-400 font-medium">
                {item.title}
            </p>

            <h3 className="text-3xl font-extrabold text-gray-800 mt-2">
                {item.value}
            </h3>

        </div>
    ))}

</div>

)}

{/* Charts */}

{analytics && (

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

    {/* Bar Chart */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h3 className="text-lg font-bold text-gray-800 mb-5">
            Exam Attempts
        </h3>

        <ResponsiveContainer width="100%" height={300}>

            <BarChart
                data={
                    Object.entries(
                        analytics.examAttempts || {}
                    ).map(([name, value]) => ({
                        name,
                        value
                    }))
                }
            >

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" radius={[8, 8, 0, 0]} />

            </BarChart>

        </ResponsiveContainer>

    </div>

    {/* Pie Chart */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h3 className="text-lg font-bold text-gray-800 mb-5">
            Pass Rate
        </h3>

        <ResponsiveContainer width="100%" height={300}>

            <PieChart>

                <Pie
                    data={[
                        {
                            name: "Pass",
                            value: analytics.passPercentage
                        },
                        {
                            name: "Fail",
                            value: 100 - analytics.passPercentage
                        }
                    ]}
                    dataKey="value"
                    outerRadius={100}
                    label
                >

                    <Cell />
                    <Cell />

                </Pie>

                <Tooltip />

            </PieChart>

        </ResponsiveContainer>

    </div>

</div>

)}

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
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        Positive Marks
    </label>

    <input
        type="number"
        step="0.01"
        placeholder="e.g. 1"
        className={inputClass}
        value={positiveMarks}
        onChange={(e) =>
            setPositiveMarks(e.target.value)
        }
    />
</div>

<div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        Negative Marks
    </label>

    <input
        type="number"
        step="0.01"
        placeholder="e.g. 0.25"
        className={inputClass}
        value={negativeMarks}
        onChange={(e) =>
            setNegativeMarks(e.target.value)
        }
    />
</div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Duration</label>
                                    <input
                                        type="number"
                                        placeholder="Duration in minutes"
                                        className={inputClass}
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        End Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
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
                                        onChange={(e) => {

                                                setSelectedExamId(e.target.value);
                                                fetchQuestions(e.target.value); }}
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

                                <div className="border border-dashed border-emerald-200 rounded-2xl p-5 bg-emerald-50/40">

    <div className="flex items-center justify-between gap-4 flex-wrap">

        <div>

            <h3 className="text-sm font-bold text-gray-800">
                Bulk Upload Questions
            </h3>

            <p className="text-xs text-gray-500 mt-1">
                Upload Excel (.xlsx) file
            </p>

        </div>

        <label className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">

            Upload Excel

            <input
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={handleBulkUpload}
            />

        </label>

    </div>

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

                    {selectedExamId && (

                        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-800 mb-5">
                                Exam Questions
                            </h2>

                            {loadingQuestions ? (

                                <p className="text-sm text-gray-500">
                                    Loading questions...
                                </p>

                            ) : examQuestions.length === 0 ? (

                                <p className="text-sm text-gray-400">
                                    No questions added yet.
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {examQuestions.map((question, index) => (

                                        <div
                                            key={question.id}
                                            className="border border-gray-100 rounded-2xl p-5 flex justify-between items-start"
                                        >

                                            <div>

                                                <p className="font-semibold text-gray-800">
                                                    Q{index + 1}. {question.questionText}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    Correct Answer:
                                                    <span className="font-bold text-emerald-600 ml-1">
                                                        {question.correctAnswer}
                                                    </span>
                                                </p>

                                            </div>

                                            <div className="flex items-center">

    <button
        onClick={() =>
            openEditModal(question)
        }
        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold mr-2"
    >
        Edit
    </button>

    <button
        onClick={() =>
            deleteQuestion(question.id)
        }
        className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-sm font-semibold"
    >
        Delete
    </button>

</div>

                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

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

                   {/* Violation Monitoring */}

            <div className="mb-10 w-full">

                <div className="flex items-center justify-between mb-5">

                    <div>

                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">

                            Suspicious Activities

                        </h3>

                        <p className="text-sm text-gray-400 mt-0.5">

                            Recent proctoring violations

                        </p>

                    </div>

                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">

                        {violations.length} Total

                    </span>

                </div>

                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Main Table */}

                    <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">

                            <div>

                                <h4 className="text-lg font-bold text-gray-800">

                                    Recent Violations

                                </h4>

                                <p className="text-sm text-gray-400 mt-1">

                                    Latest suspicious activities detected

                                </p>

                            </div>

                        </div>

                        {violations.length === 0 ? (

                            <div className="p-12 text-center text-gray-400">

                                No suspicious activities detected yet.

                            </div>

                        ) : (

                            <div className="divide-y divide-gray-100">

                                {[...violations]
                                    .reverse()
                                    .slice(0, 8)
                                    .map((violation) => (

                                    <div
                                        key={violation.id}
                                        className="px-6 py-5 hover:bg-red-50/30 transition-colors"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-start gap-4">

                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-bold shrink-0">

                                                    {violation.studentName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <div>

                                                    <h4 className="font-bold text-gray-800">

                                                        {violation.studentName}

                                                    </h4>

                                                    <p className="text-sm text-gray-500 mt-1">

                                                        {violation.examTitle}

                                                    </p>

                                                    <div className="mt-3">

                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">

                                                            {violation.violationType}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* Stats Side Card */}

                    <div className="lg:col-span-4 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">

                        <div className="relative z-10">

                            <p className="text-red-100 text-xs uppercase tracking-widest font-semibold mb-2">

                                Monitoring

                            </p>

                            <h3 className="text-5xl font-black tracking-tight">

                                {violations.length}

                            </h3>

                            <p className="text-red-100 mt-2">

                                Total Violations Logged

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* FACE VERIFICATION SECTION */}

            <div className="mt-10 w-full">

                <div className="flex items-center justify-between mb-5">

                    <div>

                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">

                            Face Verification Logs

                        </h3>

                        <p className="text-sm text-gray-400 mt-0.5">

                            Compare start and end exam snapshots

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center">

                    {results
    .filter((r) => r.startFaceImage)
                        // .filter(
                        //     (r) =>
                        //         r.startFaceImage &&
                        //         r.endFaceImage
                        // )
                        .slice()
                        .reverse()
                        .map((result) => (

                        <div
                            key={result.id}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl"
                        >

                            <div className="px-6 py-5 border-b border-gray-100">

                                <h4 className="font-bold text-gray-800">

                                    {result.studentName}

                                </h4>

                                <p className="text-sm text-gray-400 mt-1">

                                    {result.examTitle}

                                </p>

                            </div>

                            <div className="p-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <div>

                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">

                                            Start Exam

                                        </p>

                                        <img
                                            src={
                                                result.startFaceImage
                                            }
                                            alt="Start Face"
                                            className="w-full h-56 object-cover rounded-2xl border border-gray-200"
                                        />

                                    </div>

                                    <div>

                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">

                                            End Exam

                                        </p>

                                        <img
                                            src={
    result.endFaceImage ||
    result.startFaceImage
}
                                            alt="End Face"
                                            className="w-full h-56 object-cover rounded-2xl border border-gray-200"
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
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
