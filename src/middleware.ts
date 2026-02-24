import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require a valid session
const PROTECTED_API_ROUTES = [
    "/api/generate",
    "/api/generate-image",
    "/api/generate-audio",
];

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session (required for Supabase SSR)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Block unauthenticated access to protected API routes
    const isProtected = PROTECTED_API_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtected && !user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except static files and Next.js internals.
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
