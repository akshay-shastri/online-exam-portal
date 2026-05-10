import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        if (token && role === "ADMIN") navigate("/admin-dashboard");
        else if (token && role === "STUDENT") navigate("/student-dashboard");
    }, [navigate]);

    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await API.post("/auth/login", { email, password });
            if (response.data.message === "Login Successful") {
                toast.success("Login successful! Welcome back.");
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("email", email);
                if (response.data.role === "ADMIN") navigate("/admin-dashboard");
                else if (response.data.role === "STUDENT") navigate("/student-dashboard");
            } else if (response.data.message === "Please verify your email first") {
                toast.error("Please verify your email before logging in. Check your inbox.", { duration: 5000 });
            } else {
                toast.error(response.data.message || "Login failed.");
            }
        } catch (error) {

    console.log("LOGIN ERROR:", error);

    toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login failed."
    );
}
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#0b0b0f]">

            {/* Background gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-900/20 blur-[120px]" />
                <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-rose-900/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Card */}
            <div className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="relative mb-5 group">
                        <div className="absolute inset-0 rounded-2xl bg-violet-500/25 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.30)]">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Smart Exam Portal
                    </h1>
                    <p className="text-sm text-slate-400 mt-1.5 font-medium">Advanced Online Assessment System</p>
                </div>

                {/* Glass card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-violet-400/10 shadow-[0_0_40px_rgba(217,70,239,0.12)] px-8 py-8">

                    {/* Heading */}
                    <div className="text-center mb-7">
                        <h2 className="text-xl font-bold text-white">Welcome Back</h2>
                        <p className="text-sm text-slate-400 mt-1">Access your examination dashboard securely</p>
                    </div>

                    <div className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500/30 placeholder-slate-600 transition-all duration-200 hover:border-violet-400/20 hover:bg-white/[0.07] disabled:opacity-50"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white text-sm rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500/30 placeholder-slate-600 transition-all duration-200 hover:border-violet-400/20 hover:bg-white/[0.07] disabled:opacity-50"
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
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
                            onClick={handleLogin}
                            disabled={loading}
                            className="premium-btn-primary w-full relative overflow-hidden py-3.5 text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span className="relative z-10">Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Sign In</span>
                                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-slate-500 font-medium">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-violet-300 font-semibold hover:text-fuchsia-300 transition-colors">
                            Get Started
                        </Link>
                    </p>

                </div>

                {/* Bottom badges */}
                <div className="flex items-center justify-center gap-5 mt-6">
                    {[
                        { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Secure Exams" },
                        { icon: "M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", label: "AI Monitoring" },
                        { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Instant Results" },
                    ].map((badge) => (
                        <div key={badge.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-rose-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                            </svg>
                            {badge.label}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Login;
