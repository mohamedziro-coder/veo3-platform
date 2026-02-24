"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ThemeToggle from './ThemeToggle';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeToggle />
            {children}
            <ProgressBar
                height="3px"
                color="#4A90E2"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}
