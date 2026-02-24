import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "AI Video Generator - Virezo 3",
    description: "Turn text and images into viral videos. Use our advanced AI to generate realistic product ads and social media content.",
    canonical: "/video",
});

export default function VideoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
