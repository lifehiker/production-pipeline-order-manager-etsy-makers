import { notFound } from "next/navigation";

import { FormBuilder } from "@/components/forms/form-builder";
import type { IntakeField } from "@/lib/types";
import { requirePrimaryShop } from "@/lib/session";
import { getDb } from "@/lib/prisma";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const { shop } = await requirePrimaryShop();
  const db = getDb();
  const form = await db.intakeForm.findFirst({
    where: {
      id: formId,
      shopId: shop.id,
    },
  });

  if (!form) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{form.name}</h1>
        <p className="mt-2 text-sm text-[var(--muted-ink)]">
          Tune labels, reorder fields, and preview the public experience live.
        </p>
      </div>
      <FormBuilder
        formId={form.id}
        formName={form.name}
        publicSlug={form.slug}
        initialFields={form.fields as IntakeField[]}
      />
    </div>
  );
}
