import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-[400px]">

                {/* Card */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-900/10 dark:shadow-black/40 border border-white/60 dark:border-gray-700/60 px-8 py-10">

                    {/* Icon + header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="relative mb-5">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {/* Animated ring */}
                            <div className="absolute -inset-2">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
                                    <circle cx="26" cy="26" r="20" fill="none" stroke="#e0e7ff" strokeWidth="3" />
                                    <circle
                                        cx="26" cy="26" r="20"
                                        fill="none"
                                        stroke="#6366f1"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-blue-700 dark:from-white dark:via-indigo-200 dark:to-blue-300 bg-clip-text text-transparent tracking-tight">
                            Verify Your Email
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                            We sent a 6-digit code to
                        </p>
                        <div className="mt-1.5 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800">
                            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{email || "your email"}</p>
                        </div>
                    </div>

                    <div className="space-y-5">

                        {/* OTP input */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
                                Enter OTP Code
                            </label>
                            <input
                                type="text"
                                placeholder="• • • • • •"
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                                className="w-full bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-center tracking-[0.5em] text-2xl font-bold rounded-2xl px-4 py-4 focus:outline-none focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-400 placeholder-gray-300 dark:placeholder-gray-600 transition-all duration-200 hover:border-indigo-300"
                            />
                        </div>

                        {/* Verify button */}
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length < 6}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] text-white py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify Email
                                </>
                            )}
                        </button>

                        {/* Resend */}
                        <div className="text-center pt-1">
                            {timer > 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Resend code in{" "}
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                        {timer}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 mx-auto disabled:opacity-50"
                                >
                                    {resending ? (
                                        <>
                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Resending...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Resend OTP
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Help text */}
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/40">
                        <p className="text-xs text-amber-700 dark:text-amber-400 text-center leading-relaxed">
                            <span className="font-semibold">Didn't receive it?</span> Check your spam folder or wait a moment before resending.
                        </p>
                    </div>

                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    Wrong email?{" "}
                    <button onClick={() => navigate("/register")} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-blue-600 transition-colors">
                        Go back
                    </button>
                </p>

            </div>
        </div>
    );
}

export default VerifyOtp;
