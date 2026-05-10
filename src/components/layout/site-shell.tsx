import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(247,242,234,0.86)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand)] text-sm font-black text-white">
              MP
            </div>
            <div>
              <div className="font-semibold tracking-tight">MakerPipeline</div>
              <div className="text-xs text-[var(--muted-ink)]">
                Production planning for handmade sellers
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[var(--muted-ink)] md:flex">
            <Link href="/features/intake-form">Intake Forms</Link>
            <Link href="/features/production-queue">Production Queue</Link>
            <Link href="/features/holiday-planner">Holiday Planner</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Badge>Free Q4 planner</Badge>
            <Link href="/login">
              <Button variant="secondary" className="hidden md:inline-flex">
                Sign in
              </Button>
            </Link>
            <Link href="/tools/q4-planner">
              <Button>Try the tool</Button>
            </Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-[var(--line)] bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-[var(--muted-ink)] lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>MakerPipeline helps Etsy and Instagram sellers ship holiday orders on time.</p>
          <div className="flex gap-4">
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/tools/q4-planner">Free Q4 planner</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
