import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/dashboard.css";

function StudentDashboard() {

    const navigate = useNavigate();
    const dark = true;

    const [exams, setExams] = useState([]);
    const [examsLoading, setExamsLoading] = useState(true);
    const [examsError, setExamsError] = useState(false);
    const [attemptedExams, setAttemptedExams] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications,setShowNotifications] = useState(false);

    const [notifications,setNotifications] = useState([]);
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

    useEffect(() => {

    fetchExams();

    fetchNotifications();

    const interval =
        setInterval(() => {

            fetchNotifications();

        }, 15000);

    return () =>
        clearInterval(interval);

}, []);

    const fetchNotifications = async () => {

    try {

        const response =
            await API.get(
                `/notifications/${email}`
            );

        setNotifications(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};

    const fetchExams = async () => {
        setExamsLoading(true);
        setExamsError(false);
        try {
            const response = await API.get("/exams");
            const examList = response.data;
            setExams(examList);

        

            // Check attempt status for each exam
            const studentName = localStorage.getItem("name") || "";
            const attemptChecks = await Promise.all(
                examList.map((exam) =>
                    API.get(`/results/check/${encodeURIComponent(studentName)}/${encodeURIComponent(exam.title)}`)
                        .then((r) => ({ id: exam.id, attempted: r.data.attempted }))
                        .catch(() => ({ id: exam.id, attempted: false }))
                )
            );
            const attemptMap = {};
            attemptChecks.forEach(({ id, attempted }) => { attemptMap[id] = attempted; });
            setAttemptedExams(attemptMap);
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

    const inputClass = "cp-input";

    const EyeIcon = ({ show, toggle }) => (
        <button type="button" onClick={toggle} className="cp-eye-btn">
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

        <div className={`premium-root min-h-screen transition-colors duration-300 ${dark ? "" : ""}`} onClick={() => showDropdown && setShowDropdown(false)}>

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

                <div className="relative">

    <button
        onClick={() =>
            setShowNotifications(
                !showNotifications
            )
        }
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
            dark
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
    >

        🔔

        {notifications.length > 0 && (

            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">

                {notifications.length}

            </span>

        )}

    </button>

    {showNotifications && (

        <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50 ${
            dark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-100"
        }`}>

            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">

                <h3 className={`font-bold text-sm ${
                    dark
                        ? "text-white"
                        : "text-gray-800"
                }`}>
                    Notifications
                </h3>

            </div>

            <div className="max-h-80 overflow-y-auto">

                {notifications.length === 0 ? (

                    <div className="p-6 text-center text-sm text-gray-400">
                        No notifications
                    </div>

                ) : (

                    notifications.map((n) => (

                        <div
                            key={n.id}
                            className={`px-5 py-4 border-b last:border-none ${
                                dark
                                    ? "border-gray-700"
                                    : "border-gray-100"
                            }`}
                        >

                            <p className={`text-sm font-medium ${
                                dark
                                    ? "text-gray-200"
                                    : "text-gray-700"
                            }`}>
                                {n.message}
                            </p>

                            <p className="text-xs text-blue-500 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>

                        </div>
                    ))

                )}

            </div>

        </div>

    )}

</div>
                    {/* Theme toggle */}

                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="profile-btn"
                    >
                        {firstLetter}
                    </button>

                    {showDropdown && (
                        <div className="profile-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
                            <div className="profile-top">
                                <div className="profile-avatar">{firstLetter}</div>
                                <div>
                                    <div className="profile-name">{name}</div>
                                    <div className="profile-role">Student • Online</div>
                                </div>
                            </div>
                            <div>
                                <div className="dropdown-item" onClick={() => navigate('/history')}>
                                    <span>📋</span>
                                    <span>Exam History</span>
                                </div>
                                <div className="dropdown-item" onClick={() => navigate('/leaderboard')}>
                                    <span>🏆</span>
                                    <span>Leaderboard</span>
                                </div>
                                <div className="dropdown-item" onClick={openModal}>
                                    <span>⚙️</span>
                                    <span>Settings</span>
                                </div>
                                <div className="dropdown-divider" />
                                <div className="dropdown-item" onClick={logout}>
                                    <span>🚪</span>
                                    <span className="text-rose-400">Logout</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </nav>

            {/* Change Password Modal */}
            {showModal && (
                <div className="cp-overlay">

                    {/* Backdrop */}
                    <div className="cp-backdrop" onClick={closeModal} />

                    {/* Modal card */}
                    <div className="cp-card">

                        <div className="cp-top-strip" />

                        {/* Header */}
                        <div className="cp-header">
                            <div className="cp-header-left">
                                <div className="cp-icon-wrap">
                                    <svg className="cp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="cp-title">Change Password</h2>
                                    <p className="cp-subtitle">Update your account password</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="cp-close-btn">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <div className="cp-body">

                            {/* Current Password */}
                            <div className="cp-field">
                                <label className="cp-label">Current Password</label>
                                <div className="cp-input-wrap">
                                    <span className="cp-input-icon">
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="cp-field">
                                <label className="cp-label">New Password</label>
                                <div className="cp-input-wrap">
                                    <span className="cp-input-icon">
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="cp-field">
                                <label className="cp-label">Confirm New Password</label>
                                <div className="cp-input-wrap">
                                    <span className="cp-input-icon">
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <div className={`cp-feedback ${modalMessage.type === "success" ? "cp-feedback-success" : "cp-feedback-error"}`}>
                                    {modalMessage.type === "success" ? (
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{flexShrink:0}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{flexShrink:0}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {modalMessage.text}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="cp-actions">
                                <button onClick={closeModal} className="cp-btn-cancel">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loadingPassword}
                                    className="cp-btn-submit"
                                >
                                    {loadingPassword ? (
                                        <>
                                            <svg className="cp-spin" fill="none" viewBox="0 0 24 24" width="15" height="15">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{opacity:0.25}} />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{opacity:0.75}} />
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="mb-12 glass-hero relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="hero-accent">Student Dashboard</span>
                        <h2 className="hero-title mt-4">Welcome Back, {name}</h2>
                        <p className="hero-sub">Track exams, monitor performance, and continue your assessment journey.</p>
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
                    <div className="text-center py-20 rounded-[28px]" style={{background:'rgba(15,10,35,0.75)',border:'1px solid rgba(239,68,68,0.18)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',boxShadow:'0 0 40px rgba(239,68,68,0.06),0 16px 48px rgba(0,0,0,0.5)'}}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,rgba(239,68,68,0.18),rgba(244,63,94,0.1))',border:'1px solid rgba(239,68,68,0.2)',boxShadow:'0 0 24px rgba(239,68,68,0.15)'}}>
                            <svg className="w-8 h-8" style={{color:'rgba(248,113,113,0.85)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-base mb-1" style={{color:'#f5f3ff'}}>Failed to load exams</p>
                        <p className="text-sm mb-6" style={{color:'rgba(221,214,254,0.55)'}}>Something went wrong while fetching exams.</p>
                        <button
                            onClick={fetchExams}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)',color:'white',boxShadow:'0 4px 20px rgba(124,58,237,0.4)'}}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Exam Cards Grid */}
                {!examsLoading && !examsError && (
                <>
                <div className="exam-grid">

                    {exams.map((exam, index) => {

                        const now = Date.now();
                        const examStart = new Date(exam.startTime).getTime();
                        const examEnd = new Date(exam.endTime).getTime();

                        let examStatus = "ACTIVE";
                        let countdownText = "";

                        if (now < examStart) {
                            examStatus = "UPCOMING";
                            countdownText = "Upcoming";
                        } else if (now > examEnd) {
                            examStatus = "EXPIRED";
                            countdownText = "Expired";
                        } else {
                            examStatus = "ACTIVE";
                            countdownText = "Active";
                        }

                        return (
                        <div key={exam.id} className="exam-card">
                            <div className="accent-strip" style={{background: index % 3 === 0 ? 'linear-gradient(90deg,#7c3aed,#d946ef)' : index % 3 === 1 ? 'linear-gradient(90deg,#9f7aea,#fb7185)' : 'linear-gradient(90deg,#06b6d4,#7c3aed)'}} />
                            <div className="p-5 flex flex-col gap-0">

                                {/* Top row: icon + duration */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.35),rgba(217,70,239,0.2))',border:'1px solid rgba(167,139,250,0.35)',color:'#e9d5ff',boxShadow:'0 0 16px rgba(124,58,237,0.3),inset 0 1px 0 rgba(255,255,255,0.08)'}}>
                                        {exam.id}
                                    </div>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:'rgba(124,58,237,0.12)',border:'1px solid rgba(167,139,250,0.18)',color:'rgba(196,181,253,0.8)'}}>⏱ {exam.duration} mins</span>
                                </div>

                                {/* Title */}
                                <h3 className="exam-title mb-1">{exam.title}</h3>

                                {/* Description */}
                                <p className="exam-desc mb-3">Test your skills and improve your performance with this examination.</p>

                                {/* Status + timer row */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{background: examStatus === 'ACTIVE' ? 'rgba(52,211,153,0.08)' : examStatus === 'UPCOMING' ? 'rgba(250,204,21,0.08)' : 'rgba(239,68,68,0.08)'}}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${examStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : examStatus === 'UPCOMING' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                        <span style={{color: examStatus === 'ACTIVE' ? 'rgba(52,211,153,0.9)' : examStatus === 'UPCOMING' ? 'rgba(250,204,21,0.9)' : 'rgba(248,113,113,0.9)'}}>{countdownText}</span>
                                    </div>
                                    {examStatus === 'ACTIVE' && (() => {
                                        const msLeft = examEnd - now;
                                        const hLeft = Math.floor(msLeft / 3600000);
                                        const mLeft = Math.floor((msLeft % 3600000) / 60000);
                                        const urgent = hLeft < 2;
                                        return (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                                background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(124,58,237,0.1)',
                                                border: `1px solid ${urgent ? 'rgba(239,68,68,0.2)' : 'rgba(167,139,250,0.18)'}`,
                                                color: urgent ? '#fca5a5' : 'rgba(196,181,253,0.85)',
                                            }}>
                                                <svg style={{width:'12px',height:'12px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Ends in {hLeft}h {mLeft}m
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Button */}
                                <button
                                    onClick={() => {

                                        if (attemptedExams[exam.id]) {
                                            navigate(`/review/${encodeURIComponent(exam.title)}`);
                                        } else {startExam(exam.id);}}
                                    }

                                    disabled={!attemptedExams[exam.id] && examStatus !== 'ACTIVE'}
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn ${
                                        !attemptedExams[exam.id] && examStatus !== 'ACTIVE' ? 'cursor-not-allowed' : ''
                                    }`}
                                    style={attemptedExams[exam.id] || examStatus !== 'ACTIVE' ? {
                                        background:'rgba(255,255,255,0.04)',
                                        border:'1px solid rgba(255,255,255,0.08)',
                                        color:'rgba(255,255,255,0.25)'
                                    } : {
                                        background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                                        boxShadow:'0 2px 16px rgba(124,58,237,0.35)',
                                        color:'white'
                                    }}
                                >
                                    {attemptedExams[exam.id] ? (
                                        <>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12H9m12 0A9 9 0 1112 3a9 9 0 019 9z"
                                                />
                                            </svg>

                                            View Answers
                                        </>
                                    ) : examStatus === 'UPCOMING' ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Upcoming
                                        </>
                                    ) : examStatus === 'EXPIRED' ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Expired
                                        </>
                                    ) : (
                                        <>
                                            Start Exam
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
                        );
                    })}

                </div>

                {exams.length === 0 && (
                    <div className="text-center py-24 rounded-[28px]" style={{background:'rgba(15,10,35,0.75)',border:'1px solid rgba(168,85,247,0.15)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',boxShadow:'0 0 40px rgba(124,58,237,0.07),0 16px 48px rgba(0,0,0,0.5)'}}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(217,70,239,0.15))',border:'1px solid rgba(167,139,250,0.25)',boxShadow:'0 0 28px rgba(124,58,237,0.2)'}}>
                            <svg className="w-8 h-8" style={{color:'rgba(196,181,253,0.85)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-base mb-1" style={{color:'#f5f3ff'}}>No exams available right now</p>
                        <p className="text-sm" style={{color:'rgba(221,214,254,0.7)'}}>Check back later — new exams will appear here.</p>
                    </div>
                )}
                </>
                )}

            </div>

        </div>
    );
}

export default StudentDashboard;