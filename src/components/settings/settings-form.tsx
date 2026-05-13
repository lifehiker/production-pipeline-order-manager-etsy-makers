"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoUploadField } from "@/components/ui/logo-upload-field";

type SettingsFormProps = {
  initialName: string;
  initialAccentColor: string;
  initialProductionHoursPerWeek: number;
  initialLogoUrl: string;
};

export function SettingsForm({
  initialName,
  initialAccentColor,
  initialProductionHoursPerWeek,
  initialLogoUrl,
}: SettingsFormProps) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);

  return (
    <form action="/api/settings" className="mt-5 grid gap-4" method="post">
      <Input defaultValue={initialName} name="name" />
      <Input
        defaultValue={initialAccentColor}
        name="accentColor"
        type="color"
        className="h-14"
      />
      <Input
        defaultValue={initialProductionHoursPerWeek}
        name="productionHoursPerWeek"
        type="number"
      />
      <LogoUploadField
        label="Logo"
        name="logoUrl"
        value={logoUrl}
        onChange={setLogoUrl}
        helperText="Local uploads are stored inside `public/uploads` so builds stay self-contained."
      />
      <Button type="submit">Save settings</Button>
    </form>
  );
}
