"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PRODUCT_TYPE_DEFAULTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type OnboardingFormProps = {
  initialName?: string;
};

export function OnboardingForm({ initialName = "" }: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [shopName, setShopName] = useState(initialName);
  const [accentColor, setAccentColor] = useState("#D05A36");
  const [weeklyHours, setWeeklyHours] = useState("20");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(
    PRODUCT_TYPE_DEFAULTS.slice(0, 3).map((type) => type.slug),
  );
  const [notes, setNotes] = useState("");

  const selectedTypeObjects = useMemo(
    () => PRODUCT_TYPE_DEFAULTS.filter((type) => selectedTypes.includes(type.slug)),
    [selectedTypes],
  );

  function toggleType(slug: string) {
    setSelectedTypes((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  function submit() {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName,
          accentColor,
          weeklyHours: Number(weeklyHours),
          logoUrl,
          notes,
          productTypes: selectedTypeObjects,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || "Unable to save onboarding");
        return;
      }

      router.push("/app/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((currentStep) => (
          <div
            key={currentStep}
            className={`rounded-2xl border p-4 text-sm ${
              step === currentStep
                ? "border-[var(--brand)] bg-white"
                : "border-[var(--line)] bg-[var(--canvas)] text-[var(--muted-ink)]"
            }`}
          >
            Step {currentStep}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Brand your workspace</h2>
            <p className="text-sm text-[var(--muted-ink)]">
              Name the shop your customers recognize and pick a warm accent color.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Shop name</label>
            <Input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              placeholder="Sunbeam Clay Co."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Accent color</label>
              <Input
                type="color"
                value={accentColor}
                onChange={(event) => setAccentColor(event.target.value)}
                className="h-14"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Logo URL</label>
              <Input
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                placeholder="/uploads/your-logo.png"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!shopName.trim()}>
              Continue
            </Button>
          </div>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Choose product types</h2>
            <p className="text-sm text-[var(--muted-ink)]">
              These defaults feed your order estimates and planner calculations.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {PRODUCT_TYPE_DEFAULTS.map((type) => (
              <button
                key={type.slug}
                className={`rounded-2xl border p-4 text-left ${
                  selectedTypes.includes(type.slug)
                    ? "border-[var(--brand)] bg-[var(--canvas)]"
                    : "border-[var(--line)] bg-white"
                }`}
                onClick={() => toggleType(type.slug)}
                type="button"
              >
                <p className="font-medium">{type.name}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">
                  Default {type.productionMinutesPerUnit} min / unit
                </p>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!selectedTypes.length}>
              Continue
            </Button>
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Set your weekly production rhythm</h2>
            <p className="text-sm text-[var(--muted-ink)]">
              This drives capacity tracking, planner dates, and batch targets.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Weekly production hours</label>
            <Input
              value={weeklyHours}
              onChange={(event) => setWeeklyHours(event.target.value)}
              type="number"
              min="1"
              max="168"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Notes about your workflow</label>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Peak days, kiln schedule, batch prep constraints..."
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? "Saving..." : "Finish setup"}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
