import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";

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
        return { status: "No Images", color: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.2)", text: "#c4b5fd" };
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
                <p style={{ color: 'rgba(196,181,253,0.7)' }}>Exam not found</p>
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
                        <div style={{ fontSize: '11px', color: 'rgba(196,181,253,0.5)', letterSpacing: '0.3px' }}>Admin Panel</div>
                    </div>
                </div>

                <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/admin/exam/${id}`)} className="premium-back-btn">
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
                                    <div className="dropdown-item-icon">🚪</div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-6 md:px-12 py-10 max-w-screen-2xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 glass-hero">
                    <div className="relative z-10">
                        <span className="hero-accent">Face Verification</span>
                        <h2 className="hero-title">{exam.title}</h2>
                        <p className="hero-sub">Review facial recognition snapshots for all participants.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8 items-start">
                        <div style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(14px)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(167,139,250,0.15)' }}>
                            <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exam ID</p>
                            <p style={{ color: '#f3e8ff', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>#{exam.id}</p>
                        </div>

                        <div style={{ background: 'rgba(59,130,246,0.15)', backdropFilter: 'blur(14px)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(59,130,246,0.15)' }}>
                            <p style={{ color: 'rgba(96,165,250,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Face Logs</p>
                            <p style={{ color: '#93c5fd', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>{filteredLogs.length}</p>
                        </div>

                        <div style={{ background: 'rgba(34,197,94,0.15)', backdropFilter: 'blur(14px)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(34,197,94,0.15)' }}>
                            <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified</p>
                            <p style={{ color: '#86efac', fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>
                                {filteredLogs.filter(l => l.startFaceImage && l.endFaceImage).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Face Logs Grid */}
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl" style={{ border: '1px dashed rgba(167,139,250,0.2)', background: 'rgba(124,58,237,0.04)' }}>
                        <svg className="w-20 h-20 mx-auto mb-4" style={{ color: 'rgba(196,181,253,0.2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p style={{ color: '#f3e8ff' }} className="font-semibold text-xl mb-2">No Face Verification Logs</p>
                        <p style={{ color: 'rgba(196,181,253,0.6)' }}>No facial recognition data available for this exam yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredLogs.map((log, index) => {
                            const badgeInfo = getStatusBadge(log);

                            return (
                                <div
                                    key={log.id || index}
                                    className="premium-data-card rounded-2xl p-6"
                                    style={{
                                        background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.35)'
                                    }}
                                
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                                        <div>
                                            <h3 style={{ color: '#f3e8ff' }} className="font-bold text-lg">
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
                                            <p style={{ color: 'rgba(196,181,253,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '12px' }}>
                                                🟢 Start Snapshot
                                            </p>
                                            {log.startFaceImage ? (
                                                <div
                                                    className="relative group cursor-pointer rounded-xl overflow-hidden"
                                                    style={{
                                                        border: '1px solid rgba(167,139,250,0.25)',
                                                        aspectRatio: '4/3',
                                                        background: 'rgba(124,58,237,0.1)'
                                                    }}
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
                                                        <span style={{ color: '#f3e8ff', fontSize: '12px', fontWeight: 600 }}>🔍 View</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="rounded-xl flex items-center justify-center"
                                                    style={{
                                                        border: '1px dashed rgba(167,139,250,0.2)',
                                                        aspectRatio: '4/3',
                                                        background: 'rgba(124,58,237,0.05)'
                                                    }}
                                                >
                                                    <p style={{ color: 'rgba(196,181,253,0.4)', fontSize: '13px' }}>No snapshot available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* End Exam Face */}
                                        <div className="flex flex-col">
                                            <p style={{ color: 'rgba(239,68,68,0.7)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '12px' }}>
                                                🔴 End Snapshot
                                            </p>
                                            {log.endFaceImage ? (
                                                <div
                                                    className="relative group cursor-pointer rounded-xl overflow-hidden"
                                                    style={{
                                                        border: '1px solid rgba(239,68,68,0.25)',
                                                        aspectRatio: '4/3',
                                                        background: 'rgba(239,68,68,0.1)'
                                                    }}
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
                                                        <span style={{ color: '#f3e8ff', fontSize: '12px', fontWeight: 600 }}>🔍 View</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="rounded-xl flex items-center justify-center"
                                                    style={{
                                                        border: '1px dashed rgba(239,68,68,0.2)',
                                                        aspectRatio: '4/3',
                                                        background: 'rgba(239,68,68,0.05)'
                                                    }}
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
                            className="rounded-[28px] overflow-hidden max-w-3xl w-full premium-data-card"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                border: '1px solid rgba(167,139,250,0.3)',
                                boxShadow: '0 24px 96px rgba(124,58,237,0.3)'
                            }}
                        >
                            <img src={expandedImage} alt="Expanded Face Snapshot" className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]" />
                            <div className="text-center py-4" style={{ background: 'rgba(7,7,13,0.9)', borderTop: '1px solid rgba(167,139,250,0.2)' }}>
                                <button
                                    onClick={() => setExpandedImage(null)}
                                    style={{ color: 'rgba(196,181,253,0.7)', fontSize: '12px' }}
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
                    <div className="mt-12 rounded-2xl p-6" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}>
                        <h3 className="text-sm font-bold mb-4" style={{ color: '#f3e8ff' }}>📋 Verification Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p style={{ color: 'rgba(34,197,94,0.7)', fontSize: '12px', fontWeight: 600 }}>✅ Fully Verified</p>
                                <p style={{ color: '#86efac', marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
                                    {filteredLogs.filter(l => l.startFaceImage && l.endFaceImage).length}
                                </p>
                                <p style={{ color: 'rgba(34,197,94,0.5)', fontSize: '12px', marginTop: '2px' }}>Both snapshots available</p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(234,179,8,0.7)', fontSize: '12px', fontWeight: 600 }}>⚠️ Incomplete</p>
                                <p style={{ color: '#fde047', marginTop: '8px', fontSize: '18px', fontWeight: 700 }}>
                                    {filteredLogs.filter(l => (l.startFaceImage && !l.endFaceImage) || (!l.startFaceImage && l.endFaceImage)).length}
                                </p>
                                <p style={{ color: 'rgba(234,179,8,0.5)', fontSize: '12px', marginTop: '2px' }}>Missing snapshot</p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(239,68,68,0.7)', fontSize: '12px', fontWeight: 600 }}>❌ No Data</p>
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
