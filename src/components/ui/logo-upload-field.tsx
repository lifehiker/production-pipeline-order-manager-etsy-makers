"use client";

import { useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LogoUploadFieldProps = {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
};

export function LogoUploadField({
  label = "Logo",
  name,
  value,
  onChange,
  helperText,
}: LogoUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function uploadFile(file: File) {
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError("Upload failed. Try a PNG or JPG under your current environment limits.");
        return;
      }

      const payload = (await response.json()) as { path?: string };
      onChange(payload.path || "");
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium" htmlFor={inputId}>
          {label}
        </label>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
        >
          {pending ? "Uploading..." : "Upload logo"}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            uploadFile(file);
          }
          event.target.value = "";
        }}
      />
      <Input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/logo.png"
      />
      {name ? <input type="hidden" name={name} value={value} readOnly /> : null}
      {value ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-4">
          <img
            src={value}
            alt="Shop logo preview"
            className="h-16 w-16 rounded-2xl object-cover"
          />
        </div>
      ) : null}
      {helperText ? (
        <p className="text-xs text-[var(--muted-ink)]">{helperText}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
