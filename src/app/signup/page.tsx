"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState(""); // Input code
    const [serverCode, setServerCode] = useState(""); // Code from server (Simulation)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();


    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // 1. Basic Validation
            if (!name || !email || !password) {
                throw new Error("Please fill in all fields");
            }

            // 2. Send Code via API
            const response = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to send verification code");
            }

            // 3. Store code (Simulation: we get it back. In prod, we wouldn't)
            setServerCode(data.debugCode);
            setStep('verify');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // 1. Check Code
            if (code !== serverCode) {
                throw new Error("Invalid verification code");
            }

            // 2. Create Account (Mock Logic)
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const userExists = users.some((u: any) => u.email === email);

            if (userExists) {
                throw new Error("User already exists with this email");
            }

            const newUser = {
                name,
                email,
                password,
                role: email === 'admin@onlinetools.com' ? 'admin' : 'user',
                credits: 50 // Initial Free Credits
            };
            users.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(users));
            localStorage.setItem('current_user', JSON.stringify(newUser));

            window.dispatchEvent(new Event('storage')); // Update Navbar

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 1000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
                            {step === 'form' ? 'Create Account' : 'Verify Email'}
                        </h1>
                        <p className="text-gray-400">
                            {step === 'form' ? 'Join Veo3 Platform today' : `Enter the code sent to ${email}`}
                        </p>
                        {step === 'verify' && (
                            <div className="mt-2 text-xs text-yellow-500 bg-yellow-900/20 p-2 rounded">
                                Simulation Mode: Code is <b>{serverCode}</b>
                            </div>
                        )}
                    </div>

                    {step === 'form' ? (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative group/input">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-white transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-white transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-white transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Verification Code</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-3xl tracking-[1em] text-white placeholder-gray-700 focus:outline-none focus:border-white/30 transition-all font-mono"
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span>Verify & Create Account</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('form')}
                                className="w-full text-gray-500 hover:text-white text-sm transition-colors"
                            >
                                Back to Signup
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:text-blue-400 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
