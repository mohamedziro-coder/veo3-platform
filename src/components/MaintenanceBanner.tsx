"use client";

import { motion } from "framer-motion";
import { Wrench, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "212600000000"; // ← Update with real WhatsApp number

interface MaintenanceBannerProps {
    toolName: string;
}

/**
 * Full-page maintenance overlay shown when a tool is disabled by admin.
 */
export default function MaintenanceBanner({ toolName }: MaintenanceBannerProps) {
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Bonjour, je voudrais avoir plus d'informations sur la maintenance de l'outil ${toolName}.`
    )}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        >
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center shadow-lg">
                        <Wrench className="w-12 h-12 text-amber-500" />
                    </div>
                </div>

                {/* Badge */}
                <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-amber-200 mb-4">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Under Maintenance
                </span>

                {/* Title */}
                <h1 className="text-3xl font-black text-gray-900 mb-3">
                    {toolName} is temporarily unavailable
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                    We are currently performing maintenance on this tool to improve your experience.
                    We will be back shortly.
                    <br />
                    <span className="text-sm">For more information, contact us via WhatsApp.</span>
                </p>

                {/* WhatsApp CTA */}
                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg shadow-green-500/30 transition-all"
                >
                    <MessageCircle className="w-6 h-6" />
                    Contact Support on WhatsApp
                </a>

                <p className="text-xs text-gray-400 mt-4">
                    Response time: usually within a few hours.
                </p>
            </div>
        </motion.div>
    );
}
