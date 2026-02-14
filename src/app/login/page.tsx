"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Call login API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (!data.success || !data.user) {
                throw new Error('Invalid response from server');
            }

            // Store user in localStorage (for now, session management)
            localStorage.setItem('current_user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
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
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                            Welcome <span className="text-primary">Back.</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Continue your journey with Virezo. Your next masterpiece is waiting to be created.
                        </p>

                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-gray-900 font-bold">Pro Tip</div>
                                    <div className="text-xs text-gray-500">Maximize your credits</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                "Use specific prompts for better results. Instead of 'a cat', try 'a cinematic shot of a futuristic cyber-cat in neon rain'."
                            </p>
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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-500">Access your account and projects.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
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
                                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                            <div className="h-px bg-gray-200 flex-1" />
                            <span>Or continue with</span>
                            <div className="h-px bg-gray-200 flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium group">
                                <Chrome className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium group">
                                <Github className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                <span>Github</span>
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-500">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
