import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Sign Up - Virezo 3",
    description: "Create your free Virezo account today. Get started with AI video generation, no credit card required.",
});

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
