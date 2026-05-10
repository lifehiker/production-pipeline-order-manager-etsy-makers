export const metadata = {
  title: "Handmade Seller Production Queue | MakerPipeline",
  description:
    "Track handmade orders in a production queue with capacity awareness and status control.",
};

export default function ProductionQueueFeaturePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-5xl font-semibold tracking-tight">A production queue that speaks maker language</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted-ink)]">
        Move from inquiry to in-production to complete, keep daily workload visible, and stop losing track of custom pieces across DMs, Etsy messages, and sticky notes.
      </p>
    </main>
  );
}
