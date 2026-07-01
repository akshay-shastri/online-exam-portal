import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import PremiumLoader from "../components/PremiumLoader";
import { GraduationCap,   Mail,  Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Camera, BarChart3 } from "lucide-react";

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

        const response = await API.post("/auth/login", {
            email: email.trim().toLowerCase(),
            password
        });

        if (response.data.message === "Login Successful") {

            toast.success("Login successful! Welcome back.");

            localStorage.setItem("role", response.data.role);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", email);

            if (response.data.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else if (response.data.role === "STUDENT") {
                navigate("/student-dashboard");
            }

        } else if (
            response.data.message ===
            "Please verify your email first"
        ) {

            toast.error(
                "Please verify your email before logging in. Check your inbox.",
                { duration: 5000 }
            );

        } else {

            toast.error(
                response.data.message || "Login failed."
            );
        }

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            error.message ||
            "Login failed."
        );

    } finally {

        setLoading(false);
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#0b0b0f]">
                 {loading && (

        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm">

            <PremiumLoader
                title="Signing You In..."
                subtitle="Verifying credentials and preparing your workspace."
                height="100vh"
            />

        </div>

    )}
            {/* Background gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-900/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-900/20 blur-[120px]" />
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
            <div className={`relative z-10 w-full max-w-[440px] auth-enter transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="relative mb-5 group">
                        <div className="absolute inset-0 rounded-2xl bg-yellow-400/30 blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fde68a] via-[#facc15] to-[#f59e0b] flex items-center justify-center shadow-[0_0_45px_rgba(250,204,21,0.30)]">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Smart Exam Portal
                    </h1>
                    <p className="text-sm text-slate-400 mt-1.5 font-medium">Advanced Online Assessment System</p>
                </div>

                {/* Glass card */}
                <div className="premium-create-exam-card premium-shine rounded-[32px] border border-white/[0.06] shadow-[0_0_60px_rgba(250,204,21,0.10)] px-8 py-8">

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
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="premium-input w-full pl-11 pr-4 py-3.5 text-sm disabled:opacity-50"
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
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="premium-input w-full pl-11 pr-4 py-3.5 text-sm disabled:opacity-50"
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
                                       <EyeOff className="w-4 h-4" />
                                    ) : (
                                       <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="premium-button premium-shine w-full relative overflow-hidden py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                
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
                                    <ArrowRight className="w-4 h-4 relative z-10" />
                                </>
                            )}
                        </button>

                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-xs text-slate-500 font-medium">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#ffe27a] font-semibold hover:text-[#facc15] transition-colors">
                            Get Started
                        </Link>
                    </p>

                </div>

                {/* Bottom badges */}
                <div className="flex items-center justify-center gap-5 mt-6">
                    {[
                    {
                        icon: <ShieldCheck className="w-3.5 h-3.5 text-[#ffe27a]/80" />,
                        label: "Secure Exams"
                    },
                    {
                        icon: <Camera className="w-3.5 h-3.5 text-[#ffe27a]/80" />,
                        label: "AI Monitoring"
                    },
                    {
                        icon: <BarChart3 className="w-3.5 h-3.5 text-[#ffe27a]/80" />,
                        label: "Instant Results"
                    }
                    ].map((badge) => (
                        <div key={badge.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                            {badge.icon}
                            {badge.label}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Login;
