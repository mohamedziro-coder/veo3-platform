import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface FeatureGridProps {
    features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2rem] bg-card-bg border border-card-border hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
