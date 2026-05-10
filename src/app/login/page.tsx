import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/app/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/app/dashboard";
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hero-grid surface rounded-[36px] border border-white/80 p-8 lg:p-12">
          <Badge>Maker workspace</Badge>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight lg:text-6xl">
            Run custom orders, production queues, and holiday deadlines from one calm dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-ink)]">
            Sign in with Google when credentials are configured, or use the demo workspace to try the full app without external accounts.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Branded intake forms with public share links",
              "Live order dashboard and daily capacity tracking",
              "Backward holiday planning with reminder dates",
            ].map((item) => (
              <Card key={item} className="rounded-[24px] p-5">
                <p className="text-sm leading-6 text-[var(--muted-ink)]">{item}</p>
              </Card>
            ))}
          </div>
        </section>
        <Card className="self-center p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Access MakerPipeline</h2>
            <p className="text-sm text-[var(--muted-ink)]">
              Use a no-card 14-day demo trial now. Google OAuth becomes available as soon as credentials are added.
            </p>
          </div>

          {googleEnabled ? (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
              className="mt-6"
            >
              <Button className="w-full" size="lg">
                Continue with Google
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--canvas)] p-4 text-sm text-[var(--muted-ink)]">
              Google OAuth is not configured in this environment. The demo workspace stays fully usable without it.
            </div>
          )}

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted-ink)]">
            <span className="h-px flex-1 bg-[var(--line)]" />
            Demo workspace
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <form
            action={async (formData) => {
              "use server";
              await signIn("demo-login", {
                email: String(formData.get("email") || ""),
                name: String(formData.get("name") || ""),
                redirectTo: callbackUrl,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Your name</label>
              <Input name="name" placeholder="Avery from Sunbeam Studio" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input
                name="email"
                placeholder="avery@example.com"
                type="email"
                required
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Start demo trial
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
