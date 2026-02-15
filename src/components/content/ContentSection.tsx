import React from 'react';
import { cn } from "@/lib/utils";

interface ContentSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function ContentSection({ title, subtitle, children, className, id }: ContentSectionProps) {
    return (
        <section id={id} className={cn("py-20 px-6 md:px-12 relative overflow-hidden", className)}>
            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
}
