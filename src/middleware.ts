import { NextResponse } from "next/server";

import { auth } from "@/auth";

const protectedPrefixes = ["/app"];

export default auth((req) => {
  const isProtected = protectedPrefixes.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*"],
};
