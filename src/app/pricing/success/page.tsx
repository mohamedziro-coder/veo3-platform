"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PricingSuccessPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Confirming your payment...");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
            setStatus("error");
            setMessage("Missing Stripe session id.");
            return;
        }

        (async () => {
            try {
                const res = await fetch("/api/payments/stripe/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Payment confirmation failed");
                }

                // Refresh local credits if user is logged in
                const userRaw = localStorage.getItem("current_user");
                if (userRaw && typeof data.credits === "number") {
                    const user = JSON.parse(userRaw);
                    user.credits = data.credits;
                    localStorage.setItem("current_user", JSON.stringify(user));
                    window.dispatchEvent(new Event("storage"));
                    window.dispatchEvent(new Event("credits-updated"));
                }

                setStatus("success");
                setMessage(data.alreadyProcessed ? "Payment was already confirmed. Credits are in your account." : "Payment successful. Credits were added to your account.");
            } catch (e: any) {
                setStatus("error");
                setMessage(e.message || "Failed to confirm payment");
            }
        })();
    }, [searchParams]);

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-xl w-full rounded-3xl border border-card-border bg-card-bg p-10 text-center shadow-xl">
                <h1 className="text-3xl font-black mb-4 text-foreground">
                    {status === "loading" ? "Processing..." : status === "success" ? "Payment Confirmed" : "Payment Error"}
                </h1>
                <p className="text-muted-foreground mb-8">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-white font-bold">
                        Go to Dashboard
                    </Link>
                    <Link href="/pricing" className="px-6 py-3 rounded-xl border border-card-border text-foreground font-bold">
                        Back to Pricing
                    </Link>
                </div>
            </div>
        </main>
    );
}

