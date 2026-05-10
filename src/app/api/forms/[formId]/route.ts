import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

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
  const shop = await db.shop.findFirst({ where: { ownerId: session.user.id } });
  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const form = await db.intakeForm.update({
    where: { id: formId, shopId: shop.id },
    data: {
      name: parsed.data.name,
      fields: parsed.data.fields,
    },
  });

  return NextResponse.json({ ok: true, form });
}
