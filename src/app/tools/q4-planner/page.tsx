import { PlannerTool } from "@/components/planner/planner-tool";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Etsy Q4 Holiday Prep Planning Tool | MakerPipeline",
  description:
    "Free Q4 planner for Etsy sellers: work backward from your shipping cutoff to weekly production targets.",
};

export default function Q4PlannerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="bg-[linear-gradient(160deg,#1d1512_0%,#5d3426_55%,#c5653f_100%)] text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Free live tool</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Q4 Holiday Production Planner</h1>
          <p className="mt-6 text-base leading-8 text-white/82">
            No email required to calculate your start date. Use the same planning logic MakerPipeline saves inside the full app.
          </p>
        </Card>
        <PlannerTool ctaHref="/login" ctaLabel="Save this plan in the full app" />
      </div>
      <form action="/api/leads" method="post" className="mt-8 rounded-[28px] border border-[var(--line)] bg-white p-6">
        <p className="text-lg font-semibold">Want a copy in your inbox?</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input className="w-full rounded-full border border-[var(--line)] px-5 py-3" name="email" placeholder="you@example.com" type="email" />
          <input name="source" type="hidden" value="q4-planner" />
          <button className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-medium text-white" type="submit">
            Capture email
          </button>
        </div>
      </form>
    </main>
  );
}
