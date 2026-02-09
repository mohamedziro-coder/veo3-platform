"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={cn("text-xs font-bold uppercase tracking-wider", step === 'form' ? "text-blue-500" : "text-gray-600")}>Step 1</span>
                                <div className="h-px flex-1 bg-white/10" />
                                <span className={cn("text-xs font-bold uppercase tracking-wider", step === 'verify' ? "text-blue-500" : "text-gray-600")}>Step 2</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {step === 'form' ? 'Get Started' : 'Verify Email'}
                            </h2>
                            <p className="text-gray-500">
                                {step === 'form' ? 'Create your account in seconds.' : `We sent a code to ${email}`}
                            </p>
                        </div>

                        {step === 'form' ? (
                            <form onSubmit={handleSendCode} className="space-y-5">
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
                                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Continue</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full py-6 text-center text-4xl font-mono tracking-[0.5em] bg-transparent border-b-2 border-white/20 text-white placeholder-white/10 focus:outline-none focus:border-blue-500 transition-all"
                                        autoFocus
                                        required
                                    />
                                    <div className="text-center text-sm text-gray-500">
                                        Enter the 6-digit code we sent you.
                                    </div>
                                </div>

                                {step === 'verify' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mx-auto max-w-xs px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Resend Simulator</span>
                                                <span className="text-xs text-blue-200">Testing Code</span>
                                            </div>
                                            <div className="px-3 py-1 rounded bg-blue-500/20 text-white font-mono font-bold tracking-widest border border-blue-500/30">
                                                {serverCode}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

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
                                        <span>Verify Account</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('form')}
                                    className="w-full text-sm text-gray-500 hover:text-white transition-colors py-2"
                                >
                                    Change Email
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
