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
            // Mock Local Login logic
            let users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            let user = users.find((u: any) => u.email === email && u.password === password);

            if (!user && email === 'admin@onlinetools.com') {
                // Auto-register admin for demo purposes if not found
                user = { name: "Admin User", email: 'admin@onlinetools.com', password: password, role: 'admin', credits: 100 };
                users.push(user);
                localStorage.setItem('mock_users', JSON.stringify(users));
            }

            if (!user) {
                throw new Error("Invalid email or password");
            }

            localStorage.setItem('current_user', JSON.stringify(user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex bg-black overflow-hidden font-sans selection:bg-purple-500/30">
            {/* LEFT SIDE - VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
                    <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.15),transparent_60%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-8 shadow-2xl shadow-purple-900/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Back.</span>
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                            Continue your journey with Veo Platform. Your next masterpiece is waiting to be created.
                        </p>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Pro Tip</div>
                                    <div className="text-xs text-gray-500">Maximize your credits</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">
                                "Use specific prompts for better results. Instead of 'a cat', try 'a cinematic shot of a futuristic cyber-cat in neon rain'."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-12">
                {/* Mobile Background */}
                <div className="absolute inset-0 lg:hidden pointer-events-none z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[80px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="w-full max-w-md relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 lg:hidden text-center"
                    >
                        <div className="inline-flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
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
                            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                            <p className="text-gray-500">Access your account and projects.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-4 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-medium"
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
                                        className="w-full pl-4 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-medium"
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
                                className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                            <div className="h-px bg-white/10 flex-1" />
                            <span>Or continue with</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium group">
                                <Chrome className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium group">
                                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span>Github</span>
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-gray-500">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-white hover:text-purple-400 font-medium transition-colors">
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
