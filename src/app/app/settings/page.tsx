import { formatDate } from "@/lib/utils";
import { requirePrimaryShop } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsForm } from "@/components/settings/settings-form";
import { getBaseUrl } from "@/lib/utils";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    billing?: string;
    invite?: string;
  }>;
}) {
  const { user, shop } = await requirePrimaryShop();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-[var(--muted-ink)]">
          Manage your shop profile, subscription path, and Studio invite flow.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-semibold">Shop profile</h2>
          <SettingsForm
            initialName={shop.name}
            initialAccentColor={shop.accentColor}
            initialProductionHoursPerWeek={shop.productionHoursPerWeek}
            initialLogoUrl={shop.logoUrl || ""}
          />
          {params.saved === "1" ? (
            <p className="mt-4 text-sm text-[var(--success)]">
              Shop settings saved.
            </p>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold">Subscription</h2>
            <p className="mt-3 text-sm text-[var(--muted-ink)]">
              Status: {user.subscriptionStatus.toLowerCase()}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">
              Trial ends: {formatDate(user.trialEndsAt)}
            </p>
            <div className="mt-5 flex gap-3">
              <form action="/api/checkout" method="post">
                <input name="planId" type="hidden" value="studio-monthly" />
                <Button type="submit">Upgrade to Studio</Button>
              </form>
              <form action="/api/billing/portal" method="post">
                <Button variant="secondary" type="submit">
                  Billing portal
                </Button>
              </form>
            </div>
            {params.billing ? (
              <p className="mt-4 text-sm text-[var(--muted-ink)]">
                {params.billing === "success"
                  ? "Checkout completed. Stripe webhook sync will update your plan state as events arrive."
                  : params.billing === "demo"
                    ? "Stripe is not configured here, so billing stays in demo mode."
                    : params.billing === "missing-price"
                      ? "A Stripe price ID is missing for that plan."
                      : "Billing flow was cancelled."}
              </p>
            ) : null}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Invite a teammate</h2>
            <p className="mt-3 text-sm text-[var(--muted-ink)]">
              Studio invite emails use Resend when available and otherwise create a usable local accept link.
            </p>
            <form action="/api/invites" method="post" className="mt-4 grid gap-4">
              <Input name="email" placeholder="teammate@example.com" type="email" />
              <Button type="submit">Send invite</Button>
            </form>
            {params.invite ? (
              <p className="mt-4 text-sm text-[var(--muted-ink)]">
                {params.invite === "sent"
                  ? "Invite created. If Resend is unavailable, the local accept link is still valid."
                  : params.invite === "missing-email"
                    ? "Enter an email address before sending an invite."
                    : "That invite link is invalid, already used, or tied to a different email."}
              </p>
            ) : null}
            <p className="mt-4 text-xs text-[var(--muted-ink)]">
              Local base URL: {getBaseUrl()}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
