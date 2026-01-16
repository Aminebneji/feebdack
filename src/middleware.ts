import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Gestion du CORS pour les routes API
    if (pathname.startsWith("/api")) {
        const response = pathname.startsWith("/api/feedbacks") && req.method === "OPTIONS"
            ? new NextResponse(null, { status: 204 })
            : NextResponse.next();

        // Headers CORS de base
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        if (req.method === "OPTIONS") {
            return response;
        }

        // Si c'est une route protégée, on vérifie le token
        const protectedRoutes = ["/api/sites", "/api/user"];
        const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

        if (isProtected) {
            const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        return response;
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 2. Protège les routes du dashboard
    if (pathname.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 3. Redirige les utilisateurs authentifiés vers le dashboard
    if ((pathname === "/login" || pathname === "/register") && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/register", "/api/:path*"],
};
