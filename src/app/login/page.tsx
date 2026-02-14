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
        <main className="min-h-screen flex bg-[#FAFAFB] dark:bg-background overflow-hidden font-sans selection:bg-primary/20">
            {/* LEFT SIDE - VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative bg-white dark:bg-card-bg items-center justify-center p-24 overflow-hidden border-r border-card-border">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(74,144,226,0.08),transparent_70%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-12 shadow-2xl shadow-primary/30">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-10 leading-[0.95]">
                            Welcome <br /> <span className="text-primary italic">Back.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
                            Continue your journey with Virezo AI. Your next viral masterpiece is waiting to be created.
                        </p>

                        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-card-bg border border-card-border shadow-xl backdrop-blur-sm">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-foreground text-xl font-black tracking-tight uppercase">Pro Tip</div>
                                    <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Maximize your credits</div>
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                "Use specific prompts for better results. Instead of 'a cat', try 'a cinematic shot of a futuristic cyber-cat in neon rain'."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 lg:p-24 overflow-y-auto">
                {/* Mobile Background */}
                <div className="absolute inset-0 lg:hidden pointer-events-none z-0 overflow-hidden bg-white dark:bg-background">
                    <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[100px] rounded-full animate-pulse" />
                </div>

                <div className="w-full max-w-xl relative z-10 bg-white/80 dark:bg-card-bg/80 backdrop-blur-2xl border border-card-border p-10 md:p-14 rounded-[3.5rem] lg:bg-transparent lg:border-none lg:p-0 shadow-2xl lg:shadow-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-12 lg:hidden text-center"
                    >
                        <div className="inline-flex items-center gap-4 font-black text-3xl tracking-tighter text-foreground">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span>Virezo</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">Sign In</h2>
                            <p className="text-xl text-muted-foreground font-medium">Access your account and projects instantly.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-base font-black text-foreground ml-2 uppercase tracking-widest opacity-60">Email Address</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-6 pr-14 py-6 rounded-2xl bg-white dark:bg-card-bg border border-card-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                                        required
                                    />
                                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none group-focus-within/input:text-primary transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-base font-black text-foreground ml-2 uppercase tracking-widest opacity-60">Password</label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-6 pr-14 py-6 rounded-2xl bg-white dark:bg-card-bg border border-card-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                                        required
                                    />
                                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none group-focus-within/input:text-primary transition-colors" />
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-black text-primary hover:text-primary/80 transition-all uppercase tracking-widest"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <div className="p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-600 text-lg font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 rounded-2xl bg-primary text-white font-black text-xl hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-12 flex items-center gap-6 text-sm text-muted-foreground font-black uppercase tracking-[0.2em]">
                            <div className="h-px bg-card-border flex-1" />
                            <span>Or continue with</span>
                            <div className="h-px bg-card-border flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <button className="flex items-center justify-center gap-4 py-5 rounded-2xl bg-white dark:bg-card-bg border border-card-border hover:bg-gray-50 dark:hover:bg-muted/50 transition-all text-foreground font-black text-lg group shadow-sm hover:shadow-xl">
                                <Chrome className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-4 py-5 rounded-2xl bg-white dark:bg-card-bg border border-card-border hover:bg-gray-50 dark:hover:bg-muted/50 transition-all text-foreground font-black text-lg group shadow-sm hover:shadow-xl">
                                <Github className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span>Github</span>
                            </button>
                        </div>

                        <div className="mt-12 pt-12 border-t border-card-border text-center">
                            <p className="text-lg text-muted-foreground font-medium">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary hover:text-primary/80 font-black transition-colors">
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
