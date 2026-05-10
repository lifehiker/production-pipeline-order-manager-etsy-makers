import { NextResponse } from "next/server";

import { getDb } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const source = String(formData.get("source") || "unknown");

  if (!email) {
    return NextResponse.redirect(new URL("/tools/q4-planner", request.url));
  }

  const db = getDb();
  await db.leadEmail.upsert({
    where: { email },
    update: {
      source,
      metadata: { source, capturedAt: new Date().toISOString() },
    },
    create: {
      email,
      source,
      metadata: { source, capturedAt: new Date().toISOString() },
    },
  });

  return NextResponse.redirect(new URL("/tools/q4-planner?captured=1", request.url));
}
