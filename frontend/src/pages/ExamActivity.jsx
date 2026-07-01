import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import { LogOut, ArrowLeft,   ShieldAlert,   User, RefreshCw, Clipboard, AlertTriangle, Siren, Info, ShieldCheck} from "lucide-react";


function ExamActivity() {
    const navigate = useNavigate();
    const { id } = useParams();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exam, setExam] = useState(null);
    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchExamAndViolations();
    }, [id]);

    const fetchExamAndViolations = async () => {
        setLoading(true);
        try {
            // Fetch exam details
            const examResponse = await API.get("/exams");
            const exams = examResponse.data;
            const foundExam = exams.find(e => e.id === parseInt(id));

            if (!foundExam) {
                toast.error("Exam not found");
                navigate("/admin-dashboard");
                return;
            }

            setExam(foundExam);

            // Fetch all violations
            const violationsResponse = await API.get("/violations");
            const allViolations = violationsResponse.data || [];

            setViolations(allViolations);

            // Filter violations for this exam
            const examViolations = allViolations.filter(
                v => v.examTitle && v.examTitle === foundExam.title
            );

            setFilteredViolations(examViolations);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load activity data");
            navigate("/admin-dashboard");
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (violationType) => {
        const type = violationType?.toLowerCase() || "";

        if (type.includes("no face") || type.includes("multiple faces")) {
            return { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", text: "#fca5a5", label: "Critical" };
        }
        if (type.includes("tab switch") || type.includes("copy")) {
            return { bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.2)", text: "#fdba74", label: "Suspicious" };
        }
        if (type.includes("movement")) {
            return { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.2)", text: "#fde047", label: "Warning" };
        }
        return { bg: "rgba(255,216,107,0.08)", border: "rgba(255,216,107,0.16)", text: "#ffe27a", label: "Info" };
    };

    // const getViolationIcon = (violationType) => {
    //     const type = violationType?.toLowerCase() || "";

    //     if (type.includes("tab")) return "⚠️";
    //     if (type.includes("face")) return "👤";
    //     if (type.includes("movement")) return "🔄";
    //     if (type.includes("copy")) return "📋";
    //     return "🚨";
    // };

    const uniqueStudents = new Set(filteredViolations.map(v => v.studentName)).size;

    const violationCounts = {};
    filteredViolations.forEach(v => {
        violationCounts[v.violationType] = (violationCounts[v.violationType] || 0) + 1;
    });
    const mostCommonViolation = Object.entries(violationCounts).sort((a, b) => b[1] - a[1])[0];

    const logout = () => {
        setShowDropdown(false);
        localStorage.clear();
        toast.success("Logged out successfully.");
        setTimeout(() => navigate("/login"), 1000);
    };

    if (loading) {
        return (
            <PremiumLoader
                title="Loading Activity Data..."
                subtitle="Fetching student violations and monitoring analytics."
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
                       <div className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /><span>Back</span></div>
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
                        <span className="hero-accent">Activity Monitor</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Track suspicious activities and violations during exam.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8 items-start">
                        <div className="stats-card premium-shine">
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exam ID</p>
                            <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>#{exam.id}</p>
                        </div>
                        <div className="stats-card stats-card-danger premium-shine">
                            <p style={{ color: 'rgba(251,113,133,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Violations</p>
                            <p style={{ color: '#fca5a5', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>{filteredViolations.length}</p>
                        </div>
                        <div className="stats-card premium-shine">
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unique Students</p>
                            <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>{uniqueStudents}</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {filteredViolations.length > 0 && mostCommonViolation && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                        <div className="activity-violation-card premium-shine p-6">
                            <p style={{ color: 'rgba(217,119,6,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Most Common Violation</p>
                            <p style={{ color: '#fdba74', fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>{mostCommonViolation[0]}</p>
                            <p style={{ color: 'rgba(217,119,6,0.5)', fontSize: '12px', marginTop: '4px' }}>Occurred {mostCommonViolation[1]} times</p>
                        </div>

                        <div className="activity-violation-card premium-shine p-6">
                            <p style={{ color: 'rgba(234,179,8,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Average Violations</p>
                            <p style={{ color: '#fde047', fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>
                                {(filteredViolations.length / uniqueStudents).toFixed(1)}
                            </p>
                            <p style={{ color: 'rgba(234,179,8,0.5)', fontSize: '12px', marginTop: '4px' }}>Per student</p>
                        </div>

                        <div className="activity-violation-card premium-shine p-6">
                            <p style={{ color: 'rgba(59,130,246,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Violation Types</p>
                            <p style={{ color: '#93c5fd', fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>
                                {Object.keys(violationCounts).length}
                            </p>
                            <p style={{ color: 'rgba(59,130,246,0.5)', fontSize: '12px', marginTop: '4px' }}>Different types</p>
                        </div>
                    </div>
                )}

                {/* Activity List */}
                {filteredViolations.length === 0 ? (
                    <div className="text-center py-24 empty-state-card">
                        <ShieldCheck className="w-20 h-20 mx-auto mb-4 text-emerald-400/30" />
                        <p style={{ color: '#ffffff' }} className="font-semibold text-xl mb-2">No Suspicious Activities Detected</p>
                        <p style={{ color: 'rgba(255,255,255,0.52)' }}>This exam has a clean record with no violations.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredViolations.map((violation, index) => {
                            const severity = getSeverityColor(violation.violationType);

                            return (
                                <div
                                    key={violation.id || index}
                                    className="activity-violation-card premium-shine p-6">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-max">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div
                                                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                                    style={{
                                                        background: severity.bg,
                                                        border: `1px solid ${severity.border}`,
                                                        color: severity.text
                                                    }}
                                                >
                                                    {
                                                        violation.violationType?.toLowerCase().includes("tab") ? (
                                                            <AlertTriangle className="w-5 h-5" />
                                                        ) : violation.violationType?.toLowerCase().includes("face") ? (
                                                            <User className="w-5 h-5" />
                                                        ) : violation.violationType?.toLowerCase().includes("movement") ? (
                                                            <RefreshCw className="w-5 h-5" />
                                                        ) : violation.violationType?.toLowerCase().includes("copy") ? (
                                                            <Clipboard className="w-5 h-5" />
                                                        ) : (
                                                            <ShieldAlert className="w-5 h-5" />
                                                        )
                                                    }
                                                </div>
                                                <h3 style={{ color: '#ffffff' }} className="font-semibold text-lg">
                                                    {violation.studentName}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Violation Type</p>
                                                    <p style={{ color: '#ffffff', marginTop: '4px', fontSize: '14px' }} className="font-medium">
                                                        {violation.violationType}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Exam</p>
                                                    <p style={{ color: '#ffffff', marginTop: '4px', fontSize: '14px' }} className="font-medium">
                                                        {violation.examTitle}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Time</p>
                                                    <p style={{ color: '#ffffff', marginTop: '4px', fontSize: '14px' }} className="font-medium">
                                                        {new Date(violation.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-xs font-semibold px-4 py-2 rounded-full border"
                                                style={{
                                                    background: severity.bg,
                                                    borderColor: severity.border,
                                                    color: severity.text
                                                }}
                                            >
                                                {severity.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info Section */}
                {filteredViolations.length > 0 && (
                    <div className="mt-12 rounded-2xl p-6 premium-card">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}><Info className="w-4 h-4 text-amber-300" /><span>Violation Categories</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="flex items-center gap-2" style={{ color: 'rgba(251,113,133,0.7)', fontSize: '12px', fontWeight: 600 }}><Siren className="w-4 h-4" /><span>Critical</span></p>
                                <p style={{ color: '#fca5a5', marginTop: '6px', fontSize: '16px', fontWeight: 700 }}>
                                    {filteredViolations.filter(v => v.violationType?.toLowerCase().includes("no face") || v.violationType?.toLowerCase().includes("multiple faces")).length}
                                </p>
                            </div>
                            <div>
                                <p className="flex items-center gap-2" style={{ color: 'rgba(217,119,6,0.7)', fontSize: '12px', fontWeight: 600 }}><AlertTriangle className="w-4 h-4" /><span>Suspicious</span></p>
                                <p style={{ color: '#fdba74', marginTop: '6px', fontSize: '16px', fontWeight: 700 }}>
                                    {filteredViolations.filter(v => v.violationType?.toLowerCase().includes("tab") || v.violationType?.toLowerCase().includes("copy")).length}
                                </p>
                            </div>
                            <div>
                                <p className="flex items-center gap-2" style={{ color: 'rgba(234,179,8,0.7)', fontSize: '12px', fontWeight: 600 }}><ShieldAlert className="w-4 h-4" /><span>Warning</span></p>
                                <p style={{ color: '#fde047', marginTop: '6px', fontSize: '16px', fontWeight: 700 }}>
                                    {filteredViolations.filter(v => v.violationType?.toLowerCase().includes("movement")).length}
                                </p>
                            </div>
                            <div>
                                <p className="flex items-center gap-2" style={{ color: 'rgba(255,216,107,0.7)', fontSize: '12px', fontWeight: 600 }}><Info className="w-4 h-4" /><span>Other</span></p>
                                <p style={{ color: '#ffe27a', marginTop: '6px', fontSize: '16px', fontWeight: 700 }}>
                                    {filteredViolations.filter(v => {
                                        const type = v.violationType?.toLowerCase() || "";
                                        return !type.includes("face") && !type.includes("tab") && !type.includes("copy") && !type.includes("movement");
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExamActivity;