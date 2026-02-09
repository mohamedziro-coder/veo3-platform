"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#a855f7"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}
