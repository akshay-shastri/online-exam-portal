import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";
import { Mail,CheckCircle2,RefreshCw,Info } from "lucide-react";

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
            {loading && (

    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm">

        <PremiumLoader
            title="Verifying OTP..."
            subtitle="Securing and validating your email verification request."
            height="100vh"
        />

    </div>

)}

            {/* Background blobs */}
            <div className="vo-blob vo-blob-tr" />
            <div className="vo-blob vo-blob-bl" />
            <div className="vo-blob vo-blob-center" />

            <div className="vo-container">

                {/* ── Card ── */}
                <div className="vo-card auth-enter premium-shine">

                    {/* Top accent strip */}
                    <div className="vo-strip" />

                    {/* Icon + header */}
                    <div className="vo-header">

                        {/* Icon with timer ring */}
                        <div className="vo-icon-wrap">
                            <div className="vo-icon-box">
                               <Mail className="w-7 h-7" />
                            </div>
                            {/* Timer ring */}
                            <div className="vo-ring-wrap">
                                <svg className="vo-ring-svg" viewBox="0 0 52 52">
                                    <circle cx="26" cy="26" r="20" fill="none"
                                        stroke="rgba(255,216,107,0.12)" strokeWidth="3" />
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
                                            <stop offset="0%" stopColor="#fde68a" />
                                            <stop offset="50%" stopColor="#facc15" />
                                            <stop offset="100%" stopColor="#f59e0b" />
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
                            <label className="vo-input premium-input">Enter OTP Code</label>
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
                            className="premium-button premium-shine vo-btn-verify"
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
                                    <CheckCircle2 className="w-4 h-4" />
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
                                    className="premium-btn-secondary vo-resend-btn"
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
                                            <RefreshCw className="w-4 h-4" />
                                            Resend OTP
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Help note */}
                    <div className="vo-help-note">
                        <Info className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
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
