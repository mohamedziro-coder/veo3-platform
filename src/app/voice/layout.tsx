import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "AI Voice Generator - Virezo 3",
    description: "Generate lifelike voiceovers in multiple languages and accents. Perfect for videos, podcasts, and social media.",
    canonical: "/voice",
});

export default function VoiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
