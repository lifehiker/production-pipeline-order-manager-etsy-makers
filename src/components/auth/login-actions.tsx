"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginActionsProps = {
  callbackUrl: string;
  googleEnabled: boolean;
};

export function LoginActions({
  callbackUrl,
  googleEnabled,
}: LoginActionsProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleGoogleSignIn() {
    setError("");
    startTransition(async () => {
      const result = await signIn("google", {
        callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        setError("Unable to start Google sign-in.");
      }
    });
  }

  function handleDemoSignIn(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await signIn("demo-login", {
        email: String(formData.get("email") || ""),
        name: String(formData.get("name") || ""),
        callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        setError("Unable to start the demo workspace.");
      }
    });
  }

  return (
    <>
      {googleEnabled ? (
        <div className="mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={pending}
            type="button"
          >
            Continue with Google
          </Button>
        </div>
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

      <form action={handleDemoSignIn} className="space-y-4">
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
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-full" size="lg" type="submit" disabled={pending}>
          {pending ? "Opening workspace..." : "Start demo trial"}
        </Button>
      </form>
    </>
  );
}
