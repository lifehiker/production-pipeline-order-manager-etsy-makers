import { formatDate } from "@/lib/utils";
import { requirePrimaryShop } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBaseUrl } from "@/lib/utils";

export default async function SettingsPage() {
  const { user, shop } = await requirePrimaryShop();

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
          <form action="/api/settings" className="mt-5 grid gap-4" method="post">
            <Input defaultValue={shop.name} name="name" />
            <Input defaultValue={shop.accentColor} name="accentColor" type="color" className="h-14" />
            <Input
              defaultValue={shop.productionHoursPerWeek}
              name="productionHoursPerWeek"
              type="number"
            />
            <Input defaultValue={shop.logoUrl || ""} name="logoUrl" placeholder="/uploads/logo.png" />
            <Button type="submit">Save settings</Button>
          </form>
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
            <p className="mt-4 text-xs text-[var(--muted-ink)]">
              Local base URL: {getBaseUrl()}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
