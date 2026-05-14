import { useEffect, useState } from "react";

import { useNavigate, useParams }
from "react-router-dom";

import API from "../services/api";

import "../styles/dashboard.css";

function LiveMonitoringPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [sessions, setSessions] =
        useState([]);

    const [exam, setExam] =
        useState(null);

    const fetchData = async () => {

        try {

            const examResponse =
                await API.get("/exams");

            const foundExam =
                examResponse.data.find(
                    e =>
                        e.id ===
                        parseInt(id)
                );

            setExam(foundExam);

            const response =
                await API.get(
                    "/monitor/live"
                );

            const filtered =
                response.data.filter(
                    s =>
                        s.examTitle ===
                        foundExam?.title
                );

            setSessions(filtered);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchData();

        const interval =
            setInterval(() => {

                fetchData();

            }, 5000);

        return () =>
            clearInterval(interval);

    }, [id]);

    return (

        <div className="premium-root min-h-screen">

            <div className="ambient-blob blob-a" />
            <div className="ambient-blob blob-b" />

            <div className="px-6 md:px-12 py-10 max-w-screen-2xl mx-auto">

                <div className="mb-10 glass-hero">

                    <div>

                        <span className="hero-accent">

                            Live Monitoring

                        </span>

                        <h2 className="hero-title">

                            {exam?.title}

                        </h2>

                        <p className="hero-sub">

                            Real-time active
                            student monitoring

                        </p>

                    </div>

                </div>

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    className="premium-btn-primary px-5 py-2 text-sm mb-8"
                >

                    ← Back

                </button>

                {sessions.length === 0 ? (

                    <div
                        className="rounded-2xl p-10 text-center"
                        style={{
                            background:
                                "rgba(255,255,255,0.03)",

                            border:
                                "1px solid rgba(255,255,255,0.06)"
                        }}
                    >

                        <h3 className="text-white text-xl font-bold mb-2">

                            No Active Students

                        </h3>

                        <p
                            style={{
                                color:
                                    "rgba(196,181,253,0.6)"
                            }}
                        >

                            No students are
                            currently attempting
                            this exam.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {sessions.map((s) => {

                            // ── Integrity derived from violations (UI only) ──
                            const integrity =
                                s.violations === 0 ? 'low'
                                : s.violations <= 2 ? 'medium'
                                : 'high';

                            const integrityLabel =
                                integrity === 'low'    ? 'Low Risk'
                                : integrity === 'medium' ? 'Medium Risk'
                                : 'High Risk';

                            const integrityColor =
                                integrity === 'low'    ? { text: '#86efac',  bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.35)' }
                                : integrity === 'medium' ? { text: '#fdba74',  bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.35)' }
                                : { text: '#fca5a5',  bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)'  };

                            const cardGlowBorder =
                                integrity === 'low'    ? 'rgba(34,197,94,0.22)'
                                : integrity === 'medium' ? 'rgba(249,115,22,0.28)'
                                : 'rgba(239,68,68,0.35)';

                            const topStripBg =
                                integrity === 'low'    ? 'linear-gradient(90deg,#10b981,#22c55e)'
                                : integrity === 'medium' ? 'linear-gradient(90deg,#f97316,#fb923c)'
                                : 'linear-gradient(90deg,#ef4444,#f43f5e)';

                            const isActive = s.status === 'ACTIVE';

                            return (
                                <div
                                    key={s.id}
                                    className="lm-card"
                                    style={{ '--lm-glow': cardGlowBorder }}
                                >
                                    {/* Top accent strip */}
                                    <div className="h-1 w-full" style={{ background: topStripBg }} />

                                    <div className="p-6">

                                        {/* Header row: name + LIVE badge */}
                                        <div className="flex items-start justify-between mb-5 gap-3">

                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Avatar */}
                                                <div className="lm-avatar" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                                                    {s.studentName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-bold text-base leading-tight truncate">
                                                        {s.studentName}
                                                    </h3>
                                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.5)' }}>
                                                        {s.examTitle}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* LIVE / SUBMITTED badge */}
                                            {isActive ? (
                                                <div className="lm-live-badge flex-shrink-0">
                                                    <span className="lm-live-dot" />
                                                    LIVE
                                                </div>
                                            ) : (
                                                <div
                                                    className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
                                                    style={{ background: 'rgba(148,163,184,0.12)', color: 'rgba(148,163,184,0.8)', border: '1px solid rgba(148,163,184,0.18)' }}
                                                >
                                                    SUBMITTED
                                                </div>
                                            )}
                                        </div>

                                        {/* Status indicators row */}
                                        <div className="lm-indicators">

                                            {/* Webcam */}
                                            <div className="lm-indicator">
                                                <div className={`lm-indicator-dot ${isActive ? 'lm-dot-green' : 'lm-dot-gray'}`} />
                                                <span className="lm-indicator-label">Webcam</span>
                                            </div>

                                            {/* Fullscreen */}
                                            <div className="lm-indicator">
                                                <div className={`lm-indicator-dot ${isActive ? 'lm-dot-green' : 'lm-dot-gray'}`} />
                                                <span className="lm-indicator-label">Fullscreen</span>
                                            </div>

                                            {/* Integrity */}
                                            <div className="lm-indicator">
                                                <div
                                                    className="lm-indicator-dot"
                                                    style={{ background: integrityColor.text, boxShadow: `0 0 6px ${integrityColor.text}` }}
                                                />
                                                <span className="lm-indicator-label">Integrity</span>
                                            </div>

                                        </div>

                                        {/* Divider */}
                                        <div className="lm-divider" />

                                        {/* Stats */}
                                        <div className="space-y-3">

                                            <div className="flex justify-between items-center">
                                                <span className="lm-stat-label">Violations</span>
                                                <span
                                                    className="lm-stat-val"
                                                    style={{ color: s.violations > 0 ? '#fca5a5' : '#86efac' }}
                                                >
                                                    {s.violations}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="lm-stat-label">Time Left</span>
                                                <span className="lm-stat-val" style={{ color: '#67e8f9' }}>
                                                    {Math.floor(s.timeLeft / 60)}m {s.timeLeft % 60}s
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="lm-stat-label">Integrity</span>
                                                <span
                                                    className="lm-integrity-badge"
                                                    style={{
                                                        color:       integrityColor.text,
                                                        background:  integrityColor.bg,
                                                        border:      `1px solid ${integrityColor.border}`,
                                                    }}
                                                >
                                                    {integrityLabel}
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default LiveMonitoringPage;