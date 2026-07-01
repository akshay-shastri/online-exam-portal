import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import PremiumLoader from "../components/PremiumLoader";
import { GraduationCap, User,    Mail,  Lock,Eye, EyeOff,  ArrowRight,ShieldCheck,Camera,BarChart3 } from "lucide-react";


function Register() {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleRegister = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await API.post("/auth/register", { name, email, password, role: "STUDENT" });
            toast.success("OTP sent to your email!");
            setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#0b0b0f]">
                {loading && (

    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm">

        <PremiumLoader
            title="Creating Your Account..."
            subtitle="Securing your profile and preparing verification."
            height="100vh"
        />

    </div>

)}
            {/* Background gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-900/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-900/20 blur-[120px]" />
                <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] rounded-full bg-rose-900/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
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
                    <p className="text-sm text-slate-400 mt-1.5 font-medium">Secure · AI-Powered · Instant Results</p>
                </div>

                {/* Glass card */}
                <div className="premium-create-exam-card premium-shine rounded-[32px] border border-white/[0.06] shadow-[0_0_60px_rgba(250,204,21,0.10)] px-8 py-8">

                    {/* Heading */}
                    <div className="text-center mb-7">
                        <h2 className="text-xl font-bold text-white">Create Your Account</h2>
                        <p className="text-sm text-slate-400 mt-1">Start your examination journey today</p>
                    </div>

                    <div className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="premium-input w-full pl-11 pr-4 py-3.5 text-sm disabled:opacity-50"
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    className="premium-input w-full pl-11 pr-12 py-3.5 text-sm disabled:opacity-50"
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
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
                            onClick={handleRegister}
                            disabled={loading}
                           className="premium-button premium-shine w-full relative overflow-hidden py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span className="relative z-10">Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Create Account</span>
                                    <ArrowRight className="w-4 h-4 relative z-10" />
                                </>
                            )}
                        </button>

                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-slate-500 font-medium">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#ffe27a] font-semibold hover:text-[#facc15]transition-colors">
                            Sign in
                        </Link>
                    </p>

                </div>

                {/* Bottom badges */}
                <div className="flex items-center justify-center gap-5 mt-6">
                    {
                    [{
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

export default Register;
