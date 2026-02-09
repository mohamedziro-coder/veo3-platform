"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleVerifyAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // 1. Call registration API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (data.message === "verification_required") {
                setSuccess(true);
            } else if (data.success && data.user) {
                // Fallback for immediate login if verification disabled
                localStorage.setItem('current_user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => router.push('/dashboard'), 1000);
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex bg-black overflow-hidden font-sans selection:bg-blue-500/30">
            {/* LEFT SIDE - VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
                    <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.15),transparent_60%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Create the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Impossible.</span>
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                            Join Veo Platform to access state-of-the-art AI generation tools.
                            Turn your imagination into reality with a single click.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Video className="w-6 h-6 text-blue-400 mb-2" />
                                <div className="text-sm font-semibold text-white">AI Video</div>
                                <div className="text-xs text-gray-500"> Cinematic Generation</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Sparkles className="w-6 h-6 text-purple-400 mb-2" />
                                <div className="text-sm font-semibold text-white">Advanced Models</div>
                                <div className="text-xs text-gray-500"> Latest Tech Stack</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-12">
                {/* Mobile Background */}
                <div className="absolute inset-0 lg:hidden pointer-events-none z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[80px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="w-full max-w-md relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 lg:hidden text-center"
                    >
                        <div className="inline-flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl">Veo Platform</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Get Started
                            </h2>
                            <p className="text-gray-500">
                                Create your account to start generating.
                            </p>
                        </div>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                    <Mail className="w-10 h-10 text-green-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Check Your Email</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We've sent a verification link to <span className="text-white font-medium">{email}</span>. Please click the link to activate your account.
                                </p>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-500">
                                    Can't find it? Check your spam folder.
                                </div>
                                <Link
                                    href="/login"
                                    className="block w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all text-center"
                                >
                                    Go to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleVerifyAndSignup} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Sign Up</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-gray-500">
                                Already have an account?{" "}
                                <Link href="/login" className="text-white hover:text-blue-400 font-medium transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
