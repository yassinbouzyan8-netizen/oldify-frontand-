import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

const PUBLIC_PATHS = new Set([
  "/login",
  "/register",
  "/mot-de-passe-oublie",
  "/post-login",
]);

function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/imges/")) return true;
  return /\.(ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/i.test(pathname);
}

function hasSession(request: NextRequest): boolean {
  const t = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return Boolean(t && t.length > 0);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const sessionOk = hasSession(request);

  if (PUBLIC_PATHS.has(pathname)) {
    if (sessionOk && pathname === "/login") {
      return NextResponse.redirect(new URL("/post-login", request.url));
    }
    return NextResponse.next();
  }

  if (!sessionOk) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)",
  ],
};
