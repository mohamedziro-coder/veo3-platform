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
        <main className="min-h-screen flex bg-white overflow-hidden font-sans selection:bg-primary/20">
            {/* LEFT SIDE - VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-50 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(74,144,226,0.05),transparent_70%)]" />
                    <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_100%_100%,rgba(80,227,194,0.1),transparent_60%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                            Create the <span className="text-primary">Impossible.</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Join Virezo to access state-of-the-art AI generation tools.
                            Turn your imagination into reality with a single click.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm backdrop-blur-sm">
                                <Video className="w-6 h-6 text-primary mb-2" />
                                <div className="text-sm font-semibold text-gray-900">AI Video</div>
                                <div className="text-xs text-gray-500"> Cinematic Generation</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm backdrop-blur-sm">
                                <Sparkles className="w-6 h-6 text-secondary mb-2" />
                                <div className="text-sm font-semibold text-gray-900">Advanced Models</div>
                                <div className="text-xs text-gray-500"> Latest Tech Stack</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-12">
                {/* Mobile Background */}
                <div className="absolute inset-0 lg:hidden pointer-events-none z-0 overflow-hidden bg-white">
                    <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[80px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-secondary/5 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-xl border border-gray-100 p-6 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0 shadow-xl lg:shadow-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 lg:hidden text-center"
                    >
                        <div className="inline-flex items-center gap-2 font-bold text-xl tracking-tighter text-gray-900">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl">Virezo</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
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
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                    <Mail className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Enter Verification Code</h2>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    We've sent a 6-digit code to <span className="text-gray-900 font-medium">{email}</span>.
                                </p>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        className="w-full text-center text-3xl tracking-[1em] font-bold py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-all uppercase"
                                        maxLength={6}
                                        onChange={async (e) => {
                                            const code = e.target.value;
                                            if (code.length === 6) {
                                                setIsLoading(true);
                                                try {
                                                    const res = await fetch('/api/auth/verify', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ email, code })
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        localStorage.setItem('current_user', JSON.stringify(data.user));
                                                        window.dispatchEvent(new Event('storage'));
                                                        router.push('/dashboard');
                                                    } else {
                                                        setError(data.error || "Invalid code");
                                                        setIsLoading(false);
                                                    }
                                                } catch (err) {
                                                    setError("Verification failed");
                                                    setIsLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    {isLoading && <p className="text-gray-400 text-sm animate-pulse">Verifying...</p>}
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleVerifyAndSignup} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                            required
                                        />
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                            required
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-4 pr-4 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                            required
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
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

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-500">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
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
