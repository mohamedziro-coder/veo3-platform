import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Blog & Updates - Virezo 3",
    description: "Read the latest news, tutorials, and success stories from the Virezo community. Stay updated on AI video trends.",
    canonical: "/blogs",
});

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
