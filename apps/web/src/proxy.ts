import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const locale =
    path === "/en" || path.startsWith("/en/")
      ? "en"
      : path === "/app" || path.startsWith("/app/")
        ? request.cookies.get("vn-locale")?.value === "en"
          ? "en"
          : "nb-NO"
        : "nb-NO";
  const headers = new Headers(request.headers);
  headers.set("x-vn-locale", locale);
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
