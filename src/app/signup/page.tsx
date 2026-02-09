"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Mock Local Auth implementation
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');

            if (users.find((u: any) => u.email === email)) {
                throw new Error("Email already exists");
            }

            const newUser = {
                name,
                email,
                password,
                password,
                role: email === 'admin@onlinetools.com' ? 'admin' : 'user',
                credits: 50 // Initial Free Credits
            };
            users.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(users));
            localStorage.setItem('current_user', JSON.stringify(newUser));

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "An error occurred during signup");
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
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Create Account</h1>
                        <p className="text-gray-400">Join the future of AI generation</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center"
                            >
                                Account created! Please check your email for verification.
                            </motion.div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

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
