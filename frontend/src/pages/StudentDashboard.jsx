import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/dashboard.css";
import "../styles/modal.css";
import PremiumLoader from "../components/PremiumLoader";
import ExamSection from "../components/ExamSection";
import {
    Bell,
    History,
    Trophy,
    Settings,
    LogOut,
    ShieldCheck,
    Lock,
    KeyRound,
    BadgeCheck,
    Eye,
    EyeOff,
    Sparkles,
    Clock3,
    ArrowRight,
    BookOpenCheck,
    Ban,
    TriangleAlert,
    FileText
} from "lucide-react";

function StudentDashboard() {
    const navigate = useNavigate();
    const dark = true;
    const [exams, setExams] = useState([]);
    const [examsLoading, setExamsLoading] = useState(true);
    const [examsError, setExamsError] = useState(false);
    const [attemptedExams, setAttemptedExams] = useState({});
    const [registeredExams, setRegisteredExams] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
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

        const interval = setInterval(() => {
            fetchNotifications();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await API.get(`/notifications/${email}`);
            setNotifications(response.data);
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
            
            const registrationChecks = await Promise.all(
                examList.map((exam) =>
                    API.get(`/registrations/check/${exam.id}/${encodeURIComponent(email)}`)
                        .then((r) => ({ id: exam.id, registered: r.data }))
                        .catch(() => ({ id: exam.id, registered: false }))
                )
            );

            const registrationMap = {};
            registrationChecks.forEach(({ id, registered }) => {
                registrationMap[id] = registered;
            });
            setRegisteredExams(registrationMap);

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

    const registerForExam = async (exam) => {
        try {
            await API.post("/registrations", {
                examId: exam.id,
                studentName: name,
                studentEmail: email
            });
            toast.success("Registered successfully!");
            setRegisteredExams((prev) => ({ ...prev, [exam.id]: true }));
        } catch (error) {
            toast.error("Already registered");
        }
    };

    const startExam = async (examId) => {
        const exam = exams.find((e) => e.id === examId);
        if (exam?.examType !== "PRACTICE" && !registeredExams[examId]) {
            toast.error("Please register first");
            return;
        }

        try {

        const elem = document.documentElement;
        if ( elem.requestFullscreen) {
            await elem.requestFullscreen();
        }
        } catch (err) {
        console.log( "Fullscreen blocked");
        }

        if (exam?.examType === "PRACTICE") {
            navigate(`/exam/${examId}`);
        } else {
            navigate(`/system-check/${examId}`);
        }
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
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    const getExamStatus = (exam) => {
        const now = new Date();
        const start = new Date(exam.startTime);
        const end = new Date(exam.endTime);

        if (now < start) return "UPCOMING";
        if (now > end) return "EXPIRED";
        return "ACTIVE";
    };

    const filterExams = (examList) => {
        return examList.filter((exam) => {
            const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === "ALL" || exam.examType === typeFilter;
            const matchesStatus = statusFilter === "ALL" || getExamStatus(exam) === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    };

    const practiceExams = filterExams(exams.filter((e) => e.examType === "PRACTICE"));
    const mockExams = filterExams(exams.filter((e) => e.examType === "MOCK"));
    const mainExams = filterExams(exams.filter((e) => e.examType === "MAIN"));

    const renderExamCard = (exam, index) => {
        const now = new Date();
        const examStart = new Date(exam.startTime);
        const examEnd = new Date(exam.endTime);

        let examStatus = "ACTIVE";
        let countdownText = "Active";

        if (now < examStart) {
            examStatus = "UPCOMING";
            countdownText = "Upcoming";
        } else if (now > examEnd) {
            examStatus = "EXPIRED";
            countdownText = "Expired";
        }

        const registrationStart = exam.registrationStart ? new Date(exam.registrationStart.replace("T", " ")) : null;
        const registrationEnd = exam.registrationEnd ? new Date(exam.registrationEnd.replace("T", " ")) : null;
        let registrationStatus = "OPEN";

        const canAttempt = exam.maxAttempts === -1 || !attemptedExams[exam.id];

        if (registrationStart && now < registrationStart) {
            registrationStatus = "NOT_STARTED";
        } else if (registrationEnd && now > registrationEnd) {
            registrationStatus = "CLOSED";
        } else {
            registrationStatus = "OPEN";
        }

        return (
            <div key={exam.id} className="exam-card premium-hover-lift group relative overflow-hidden">
                <div className="accent-strip" style={{
                    background: index % 3 === 0
                        ? 'linear-gradient(90deg,#facc15,#f59e0b)'
                        : index % 3 === 1
                        ? 'linear-gradient(90deg,#22d3ee,#3b82f6)'
                        : 'linear-gradient(90deg,#fde68a,#facc15)'
                }} />
                <div className="p-6 flex flex-col gap-0">
                    {/* Top row: icon + duration */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" style={{background:'linear-gradient(135deg,rgba(250,204,21,0.30),rgba(245,158,11,0.18))',border:'1px solid rgba(255,216,107,0.18)',color:'#fff7d6',boxShadow:'0 0 16px rgba(124,58,237,0.3),inset 0 1px 0 rgba(255,255,255,0.08)'}}>
                            {exam.id}
                        </div>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:'rgba(250,204,21,0.10)',border:'1px solid rgba(255,216,107,0.12)',color:'#fde68a'}}><Clock3 className="w-3.5 h-3.5" /> {exam.duration} mins</span>
                    </div>

                    {/* Title */}
                    <h3 className="exam-title mb-1">{exam.title}</h3>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{
                            background: exam.examType === "PRACTICE" ? "rgba(34,197,94,0.14)" : exam.examType === "MOCK" ? "rgba(59,130,246,0.14)" : "rgba(250,204,21,0.14)",
                            color: exam.examType === "PRACTICE" ? "#22c55e" : exam.examType === "MOCK" ? "#60a5fa" : "#fde68a"
                        }}>
                            {exam.examType}
                        </span>
                    </div>

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
                                    background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(250,204,21,0.10)',
                                    border: `1px solid ${urgent ? 'rgba(239,68,68,0.2)' : 'rgba(255,216,107,0.14)'}`,
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
                    <div className="flex gap-3 mt-2 flex-wrap">
                        <button
                            onClick={() => {
                                if (exam.examType !== "PRACTICE" && !registeredExams[exam.id] && registrationStatus === "OPEN") {
                                    registerForExam(exam);
                                    return;
                                }
                                if (exam.examType === "PRACTICE") {
                                    startExam(exam.id);
                                } else if (attemptedExams[exam.id]) {
                                    navigate(`/review/${encodeURIComponent(exam.title)}`);
                                } else {
                                    if (examStatus !== "ACTIVE") return;
                                    startExam(exam.id);
                                }
                            }}
                            disabled={!attemptedExams[exam.id] && ((exam.examType !== "PRACTICE" && !registeredExams[exam.id] && registrationStatus === "CLOSED") || (registrationStatus === "NOT_STARTED") || (examStatus === "EXPIRED") || !canAttempt)}
                            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn ${!attemptedExams[exam.id] && examStatus !== 'ACTIVE' && !(examStatus === "UPCOMING" && registrationStatus === "OPEN" && !registeredExams[exam.id]) ? 'cursor-not-allowed' : ''}`}
                            style={attemptedExams[exam.id] || (examStatus !== 'ACTIVE' && !(examStatus === "UPCOMING" && registrationStatus === "OPEN" && !registeredExams[exam.id])) || (exam.examType !== "PRACTICE" && !registeredExams[exam.id] && registrationStatus === "CLOSED")
                                ? { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.72)' }
                                : { background:'linear-gradient(135deg,#facc15,#eab308)', boxShadow:'0 12px 30px rgba(250,204,21,0.20)', color:'white' }
                            }
                        >
                            {exam.examType === "PRACTICE" ? (
                                <>
                                    Retry Practice
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                </>
                            ) : attemptedExams[exam.id] ? (
                                <>
                                    <FileText className="w-4 h-4" />
                                    View Answers
                                </>
                            ) : examStatus === 'UPCOMING' && exam.examType !== "PRACTICE" && !registeredExams[exam.id] && registrationStatus === "OPEN" ? (
                                <>Register</>
                            ) : examStatus === 'UPCOMING' ? (
                                <>
                                    <Clock3 className="w-4 h-4" />
                                    Upcoming
                                </>
                            ) : examStatus === 'EXPIRED' ? (
                                <>
                                    <Ban className="w-4 h-4" />
                                    Expired
                                </>
                            ) : !canAttempt ? (
                                <>Attempt Limit Reached</>
                            ) : exam.examType !== "PRACTICE" && registrationStatus === "CLOSED" && !registeredExams[exam.id] ? (
                                <>Registration Closed</>
                            ) : exam.examType !== "PRACTICE" && !registeredExams[exam.id] ? (
                                <>Please Register</>
                            ) : (
                                <>
                                    Start Exam
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>

                        {exam.examType === "PRACTICE" && attemptedExams[exam.id] && (
                            <button
                                onClick={() => navigate(`/review/${encodeURIComponent(exam.title)}`)}
                                className="w-full mt-3 py-2 rounded-xl text-sm font-medium"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                            >
                                View Answers
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`premium-root min-h-screen transition-colors duration-300 ${dark ? "" : ""}`} onClick={() => showDropdown && setShowDropdown(false)}>
            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />

            {/* Navbar */}
            <nav className="premium-navbar mx-4 md:mx-12 flex-wrap gap-3">
                <div className="navbar-logo">
                    <div className="logo-mark">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="logo-text-primary">Smart Exam Portal</div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`premium-icon-hover w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative ${dark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                        >
                            <Bell className="w-4 h-4" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-[92vw] sm:w-[370px] overflow-hidden z-50 rounded-[28px] border border-white/10 backdrop-blur-3xl bg-[linear-gradient(180deg,rgba(9,15,35,0.96),rgba(5,10,25,0.98))] shadow-[0_25px_80px_rgba(0,0,0,0.55),0_0_40px_rgba(250,204,21,0.08)] animate-fade-in">
                                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white text-lg font-bold tracking-tight"> Notifications</h3>
                                        <p className="text-white/45 text-xs mt-1">Latest exam activity</p></div>
                                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-300/10 flex items-center justify-center shadow-[0_0_24px_rgba(250,204,21,0.12)]"> <Bell className="w-4 h-4 text-amber-300" /> </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-14 px-6 text-center"><div className="w-16 h-16 mx-auto mb-5 rounded-3xl border border-white/10 bg-white/[0.03] flex items-center justify-center"><Bell className="w-7 h-7 text-white/40" /></div><p className="text-white/75 font-semibold">No notifications yet</p><p className="text-white/40 text-sm mt-2">New updates will appear here.</p></div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="px-6 py-5 border-b border-white/5 last:border-none transition-all duration-300 hover:bg-white/[0.03] group">
                                                <p className="text-[15px] font-semibold text-white/90 leading-6 group-hover:text-white transition-colors">{n.message}</p>
                                                <p className="text-[12px] text-amber-300/80 mt-2 font-medium tracking-wide">{new Date(n.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setShowDropdown(!showDropdown)} className="profile-btn premium-icon-hover">
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
                                    <div className="flex items-center gap-2"><History className="w-4 h-4" /><span>Exam History</span></div>
                                </div>
                                <div className="dropdown-item" onClick={() => navigate('/leaderboard')}>
                                    <div className="flex items-center gap-2"><Trophy className="w-4 h-4" /><span>Leaderboard</span></div>
                                </div>
                                <div className="dropdown-item" onClick={openModal}>
                                    <div className="flex items-center gap-2"><Settings className="w-4 h-4" /><span>Change Password</span></div>
                                </div>
                                <div className="dropdown-divider" />
                                <div className="dropdown-item" onClick={logout}>
                                    <div className="flex items-center gap-2"><LogOut className="w-4 h-4" /><span className="text-rose-400">Logout</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Change Password Modal */}
            {showModal && (
                <div className="cp-overlay">
                    <div className="cp-backdrop" onClick={closeModal} />
                    <div className="cp-card">
                        <div className="cp-top-strip" />
                        <div className="cp-header">
                            <div className="cp-header-left">
                                <div className="cp-icon-wrap">
                                    <Lock className="cp-icon" />
                                </div>
                                <div>
                                    <h2 className="cp-title">Change Password</h2>
                                    <p className="cp-subtitle">Update your account password</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="premium-close-btn">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="cp-body">
                            {/* Current Password */}
                            <div className="cp-field">
                                <label className="cp-label">Current Password</label>
                                <div className="cp-input-wrap">
                                    <span className="cp-input-icon">
                                        <KeyRound className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Enter current password"
                                        className={`${inputClass} premium-input`}
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
                                       <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className={`${inputClass} premium-input`}
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
                                        <BadgeCheck className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className={`${inputClass} premium-input`}
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
                                        <BadgeCheck className="w-4 h-4 flex-shrink-0" />
                                    ) : (
                                        <TriangleAlert className="w-4 h-4 flex-shrink-0" />
                                    )}
                                    {modalMessage.text}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="cp-actions flex gap-4 mt-8">
                                <button onClick={closeModal} className="premium-btn-secondary flex-1">Cancel</button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loadingPassword}
                                    className="premium-button premium-shine flex-1 flex items-center justify-center gap-2"
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
                                            <BadgeCheck className="w-4 h-4" />
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

            <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-10 max-w-[1700px] mx-auto">
                {/* Hero Section */}
                <div className="mb-14 premium-hero-card premium-hover-lift">
                    <div className="relative z-10 max-w-4xl flex flex-col items-start">
                        <span className="premium-badge mb-5">Student Dashboard</span>
                        <h2 className="premium-title text-5xl sm:text-6xl leading-[1.05] tracking-tight max-w-4xl flex items-center gap-4">
                            Welcome back, {name}
                            <span className="inline-flex items-center justify-center text-amber-300">
                                <Sparkles className="w-10 h-10" />
                            </span>
                        </h2>
                        <p className="premium-subtitle mt-6 text-lg leading-8 max-w-3xl">
                            Track exams, monitor performance, and continue your assessment journey.
                        </p>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h3 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-800"}`}>Exam Categories</h3>
                        <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{exams.length} exam{exams.length !== 1 ? "s" : ""} available for you</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/20">
                        {exams.length} Total
                    </span>
                </div>

                {/* Filters */}
                <div className="filters-container flex flex-col xl:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 h-[64px] px-6 rounded-[22px] premium-input text-white text-[15px] outline-none transition-all duration-300 placeholder:text-white/35"
                    />

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-[64px] px-6 rounded-[22px] premium-input text-white min-w-[190px] text-[15px] font-medium transition-all duration-300"
                        style={{ background: 'linear-gradient(180deg, rgba(10,15,30,0.96), rgba(5,8,22,0.96))', color: '#ffffff' }}
                    >
                        <option value="ALL">All Types</option>
                        <option value="PRACTICE">Practice</option>
                        <option value="MOCK">Mock</option>
                        <option value="MAIN">Main</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-[64px] px-6 rounded-[22px] premium-input text-white min-w-[190px] text-[15px] font-medium transition-all duration-300"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>

                {/* Loading state */}
                {examsLoading && (
                    <PremiumLoader title="Loading Dashboard..." subtitle="Fetching your examinations and activity." />
                )}

                {/* Error state */}
                {!examsLoading && examsError && (
                    <div className="text-center py-20 rounded-[28px] border border-red-500/15 bg-[rgba(15,23,42,0.72)] shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/20 bg-red-500/10 shadow-[0_0_24px_rgba(239,68,68,0.1)]">
                            <TriangleAlert className="w-8 h-8 text-red-300" />
                        </div>
                        <p className="font-semibold text-base mb-1 text-white">Failed to load exams</p>
                        <p className="text-sm mb-6 text-white/55">Something went wrong while fetching exams.</p>
                        <button
                            onClick={fetchExams}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{background:'linear-gradient(135deg,#facc15,#eab308)',color:'white',boxShadow:'0 4px 20px rgba(250,204,21,0.16)'}}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Exam Cards Grid */}
                {!examsLoading && !examsError && (
                    <>
                        <ExamSection title="Practice Exams" exams={practiceExams} renderExamCard={renderExamCard} />
                        <ExamSection title="Mock Exams" exams={mockExams} renderExamCard={renderExamCard} />
                        <ExamSection title="Main Exams" exams={mainExams} renderExamCard={renderExamCard} />

                        {exams.length === 0 && (
                            <div className="text-center py-24 rounded-[28px] border border-amber-400/15 bg-[rgba(15,23,42,0.72)] shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/20 bg-amber-500/10 shadow-[0_0_28px_rgba(250,204,21,0.08)]">
                                    <FileText className="w-8 h-8 text-amber-200" />
                                </div>
                                <p className="font-semibold text-base mb-1 text-white">No exams available right now</p>
                                <p className="text-sm text-white/70">Check back later — new exams will appear here.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;