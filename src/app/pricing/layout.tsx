import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Pricing - Virezo 3",
    description: "Flexible pricing for everyone. Pay as you go credits for AI video generation. No monthly subscriptions required.",
    canonical: "/pricing",
});

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
