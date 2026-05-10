import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requirePrimaryShop } from "@/lib/session";

export default async function FormsPage() {
  const { shop } = await requirePrimaryShop();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Branded intake forms</h1>
          <p className="mt-2 text-sm text-[var(--muted-ink)]">
            Create public intake pages your customers can use instead of Google Forms.
          </p>
        </div>
        <form action="/api/forms" method="post">
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Create form
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shop.intakeForms.map((form) => (
          <Card key={form.id}>
            <p className="text-lg font-semibold">{form.name}</p>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">/f/{form.slug}</p>
            <div className="mt-6 flex gap-3">
              <Link href={`/app/forms/${form.id}/edit`}>
                <Button variant="secondary">Edit form</Button>
              </Link>
              <Link href={`/f/${form.slug}`}>
                <Button variant="ghost">Preview</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
