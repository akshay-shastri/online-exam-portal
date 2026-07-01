import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import {FileText,FilePlus2,Plus,Minus,Clock3,CalendarClock,CircleHelp, LogOut,PlusCircle,FilePenLine, PlayCircle, StopCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function CreateExam() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [examType, setExamType] = useState("MAIN");
    const [registrationStart, setRegistrationStart] = useState(null);
    const [registrationEnd, setRegistrationEnd] = useState(null);
    const [positiveMarks, setPositiveMarks] = useState("");
    const [negativeMarks, setNegativeMarks] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const inputClass = "w-full bg-black/40 border border-amber-500/25 text-amber-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 placeholder-amber-400/40 transition-all duration-200 hover:border-amber-400/40 backdrop-blur-sm";
    const dateTimeInputClass = "w-full bg-black/50 border border-amber-500/30 text-amber-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/60 transition-all duration-300 hover:border-amber-400/50 backdrop-blur-sm cursor-pointer";
    const labelClass = "block text-xs font-semibold text-amber-300/70 uppercase tracking-wider mb-2";

    const formatDateTimeForDisplay = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

   const formatDateTimeForBackend = (date) => {

    if (!date) return null;

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    const hours =
        String(date.getHours())
            .padStart(2, "0");

    const minutes =
        String(date.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(date.getSeconds())
            .padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const getExamConfig = () => {
        switch (examType) {
            case "PRACTICE":
                return {
                    maxAttempts: -1,
                    reviewEnabled: true,
                    proctoringEnabled: false
                };
            case "MOCK":
                return {
                    maxAttempts: 1,
                    reviewEnabled: true,
                    proctoringEnabled: true
                };
            default:
                return {
                    maxAttempts: 1,
                    reviewEnabled: false,
                    proctoringEnabled: true
                };
        }
    };

    const createExam = async () => {
        if (loading) return;

        // Basic validation
        if (!title.trim()) {
            toast.error("Exam title is required.");
            return;
        }
        if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
            toast.error("Please enter a valid duration.");
            return;
        }

        setLoading(true);

        try {
            const config = getExamConfig();
            const payload = {
            title,
            duration: parseInt(duration),
            positiveMarks: positiveMarks ? parseFloat(positiveMarks) : 1,
            negativeMarks: negativeMarks ? parseFloat(negativeMarks) : 0,
            startTime: formatDateTimeForBackend(startTime),
            endTime: formatDateTimeForBackend(endTime),
            active: true,
            examType,
            registrationStart: formatDateTimeForBackend(registrationStart),
            registrationEnd: formatDateTimeForBackend(registrationEnd),
            maxAttempts: config.maxAttempts,
            reviewEnabled: config.reviewEnabled,
            proctoringEnabled: config.proctoringEnabled,
        };

        console.log(payload);

        const response = await API.post("/exams", payload);

        toast.success("Exam created successfully!");
        console.log(response.data);

        // Navigate back to admin dashboard
        setTimeout(() => navigate("/admin-dashboard"), 500);
        } catch (error) {
            console.error(error.response?.data || error);
            toast.error("Failed to create exam. Please try again.");
        } finally {
            setLoading(false);
        }
        };

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    return (
        <div className="premium-root min-h-screen" onClick={() => showDropdown && setShowDropdown(false)}>
            {loading && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
                    <PremiumLoader
                        title="Creating Examination..."
                        subtitle="Configuring exam structure, rules, and assessment settings."
                        height="100vh"
                    />
                </div>
            )}
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
                    <button onClick={() => navigate("/admin-dashboard")} className="premium-back-btn">
                        ← Back
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
                                    <div className="dropdown-item-icon"> <LogOut className="w-4 h-4" /></div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
                {/* Hero Section */}
                    <div className="mb-14 premium-hero-card premium-hover-lift">
                        <div className="relative z-10 max-w-4xl flex flex-col items-start">
                            <span className="premium-badge mb-5">Create Exam</span>
                            <h2 className="premium-title text-5xl sm:text-6xl leading-[1.05] tracking-tight max-w-4xl flex items-center gap-4">Add New Examination<span className="inline-flex items-center justify-center text-amber-300"><FilePlus2 className="w-10 h-10" /></span></h2>
                            <p className="premium-subtitle mt-6 text-lg leading-8 max-w-3xl">Configure exam details, marking scheme, and time constraints for your assessment.</p>
                        </div>
                    </div>

                {/* Create Exam Card */}
                <div className="premium-create-exam-card premium-shine">
                    {/* Accent Strip */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-amber-500/60 via-yellow-500/40 to-amber-600/50" />

                    <div className="p-8 md:p-10 space-y-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="premium-create-icon"> <PlusCircle className="w-5 h-5 text-amber-300" /></div>
                            <div>
                                <h2 className="premium-section-title">Exam Configuration</h2>
                                <p className="premium-muted-text">Set up your examination parameters</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Exam Title */}
                            <div>
                                <label className={`${labelClass} flex items-center gap-2`}> <FilePenLine className="w-4 h-4 text-amber-300" /> Exam Title </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mathematics Final Exam"
                                    className={`${inputClass} premium-input`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Marks Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`${labelClass} flex items-center gap-2`}> <Plus className="w-4 h-4 text-emerald-400" /> Positive Marks </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 1"
                                        className={`${inputClass} premium-input`}
                                        value={positiveMarks}
                                        onChange={(e) => setPositiveMarks(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={`${labelClass} flex items-center gap-2`}> <Minus className="w-4 h-4 text-red-400" />Negative Marks</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 0.25"
                                        className={`${inputClass} premium-input`}
                                        value={negativeMarks}
                                        onChange={(e) => setNegativeMarks(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClass}>Exam Type</label>
                                <select
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                    className={`${inputClass} premium-input`}
                                >
                                    <option value="PRACTICE">Practice Exam</option>
                                    <option value="MOCK">Mock Exam</option>
                                    <option value="MAIN">Main Exam</option>
                                </select>
                            </div>

                            {examType !== "PRACTICE" && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Registration Start</label>
                                        <DatePicker
                                            selected={registrationStart}
                                            onChange={(date) => setRegistrationStart(date)}
                                            showTimeSelect
                                            timeIntervals={5}
                                            dateFormat="dd MMM yyyy, hh:mm aa"
                                            placeholderText="Select registration start"
                                            className={`${dateTimeInputClass} premium-input`}
                                            popperClassName="premium-datepicker-popper"
                                            calendarClassName="premium-datepicker"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Registration End</label>
                                        <DatePicker
                                            selected={registrationEnd}
                                            onChange={(date) => setRegistrationEnd(date)}
                                            showTimeSelect
                                            timeIntervals={5}
                                            dateFormat="dd MMM yyyy, hh:mm aa"
                                            placeholderText="Select registration end"
                                            className={`${dateTimeInputClass} premium-input`}
                                            popperClassName="premium-datepicker-popper"
                                            calendarClassName="premium-datepicker"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Duration */}
                            <div>
                                <label className={`${labelClass} flex items-center gap-2`}> <Clock3 className="w-4 h-4 text-amber-300" />Duration (minutes)</label>
                                <input
                                    type="number"
                                    placeholder="Duration in minutes"
                                    className={`${inputClass} premium-input`}
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>

                            {/* Time Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`${labelClass} flex items-center gap-2`}> <PlayCircle className="w-4 h-4 text-emerald-400" /> Start Time (Optional) </label>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        showTimeSelect
                                        timeIntervals={5}
                                        dateFormat="dd MMM yyyy, hh:mm aa"
                                        placeholderText="Select exam start"
                                        className={`${dateTimeInputClass} premium-input`}
                                        popperClassName="premium-datepicker-popper"
                                        calendarClassName="premium-datepicker"
                                    />
                                    {startTime && (
                                        <p style={{ color: 'rgba(74,222,128,0.6)' }} className="text-xs mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            {formatDateTimeForDisplay(startTime)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={`${labelClass} flex items-center gap-2`}> <StopCircle className="w-4 h-4 text-red-400" /> End Time (Optional) </label>
                                    <DatePicker
                                        selected={endTime}
                                        onChange={(date) => setEndTime(date)}
                                        showTimeSelect
                                        timeIntervals={5}
                                        dateFormat="dd MMM yyyy, hh:mm aa"
                                        placeholderText="Select exam end"
                                        className={`${dateTimeInputClass} premium-input`}
                                        popperClassName="premium-datepicker-popper"
                                        calendarClassName="premium-datepicker"
                                    />
                                    {endTime && (
                                        <p style={{ color: 'rgba(248,113,113,0.6)' }} className="text-xs mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            {formatDateTimeForDisplay(endTime)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-6">
                                <button
                                    onClick={() => navigate("/admin-dashboard")}
                                    className="premium-btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createExam}
                                    disabled={loading}
                                    className="premium-button premium-shine flex-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Creating Exam...
                                        </>
                                    ) : (
                                        <>
                                           <Plus className="w-4 h-4" />
                                            Create Exam
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="premium-card mt-10 p-8 premium-shine">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300"> <FileText className="w-5 h-5" /></div>
                        <h3 className="text-sm font-bold tracking-wide text-white">
                            Configuration Guide</h3>
                    </div>
                    <ul className="space-y-4 text-sm leading-relaxed text-white/70">

                        <li className="flex gap-3">
                            <div className="text-emerald-400 flex-shrink-0 mt-0.5"> <Plus className="w-4 h-4" /></div>

                            <span><strong className="text-amber-300"> Positive Marks: </strong> Points awarded for each correct answer (default: 1) </span>
                        </li>

                        <li className="flex gap-3">
                            <div className="text-red-400 flex-shrink-0 mt-0.5"><Minus className="w-4 h-4" /> </div>
                             <span><strong className="text-amber-300">Negative Marks: </strong>{" "}Points deducted for each wrong answer (default: 0) </span>
                        </li>

                        <li className="flex gap-3">
                            <div className="text-sky-400 flex-shrink-0 mt-0.5"><Clock3 className="w-4 h-4" /> </div>
                            <span><strong className="text-amber-300">Duration:</strong>{" "}Exam time limit in minutes (required) </span>
                        </li>

                        <li className="flex gap-3">
                            <div className="text-violet-400 flex-shrink-0 mt-0.5">
                                <CalendarClock className="w-4 h-4" />
                            </div>

                            <span>
                                <strong className="text-amber-300">
                                    Start/End Time:
                                </strong>{" "}
                                Optional. Leave blank for no time restrictions.
                            </span>
                        </li>

                        <li className="flex gap-3">
                            <div className="text-amber-300 flex-shrink-0 mt-0.5">
                                <CircleHelp className="w-4 h-4" />
                            </div>

                            <span>
                                <strong className="text-amber-300">
                                    Questions:
                                </strong>{" "}
                                After creating the exam, add questions from the dashboard.
                            </span>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CreateExam;