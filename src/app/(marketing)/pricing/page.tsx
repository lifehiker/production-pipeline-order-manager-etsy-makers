import { PLAN_DEFINITIONS } from "@/lib/constants";

export const metadata = {
  title: "Pricing | MakerPipeline",
  description:
    "Compare MakerPipeline Solo and Studio pricing for handmade sellers managing custom orders and seasonal production.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight">Simple pricing for solo makers and small studios</h1>
        <p className="mt-6 text-lg leading-8 text-[var(--muted-ink)]">
          Start with a 14-day free trial. When Stripe is not configured, checkout buttons fall back safely and the app remains usable locally.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLAN_DEFINITIONS.map((plan) => (
          <div key={plan.id} className="rounded-[28px] border border-[var(--line)] bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-ink)]">{plan.name}</p>
            <p className="mt-4 text-4xl font-semibold">
              {plan.price}
              <span className="text-base text-[var(--muted-ink)]">{plan.cadence}</span>
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-ink)]">{plan.description}</p>
            <form action="/api/checkout" method="post" className="mt-6">
              <input type="hidden" name="planId" value={plan.id} />
              <button className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white">
                Choose plan
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
