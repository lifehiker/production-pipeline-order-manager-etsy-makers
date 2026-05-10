import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarRange, ClipboardList, LayoutDashboard, LogOut, Settings2, Shapes } from "lucide-react";

import { auth, signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/session";

const navigation = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/orders", label: "Orders", icon: ClipboardList },
  { href: "/app/queue", label: "Queue", icon: Shapes },
  { href: "/app/planner", label: "Planner", icon: CalendarRange },
  { href: "/app/forms", label: "Forms", icon: ClipboardList },
  { href: "/app/settings", label: "Settings", icon: Settings2 },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await requireUser();
  const shop = user.ownedShops[0] ?? user.memberships[0]?.shop;

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="surface rounded-[32px] border border-white/80 p-5">
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[var(--brand)] text-sm font-black text-white">
              MP
            </div>
            <div>
              <div className="font-semibold">{shop?.name || "MakerPipeline"}</div>
              <div className="text-sm text-[var(--muted-ink)]">
                {user.subscriptionStatus.toLowerCase()}
              </div>
            </div>
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge>{shop?.productionHoursPerWeek || 0} hrs/week</Badge>
            <Badge>{shop?.intakeForms?.length || 0} live forms</Badge>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[var(--muted-ink)] transition hover:bg-white hover:text-[var(--ink)]"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-medium">Public intake link</p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted-ink)]">
              Share the first live form directly with Etsy or Instagram customers.
            </p>
            {shop?.intakeForms?.[0] ? (
              <Link
                href={`/f/${shop.intakeForms[0].slug}`}
                className="mt-3 block truncate text-sm text-[var(--brand)]"
              >
                /f/{shop.intakeForms[0].slug}
              </Link>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted-ink)]">
                Finish onboarding to create your first form.
              </p>
            )}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-6"
          >
            <Button className="w-full" variant="secondary" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </aside>
        <main className="surface rounded-[32px] border border-white/80 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
