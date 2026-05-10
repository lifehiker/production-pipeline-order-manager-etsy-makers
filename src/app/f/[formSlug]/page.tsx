import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getDb } from "@/lib/prisma";
import type { IntakeField } from "@/lib/types";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formSlug: string }>;
}) {
  const { formSlug } = await params;
  const db = getDb();
  const form = await db.intakeForm.findUnique({
    where: { slug: formSlug },
    include: { shop: true },
  });

  if (!form || !form.isActive) {
    notFound();
  }

  const fields = form.fields as IntakeField[];

  return (
    <main
      className="min-h-screen px-6 py-14"
      style={
        {
          "--brand": form.shop.accentColor,
          "--brand-strong": form.shop.accentColor,
        } as React.CSSProperties
      }
    >
      <Card className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-ink)]">
          {form.shop.name}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{form.name}</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted-ink)]">
          Tell us what you need, your timeline, and any reference details. Your request will go straight into the production dashboard.
        </p>

        <form action="/api/orders" className="mt-8 space-y-4" method="post" encType="multipart/form-data">
          <input type="hidden" name="formSlug" value={form.slug} />
          {fields.map((field) => (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium">
                {field.label}
                {field.required ? " *" : ""}
              </label>
              {field.type === "textarea" ? (
                <Textarea name={field.id} required={field.required} placeholder={field.placeholder} />
              ) : field.type === "select" ? (
                <select
                  className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                  name={field.id}
                  required={field.required}
                >
                  <option value="">Select one</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <Input name={field.id} required={field.required} type="file" accept="image/*" />
              ) : (
                <Input
                  name={field.id}
                  required={field.required}
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
          <button className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-medium text-white" type="submit">
            Submit request
          </button>
        </form>
      </Card>
    </main>
  );
}
