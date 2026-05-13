import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";
import { userCanAccessShop } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2),
  fields: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "textarea", "select", "date", "number", "file"]),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    }),
  ),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ formId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = getDb();
  const existingForm = await db.intakeForm.findUnique({
    where: { id: formId },
    select: { id: true, shopId: true },
  });

  if (!existingForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  if (!(await userCanAccessShop(session.user.id, existingForm.shopId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await db.intakeForm.update({
    where: { id: formId },
    data: {
      name: parsed.data.name,
      fields: parsed.data.fields,
    },
  });

  return NextResponse.json({ ok: true, form });
}
