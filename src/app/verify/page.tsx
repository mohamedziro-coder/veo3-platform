"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, RefreshCcw, ArrowRight, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const emailQuery = (searchParams.get("email") || "").trim().toLowerCase();
        if (emailQuery) setEmail(emailQuery);
    }, [searchParams]);

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        const emailNorm = email.trim().toLowerCase();
        const codeNorm = code.trim();

        if (!emailNorm || !codeNorm) {
            setError("Email and verification code are required.");
            return;
        }

        setIsVerifying(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailNorm, code: codeNorm }),
            });

            const data = await response.json();
            if (!response.ok || !data?.success) {
                throw new Error(data?.error || "Verification failed");
            }

            localStorage.setItem("current_user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("storage"));
            setSuccess("Email verified successfully. Redirecting...");
            router.push("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Verification failed";
            setError(message);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        const emailNorm = email.trim().toLowerCase();
        if (!emailNorm) {
            setError("Enter your email first to resend a code.");
            return;
        }

        setIsResending(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailNorm, purpose: "verify" }),
            });
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.error || "Failed to send verification code");
            }

            setSuccess("A new verification code was sent to your email.");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to send verification code";
            setError(message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#FAFAFB] dark:bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-xl rounded-[2rem] border border-card-border bg-white/90 dark:bg-card-bg/90 p-8 md:p-10 shadow-2xl backdrop-blur-xl"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20">
                        <Sparkles className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Verify Your Email</h1>
                    <p className="mt-3 text-muted-foreground font-medium">
                        Please verify your email before logging in.
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider text-foreground/60">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-card-border bg-white dark:bg-card-bg px-4 py-3 pr-12 text-foreground font-semibold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                required
                            />
                            <Mail className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider text-foreground/60">Verification Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="6-digit code"
                                className="w-full rounded-xl border border-card-border bg-white dark:bg-card-bg px-4 py-3 pr-12 text-foreground font-semibold tracking-[0.2em] uppercase focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                maxLength={6}
                                required
                            />
                            <ShieldCheck className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-center text-sm font-bold text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-700">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-black text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                        {!isVerifying && <ArrowRight className="h-5 w-5" />}
                    </button>
                </form>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-white dark:bg-card-bg px-4 py-3 text-sm font-black text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        {isResending ? "Sending new code..." : "Resend Verification Code"}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm font-semibold text-muted-foreground">
                    Back to{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80">
                        Login
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
