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
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-12 shadow-2xl shadow-primary/30">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-10 leading-[0.95]">
                            Create the <br /> <span className="text-primary italic">Impossible.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium">
                            Join Virezo AI to access state-of-the-art generation tools.
                            Turn your imagination into reality with a single click.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-card-bg border border-card-border shadow-xl backdrop-blur-sm group hover:scale-[1.05] transition-all duration-500">
                                <Video className="w-10 h-10 text-primary mb-4" />
                                <div className="text-xl font-black text-foreground tracking-tight uppercase">AI Video</div>
                                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Cinematic Flows</div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-card-bg border border-card-border shadow-xl backdrop-blur-sm group hover:scale-[1.05] transition-all duration-500">
                                <Sparkles className="w-10 h-10 text-secondary mb-4" />
                                <div className="text-xl font-black text-foreground tracking-tight uppercase">Advanced</div>
                                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Latest Tech</div>
                            </div>
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
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20">
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
                            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
                                Get Started
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium">
                                Create your account to start generating instantly.
                            </p>
                        </div>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
                                    <Mail className="w-12 h-12 text-primary" />
                                </div>
                                <h2 className="text-4xl font-black text-foreground tracking-tight">Verify Identity</h2>
                                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                                    We've sent a 6-digit code to <br /><span className="text-foreground font-black">{email}</span>.
                                </p>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="000 000"
                                        className="w-full text-center text-4xl tracking-[0.5em] font-black py-8 rounded-3xl bg-white dark:bg-card-bg border border-card-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all uppercase"
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
                                    {error && <p className="text-red-500 text-lg font-bold">{error}</p>}
                                    {isLoading && <p className="text-primary text-lg font-black animate-pulse uppercase tracking-widest">Verifying Identity...</p>}
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleVerifyAndSignup} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-base font-black text-foreground ml-2 uppercase tracking-widest opacity-60">Full Name</label>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-6 pr-14 py-6 rounded-2xl bg-white dark:bg-card-bg border border-card-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                                            required
                                        />
                                        <User className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none group-focus-within/input:text-primary transition-colors" />
                                    </div>
                                </div>
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
                                </div>

                                {error && (
                                    <div className="p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-600 text-lg font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-6 rounded-2xl bg-primary text-white font-black text-xl hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Sign Up</span>
                                            <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="mt-12 pt-12 border-t border-card-border text-center">
                            <p className="text-lg text-muted-foreground font-medium">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-black transition-colors">
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
