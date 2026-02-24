import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "AI Actor Studio - Virezo 3",
    description: "Create and manage consistent AI characters for your brand. Upload custom faces or choose from our diverse library.",
    canonical: "/actor",
});

export default function ActorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
