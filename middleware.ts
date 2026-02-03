import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Vérifie si c'est une route protégée (profile)
  const isProtectedProfileRoute = /^\/profile/.test(request.nextUrl.pathname);
  
  // Vérifie si c'est une route d'authentification
  const isAuthRoute = /^\/(connexion|inscription|mot-de-passe-oublie|reset-password)/.test(request.nextUrl.pathname);

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
  if (isProtectedProfileRoute && !token) {
    const loginUrl = new URL(`/connexion`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est connecté et tente d'accéder à une page d'authentification
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher mis à jour pour inclure toutes les routes protégées et d'authentification
  matcher: [
    // Routes protégées
    "/profile/:path*",
    // Routes d'authentification
    "/connexion",
    "/inscription", 
    "/mot-de-passe-oublie",
    "/reset-password",
  ],
};
