import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File missing" }, { status: 400 });
  }

  const path = await saveUploadedFile(file);
  return NextResponse.json({ ok: true, path });
}
