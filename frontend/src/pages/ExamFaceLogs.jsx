import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import { LogOut, ArrowLeft,  Camera,PlayCircle, StopCircle, Search, ClipboardList,ShieldCheck, AlertTriangle,XCircle} from "lucide-react";

function ExamFaceLogs() {
    const navigate = useNavigate();
    const { id } = useParams();
    const name = localStorage.getItem("name");
    const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

    const [exam, setExam] = useState(null);
    const [faceLogs, setFaceLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    useEffect(() => {
        fetchExamAndFaceLogs();
    }, [id]);

    const fetchExamAndFaceLogs = async () => {
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

            // Fetch all results/face logs
            const resultsResponse = await API.get("/results");
            const allResults = resultsResponse.data || [];

            setFaceLogs(allResults);

            // Filter logs for this exam
            const examLogs = allResults.filter(
                r => r.examTitle && r.examTitle === foundExam.title
            );

            setFilteredLogs(examLogs);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load face verification data");
            navigate("/admin-dashboard");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (log) => {
        // Determine status based on available face snapshots
        if (log.startFaceImage && log.endFaceImage) {
            return { status: "Verified", color: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.2)", text: "#86efac" };
        }
        if (log.startFaceImage && !log.endFaceImage) {
            return { status: "No End Snapshot", color: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.2)", text: "#fde047" };
        }
        if (!log.startFaceImage && log.endFaceImage) {
            return { status: "Face Changed", color: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.2)", text: "#fca5a5" };
        }
        return { status: "No Images", color: "rgba(167,139,250,0.15)", border: "rgba(255,216,107,0.12)", text: "#ffe27a" };
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
                        <span className="hero-accent">Face Verification</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Review facial recognition snapshots for all participants.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8 items-start">

    <div className="stats-card premium-shine min-w-[220px]">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.5px]">
            Exam ID
        </p>

        <p className="text-white text-2xl font-extrabold mt-2">
            #{exam.id}
        </p>
    </div>

    <div className="stats-card premium-shine min-w-[220px]">
        <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
            Face Logs
        </p>

        <p className="text-blue-300 text-2xl font-extrabold mt-2">
            {filteredLogs.length}
        </p>
    </div>

    <div className="stats-card premium-shine min-w-[220px]">
        <p className="text-emerald-300/70 text-xs font-semibold uppercase tracking-[0.5px]">
            Verified
        </p>

        <p className="text-emerald-300 text-2xl font-extrabold mt-2">
            {filteredLogs.filter(l => l.startFaceImage && l.endFaceImage).length}
        </p>
    </div>

</div>
                </div>

                {/* Face Logs Grid */}
                {filteredLogs.length === 0 ? (
                    <div className="empty-state-card text-center py-24 premium-shine">                       
                     <Camera className="w-20 h-20 mx-auto mb-4 text-violet-300/20" />
                        <p style={{ color: '#ffffff' }} className="font-semibold text-xl mb-2">No Face Verification Logs</p>
                        <p style={{ color: 'rgba(196,181,253,0.6)' }}>No facial recognition data available for this exam yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredLogs.map((log, index) => {
                            const badgeInfo = getStatusBadge(log);

                            return (
                                <div
                                    key={log.id || index}
                                    className="activity-violation-card premium-shine p-6"
                                
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                                        <div>
                                            <h3 style={{ color: '#ffffff' }} className="font-bold text-lg">
                                                {log.studentName}
                                            </h3>
                                            <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '13px', marginTop: '4px' }}>
                                                {log.examTitle}
                                            </p>
                                        </div>

                                        <span
                                            className="text-xs font-semibold px-4 py-2 rounded-full border"
                                            style={{
                                                background: badgeInfo.color,
                                                borderColor: badgeInfo.border,
                                                color: badgeInfo.text
                                            }}
                                        >
                                            {badgeInfo.status}
                                        </span>
                                    </div>

                                    {/* Image Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Start Exam Face */}
                                        <div className="flex flex-col">
                                            <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.70)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '12px' }}><PlayCircle className="w-4 h-4 text-emerald-400" /><span>Start Snapshot</span></p>
                                            {log.startFaceImage ? (
                                                <div
                                                    className="face-snapshot-card relative group cursor-pointer overflow-hidden"
        
                                                    onClick={() => setExpandedImage(log.startFaceImage)}
                                                >
                                                    <img
                                                        src={log.startFaceImage}
                                                        alt="Start Face Snapshot"
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        style={{ background: 'rgba(0,0,0,0.5)' }}
                                                    >
                                                        <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}><div className="flex items-center gap-2"><Search className="w-4 h-4" /><span>View</span></div></span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="face-empty-card flex items-center justify-center"
                                                   
                                                >
                                                    <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '13px' }}>No snapshot available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* End Exam Face */}
                                        <div className="flex flex-col">
                                           <p className="flex items-center gap-2" style={{ color: 'rgba(239,68,68,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '12px' }}><StopCircle className="w-4 h-4 text-red-400" /><span>End Snapshot</span></p>
                                            {log.endFaceImage ? (
                                                <div
                                                    className="face-snapshot-card relative group cursor-pointer overflow-hidden"
                                                    
                                                    onClick={() => setExpandedImage(log.endFaceImage)}
                                                >
                                                    <img
                                                        src={log.endFaceImage}
                                                        alt="End Face Snapshot"
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        style={{ background: 'rgba(0,0,0,0.5)' }}
                                                    >
                                                        <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}><div className="flex items-center gap-2"><Search className="w-4 h-4" /><span>View</span></div></span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="face-empty-card flex items-center justify-center"
                                                   
                                                >
                                                    <p style={{ color: 'rgba(239,68,68,0.4)', fontSize: '13px' }}>No snapshot available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Image Expansion Modal */}
                {expandedImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(2,6,23,0.88)' }}
                        onClick={() => setExpandedImage(null)}
                    >
                        <div
                            className="face-modal-card max-w-3xl w-full"
                            onClick={(e) => e.stopPropagation()}
                            
                        >
                            <img src={expandedImage} alt="Expanded Face Snapshot" className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]" />
                            <div className="text-center py-4" style={{ background: 'rgba(7,7,13,0.9)', borderTop: '1px solid rgba(255,216,107,0.12)' }}>
                                <button
                                    onClick={() => setExpandedImage(null)}
                                    style={{ color: 'rgba(255,255,255,0.70)', fontSize: '12px' }}
                                    className="hover:text-white transition-colors"
                                >
                                    Press ESC or click to close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                {filteredLogs.length > 0 && (
                    <div className="activity-violation-card premium-shine mt-12 p-8" >
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}><ClipboardList className="w-4 h-4 text-amber-300" /><span>Verification Summary</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p style={{ color: 'rgba(34,197,94,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(34,197,94,0.7)', fontSize: '12px', fontWeight: 600 }}><ShieldCheck className="w-4 h-4" /><span>Fully Verified</span></p></p>
                                <p style={{ color: '#86efac', marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
                                    {filteredLogs.filter(l => l.startFaceImage && l.endFaceImage).length}
                                </p>
                                <p style={{ color: 'rgba(34,197,94,0.5)', fontSize: '12px', marginTop: '2px' }}>Both snapshots available</p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(234,179,8,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(234,179,8,0.7)', fontSize: '12px', fontWeight: 600 }}><AlertTriangle className="w-4 h-4" /><span>Incomplete</span></p></p>
                                <p style={{ color: '#fde047', marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
                                    {filteredLogs.filter(l => (l.startFaceImage && !l.endFaceImage) || (!l.startFaceImage && l.endFaceImage)).length}
                                </p>
                                <p style={{ color: 'rgba(234,179,8,0.5)', fontSize: '12px', marginTop: '2px' }}>Missing snapshot</p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(239,68,68,0.7)', fontSize: '12px', fontWeight: 600 }}><p className="flex items-center gap-2" style={{ color: 'rgba(239,68,68,0.7)', fontSize: '12px', fontWeight: 600 }}><XCircle className="w-4 h-4" /><span>No Data</span></p></p>
                                <p style={{ color: '#fca5a5', marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
                                    {filteredLogs.filter(l => !l.startFaceImage && !l.endFaceImage).length}
                                </p>
                                <p style={{ color: 'rgba(239,68,68,0.5)', fontSize: '12px', marginTop: '2px' }}>No snapshots</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExamFaceLogs;
