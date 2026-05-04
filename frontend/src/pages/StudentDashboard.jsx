import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import useTheme from "../hooks/useTheme";

function StudentDashboard() {

    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [examsLoading, setExamsLoading] = useState(true);
    const [examsError, setExamsError] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalMessage, setModalMessage] = useState({ text: "", type: "" });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "U";
    const { dark, toggle: toggleTheme } = useTheme();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setExamsLoading(true);
        setExamsError(false);
        try {
            const response = await API.get("/exams");
            setExams(response.data);
        } catch (error) {
            console.log(error);
            setExamsError(true);
            toast.error("Failed to load exams. Please refresh.");
        } finally {
            setExamsLoading(false);
        }
    };

    const startExam = (examId) => {
        navigate(`/exam/${examId}`);
    };

    const logout = () => {
        setShowDropdown(false);
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    const openModal = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setModalMessage({ text: "", type: "" });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        setShowDropdown(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage({ text: "", type: "" });
    };

    const handleChangePassword = async () => {

        setModalMessage({ text: "", type: "" });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setModalMessage({ text: "All fields are required.", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setModalMessage({ text: "New password and confirm password do not match.", type: "error" });
            return;
        }

        setLoadingPassword(true);

        try {
            const response = await API.post("/auth/change-password", {
                email,
                currentPassword,
                newPassword
            });

            const msg = response.data;

            if (msg === "Password Changed Successfully") {
                toast.success("Password changed successfully!");
                closeModal();
            } else {
                setModalMessage({ text: msg, type: "error" });
            }

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoadingPassword(false);
        }
    };

    const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-blue-300";

    const EyeIcon = ({ show, toggle }) => (
        <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {show ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );

    return (

        <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-[#f0f4ff]"}`} onClick={() => showDropdown && setShowDropdown(false)}>

            {/* Navbar */}
            <nav className={`backdrop-blur-md border-b sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm transition-colors duration-300 ${dark ? "bg-gray-900/90 border-gray-700" : "bg-white/80 border-blue-100"}`}>

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        Smart Exam Portal
                    </h1>
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
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md hover:shadow-blue-300 hover:scale-105 transition-all duration-200 ring-2 ring-white shrink-0"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (

                        <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl border overflow-hidden animate-fade-in ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}>

                            <div className={`px-5 py-4 border-b ${dark ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow">
                                        {firstLetter}
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm leading-tight ${dark ? "text-white" : "text-gray-800"}`}>{name}</p>
                                        <p className="text-xs text-blue-500 font-medium mt-0.5">Student</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1.5">
                                <button
                                    onClick={() => navigate("/history")}
                                    className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center gap-3 ${dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <span className="text-base">📋</span>
                                    <span className="font-medium">Exam History</span>
                                </button>

                                <button
                                    onClick={openModal}
                                    className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center gap-3 ${dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <span className="text-base">⚙️</span>
                                    <span className="font-medium">Settings</span>
                                </button>

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

            {/* Change Password Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal card */}
                    <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />

                        {/* Header */}
                        <div className="px-8 pt-7 pb-5 flex items-start justify-between border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Change Password</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <div className="px-8 py-7 space-y-5">

                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Enter current password"
                                        className={inputClass}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className={inputClass}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className={inputClass}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                                </div>
                            </div>

                            {/* Feedback message */}
                            {modalMessage.text && (
                                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
                                    modalMessage.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-red-50 text-red-600 border border-red-100"
                                }`}>
                                    {modalMessage.type === "success" ? (
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {modalMessage.text}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loadingPassword}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-blue-300 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loadingPassword ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Updating Password...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>

                    </div>

                </div>
            )}

            <ConfirmModal
                isOpen={showLogoutConfirm}
                title="Logout"
                message="Are you sure you want to log out of your account?"
                confirmLabel="Logout"
                confirmClass="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />

            <div className="px-6 md:px-12 py-10 max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="mb-12 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl px-8 py-10 md:px-12 md:py-12 shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-2">Student Dashboard</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                            Welcome back, {name} 👋
                        </h2>
                        <p className="text-blue-100 text-base md:text-lg font-medium">
                            Ready to test your knowledge today?
                        </p>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <h3 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-800"}`}>Available Exams</h3>
                        <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{exams.length} exam{exams.length !== 1 ? "s" : ""} available for you</p>
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {exams.length} Total
                    </span>
                </div>

                {/* Loading state */}
                {examsLoading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4" />
                        <p className="text-sm text-gray-400 font-medium">Loading exams...</p>
                    </div>
                )}

                {/* Error state */}
                {!examsLoading && examsError && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-200 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-semibold text-base">Failed to load exams</p>
                        <p className="text-gray-400 text-sm mt-1 mb-5">Something went wrong while fetching exams.</p>
                        <button
                            onClick={fetchExams}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Exam Cards Grid */}
                {!examsLoading && !examsError && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {exams.map((exam, index) => (

                        <div
                            key={exam.id}
                            className={`group rounded-2xl shadow-sm hover:shadow-xl border hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}
                        >
                            <div className={`h-1.5 w-full ${index % 3 === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" : index % 3 === 1 ? "bg-gradient-to-r from-indigo-400 to-purple-500" : "bg-gradient-to-r from-cyan-400 to-blue-500"}`} />

                            <div className="p-7 flex flex-col flex-1">

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {exam.duration} mins
                                    </span>
                                </div>

                                <h2 className={`text-lg font-bold mb-2 leading-snug group-hover:text-blue-600 transition-colors ${dark ? "text-gray-100" : "text-gray-800"}`}>
                                    {exam.title}
                                </h2>

                                <p className={`text-sm mb-6 leading-relaxed flex-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                    Test your skills and improve your performance with this examination.
                                </p>

                                <button
                                    onClick={() => startExam(exam.id)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-blue-300 hover:shadow-md flex items-center justify-center gap-2 group/btn"
                                >
                                    Start Exam
                                    <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

                {exams.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-blue-200 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-semibold text-base">No exams available right now</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later — new exams will appear here.</p>
                    </div>
                )}
                </>
                )}

            </div>

        </div>
    );
}

export default StudentDashboard;
