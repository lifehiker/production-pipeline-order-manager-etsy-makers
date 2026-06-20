import { SiteShell } from "@/components/layout/site-shell";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <SiteShell>
    <div className="bg-[var(--canvas)] text-[var(--ink)]">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <section className="hero-grid relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(140deg,rgba(255,255,255,0.9),rgba(255,248,241,0.82))] px-8 py-10 lg:px-12 lg:py-14">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(197,101,63,0.18),transparent_62%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-ink)]">
                Production planning tool for Etsy sellers
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight lg:text-7xl">
                Stop guessing when holiday production has to start.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-ink)]">
                MakerPipeline gives handmade sellers branded intake forms, a live production queue, and backward planning that turns shipping cutoffs into weekly targets.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-6 py-4 text-sm font-medium text-white shadow-[0_16px_30px_rgba(197,101,63,0.2)] transition hover:bg-[var(--brand-strong)]"
                  href="/tools/q4-planner"
                >
                  Launch free Q4 planner
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 py-4 text-sm font-medium"
                  href="/login"
                >
                  Start 14-day trial
                </a>
              </div>
            </div>
            <div className="space-y-4">
              {[
                ["Custom order intake", "Replace Google Forms with branded share links and instant dashboard capture."],
                ["Production queue", "See inquiries, active work, and completed orders without spreadsheet drift."],
                ["Holiday planning", "Calculate production start dates, weekly targets, and material reminders for Q4 and beyond."],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="surface rounded-[30px] border border-white/80 p-6"
                >
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-ink)]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-4">
          {[
            ["400K+", "r/EtsySellers audience actively discussing Q4 prep pain"],
            ["14 days", "No-card trial so makers can test before holiday demand spikes"],
            ["3 planners", "Q4, Valentine’s Day, and Mother’s Day built in"],
            ["0 spreadsheets", "One system from intake to shipping date"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[28px] border border-[var(--line)] bg-white p-6">
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{label}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
    </SiteShell>
  );
}
