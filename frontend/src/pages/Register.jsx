import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await API.post("/auth/register", { name, email, password, role: "STUDENT" });
            toast.success("OTP sent to your email!");
            setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
        } catch (error) {
            toast.error(
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Registration failed"
);
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm rounded-2xl py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50 backdrop-blur-sm";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1.5s" }} />

            <div className="relative z-10 w-full max-w-[420px]">

                {/* Brand header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-5">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-blue-700 dark:from-white dark:via-indigo-200 dark:to-blue-300 bg-clip-text text-transparent tracking-tight">
                        Smart Exam Portal
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        Join thousands of students today
                    </p>
                </div>

                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[{ n: 1, label: "Register" }, { n: 2, label: "Verify" }, { n: 3, label: "Start" }].map((step, i) => (
                        <div key={step.n} className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${i === 0 ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-indigo-600 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-500"}`}>{step.n}</span>
                                {step.label}
                            </div>
                            {i < 2 && <div className="w-4 h-px bg-gray-200 dark:bg-gray-700" />}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-900/10 dark:shadow-black/40 border border-white/60 dark:border-gray-700/60 px-8 py-8">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create your account</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Free student account — takes 30 seconds</p>
                    </div>

                    <div className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input type="text" placeholder="Your full name" className={`${inputBase} pl-11 pr-4`} onChange={(e) => setName(e.target.value)} disabled={loading} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input type="email" placeholder="you@example.com" className={`${inputBase} pl-11 pr-4`} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" className={`${inputBase} pl-11 pr-12`} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors">
                                    {showPassword ? (
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
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] text-white py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                    </div>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                        <span className="text-xs text-gray-400 font-medium px-1">or</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Sign in
                        </Link>
                    </p>

                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5">
                    By creating an account, you agree to our{" "}
                    <span className="text-gray-500 dark:text-gray-500 font-medium">Terms of Service</span>
                </p>

            </div>
        </div>
    );
}

export default Register;
