import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/env";

const PUBLIC_PATHS = new Set([
  "/login",
  "/register",
  "/mot-de-passe-oublie",
]);

function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/imges/")) return true;
  return /\.(ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/i.test(pathname);
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => {
    to.cookies.set(c.name, c.value);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  let supabaseUrl: string;
  let supabaseKey: string;
  try {
    supabaseUrl = getSupabaseUrl();
    supabaseKey = getSupabasePublicKey();
  } catch {
    console.error(
      "[middleware] Variables Supabase manquantes — vérifie .env (URL + clé publique).",
    );
    if (PUBLIC_PATHS.has(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headersToSet).forEach(([k, v]) =>
          supabaseResponse.headers.set(k, v),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (PUBLIC_PATHS.has(pathname)) {
    if (user && pathname === "/login") {
      const redirect = NextResponse.redirect(new URL("/", request.url));
      copyCookies(supabaseResponse, redirect);
      return redirect;
    }
    return supabaseResponse;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)",
  ],
};
