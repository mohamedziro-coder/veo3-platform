"use client";

import { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion";

interface CounterProps {
    value: string;
}

export default function Counter({ value }: { value: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    // Extract number and suffix (handles formats like "2M+", "50k+", "3.5x", "120+")
    const numericMatch = value.match(/(\d+\.?\d*)/);
    const numericPart = numericMatch ? parseFloat(numericMatch[0]) : 0;
    const suffixPart = value.replace(/(\d+\.?\d*)/, "");

    const count = useMotionValue(0);

    // Handle formatting based on the original number's precision
    const displayValue = useTransform(count, (latest: number) => {
        const isDecimal = value.includes(".");
        if (isDecimal) {
            return latest.toFixed(1);
        }
        return Math.floor(latest).toLocaleString();
    });

    useEffect(() => {
        if (isInView) {
            // Premium ease-out curve: fast start, slow landing
            const controls = animate(count, numericPart, {
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1],
            });
            return controls.stop;
        }
    }, [isInView, count, numericPart]);

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{displayValue}</motion.span>
            {suffixPart}
        </span>
    );
}
