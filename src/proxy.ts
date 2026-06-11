import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/auth/jwt";

const AUTH_PATHS = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const path = request.nextUrl.pathname;
  const isAuthPath = AUTH_PATHS.some((p) => path.startsWith(p));

  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (!session && !isAuthPath) {
    return redirectTo("/login");
  }

  if (session && isAuthPath) {
    return redirectTo("/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
