export function Progress({
  value,
}: {
  value: number;
}) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--sand)]">
      <div
        className="h-full rounded-full bg-[var(--brand)] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
