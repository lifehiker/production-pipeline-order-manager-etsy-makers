import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDb } from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const db = getDb();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { ownedShops: true },
  });

  if (user?.ownedShops.length) {
    redirect("/app/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Badge>Onboarding</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Set up your production workspace in three steps.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-ink)]">
          The result is a real shop profile with intake forms, production defaults, and a trial-ready dashboard.
        </p>
      </div>
      <Card className="bg-[var(--canvas)]">
        <p className="text-sm leading-7 text-[var(--muted-ink)]">
          This setup uses local-safe defaults. If Google OAuth, Stripe, or Resend are missing, the app still runs and those paths stay gracefully guarded.
        </p>
      </Card>
      <OnboardingForm initialName={user?.name || ""} />
    </div>
  );
}
