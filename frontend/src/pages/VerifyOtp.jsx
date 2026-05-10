import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerifyOtp = async () => {
        if (!otp) { toast.error("Please enter OTP"); return; }
        setLoading(true);
        try {
            const response = await API.post("/auth/verify-otp", { email, otp });
            const message = response.data;
            if (message === "Email Verified Successfully") {
                toast.success("Email verified successfully!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error("OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setResending(true);
        try {
            const response = await API.post("/auth/resend-otp", { email });
            const message = response.data;
            if (message === "OTP Resent Successfully") {
                toast.success("OTP resent successfully!");
                setTimer(60);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error("Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    const timerPercent = (timer / 60) * 100;
    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - (timerPercent / 100) * circumference;

    return (
        <div className="vo-root">

            {/* Background blobs */}
            <div className="vo-blob vo-blob-tr" />
            <div className="vo-blob vo-blob-bl" />
            <div className="vo-blob vo-blob-center" />

            <div className="vo-container">

                {/* ── Card ── */}
                <div className="vo-card">

                    {/* Top accent strip */}
                    <div className="vo-strip" />

                    {/* Icon + header */}
                    <div className="vo-header">

                        {/* Icon with timer ring */}
                        <div className="vo-icon-wrap">
                            <div className="vo-icon-box">
                                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {/* Timer ring */}
                            <div className="vo-ring-wrap">
                                <svg className="vo-ring-svg" viewBox="0 0 52 52">
                                    <circle cx="26" cy="26" r="20" fill="none"
                                        stroke="rgba(124,58,237,0.15)" strokeWidth="3" />
                                    <circle cx="26" cy="26" r="20" fill="none"
                                        stroke="url(#voRingGrad)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        className="vo-ring-progress"
                                    />
                                    <defs>
                                        <linearGradient id="voRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        <h1 className="vo-title">Verify Your Email</h1>
                        <p className="vo-sub">We sent a 6-digit code to</p>
                        <div className="vo-email-pill">
                            <span className="vo-email-text">{email || "your email"}</span>
                        </div>
                    </div>

                    {/* ── Form ── */}
                    <div className="vo-form">

                        {/* OTP input */}
                        <div className="vo-field">
                            <label className="vo-label">Enter OTP Code</label>
                            <input
                                type="text"
                                placeholder="• • • • • •"
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                                className="vo-input"
                            />
                        </div>

                        {/* Verify button */}
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length < 6}
                            className="premium-btn-primary vo-btn-verify"
                        >
                            {loading ? (
                                <>
                                    <svg className="vo-spin" fill="none" viewBox="0 0 24 24" width="16" height="16">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify Email
                                </>
                            )}
                        </button>

                        {/* Resend section */}
                        <div className="vo-resend-wrap">
                            {timer > 0 ? (
                                <p className="vo-resend-timer">
                                    Resend code in{" "}
                                    <span className="vo-resend-countdown">{timer}s</span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="vo-resend-btn"
                                >
                                    {resending ? (
                                        <>
                                            <svg className="vo-spin" fill="none" viewBox="0 0 24 24" width="14" height="14">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                                            </svg>
                                            Resending...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Resend OTP
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Help note */}
                    <div className="vo-help-note">
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.7 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="vo-help-text">
                            <span className="vo-help-bold">Didn't receive it?</span>{" "}
                            Check your spam folder or wait before resending.
                        </p>
                    </div>

                </div>

                {/* Footer link */}
                <p className="vo-footer">
                    Wrong email?{" "}
                    <button onClick={() => navigate("/register")} className="vo-footer-link">
                        Go back
                    </button>
                </p>

            </div>
        </div>
    );
}

export default VerifyOtp;
