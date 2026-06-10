export const dynamic = 'force-static';
export const revalidate = false;

const posts = [
  {
    href: "/blog/how-to-plan-etsy-q4-production-schedule",
    title: "How to plan your Etsy Q4 production schedule",
  },
  {
    href: "/blog/etsy-holiday-prep-checklist-makers",
    title: "Etsy holiday prep checklist for makers",
  },
  {
    href: "/blog/custom-order-tracker-handmade-sellers",
    title: "Why handmade sellers outgrow spreadsheet order trackers",
  },
  {
    href: "/blog/when-to-order-materials-etsy-q4",
    title: "When to order materials for Etsy Q4",
  },
];

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-5xl font-semibold tracking-tight">MakerPipeline Journal</h1>
      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <a key={post.href} href={post.href} className="rounded-[28px] border border-[var(--line)] bg-white p-6">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
          </a>
        ))}
      </div>
    </main>
  );
}
