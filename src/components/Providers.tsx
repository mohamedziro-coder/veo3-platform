"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ThemeToggle from './ThemeToggle';

import AdminProvider from './cms/AdminProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <ThemeToggle />
            {children}
            <ProgressBar
                height="3px"
                color="#4A90E2"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </AdminProvider>
    );
}
