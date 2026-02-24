import { permanentRedirect } from "next/navigation";

export default function AboutRedirectPage() {
    permanentRedirect("/company/about");
}
