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

            const response = await API.post("/auth/register", {
                name,
                email,
                password,
                role: "STUDENT"
            });

            toast.success("Account created successfully! Please sign in.");

            console.log(response.data);

            setTimeout(() => navigate("/login"), 1500);

        } catch (error) {

            toast.error("Registration failed. Please try again.");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-12 relative overflow-hidden dark:bg-gray-950">

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full opacity-40 translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full opacity-40 -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                        Smart Exam Portal
                    </h1>
                    <p className="text-sm text-gray-400 mt-1.5 font-medium dark:text-gray-300">Create your student account</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white px-8 py-8 dark:bg-gray-800 dark:border-gray-700">

                    <div className="space-y-5">

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-indigo-300 disabled:opacity-60 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-indigo-300 disabled:opacity-60 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-indigo-300 disabled:opacity-60 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                    </div>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-blue-600 transition-colors">
                            Sign in
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;
