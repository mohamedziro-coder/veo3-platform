import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Login - Virezo 3",
    description: "Sign in to your Virezo account to start generating AI videos, voices, and avatars.",
});

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
