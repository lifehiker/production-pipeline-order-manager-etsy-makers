import { PlannerTool } from "@/components/planner/planner-tool";
import { requirePrimaryShop } from "@/lib/session";

export default async function PlannerPage() {
  const { shop } = await requirePrimaryShop();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Holiday planner</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted-ink)]">
          Work backward from shipping cutoffs for Q4, Valentine’s Day, and Mother’s Day to set batch targets and material order dates.
        </p>
      </div>
      <PlannerTool shopId={shop.id} saveEnabled />
    </div>
  );
}
