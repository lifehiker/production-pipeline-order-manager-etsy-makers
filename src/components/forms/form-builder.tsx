"use client";

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { IntakeField, IntakeFieldType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const FIELD_TYPES: IntakeFieldType[] = [
  "text",
  "textarea",
  "select",
  "date",
  "number",
  "file",
];

function SortableField({
  field,
  onChange,
  onDelete,
}: {
  field: IntakeField;
  onChange: (field: IntakeField) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-[24px] border border-[var(--line)] bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-3 rounded-xl border border-[var(--line)] p-2 text-[var(--muted-ink)]"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          <Input
            value={field.label}
            onChange={(event) => onChange({ ...field, label: event.target.value })}
            placeholder="Field label"
          />
          <Select
            value={field.type}
            onChange={(event) =>
              onChange({
                ...field,
                type: event.target.value as IntakeFieldType,
                options:
                  event.target.value === "select"
                    ? field.options?.length
                      ? field.options
                      : ["Option 1", "Option 2"]
                    : undefined,
              })
            }
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Input
            value={field.placeholder || ""}
            onChange={(event) =>
              onChange({ ...field, placeholder: event.target.value })
            }
            placeholder="Placeholder"
          />
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm">
            <input
              checked={field.required}
              onChange={(event) =>
                onChange({ ...field, required: event.target.checked })
              }
              type="checkbox"
            />
            Required
          </label>
          {field.type === "select" ? (
            <Input
              className="md:col-span-2"
              value={field.options?.join(", ") || ""}
              onChange={(event) =>
                onChange({
                  ...field,
                  options: event.target.value
                    .split(",")
                    .map((option) => option.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Comma-separated options"
            />
          ) : null}
        </div>
        <button
          className="mt-3 rounded-xl border border-[var(--line)] p-2 text-red-600"
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function FormBuilder({
  formId,
  initialFields,
  formName,
  publicSlug,
}: {
  formId: string;
  initialFields: IntakeField[];
  formName: string;
  publicSlug: string;
}) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const [fields, setFields] = useState<IntakeField[]>(initialFields);
  const [name, setName] = useState(formName);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const previewFields = useMemo(() => fields.filter((field) => field.label.trim()), [fields]);

  function addField() {
    setFields((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        type: "text",
        label: "New field",
        placeholder: "",
        required: false,
      },
    ]);
  }

  function save() {
    setError("");
    startTransition(async () => {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, fields }),
      });

      if (!response.ok) {
        setError("Unable to save changes.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Form builder</h2>
              <p className="text-sm text-[var(--muted-ink)]">
                Reorder fields, change labels, and shape how customers place requests.
              </p>
            </div>
            <Button onClick={addField} variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add field
            </Button>
          </div>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) {
              return;
            }

            const oldIndex = fields.findIndex((field) => field.id === active.id);
            const newIndex = fields.findIndex((field) => field.id === over.id);
            setFields((current) => arrayMove(current, oldIndex, newIndex));
          }}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onChange={(nextField) =>
                    setFields((current) =>
                      current.map((item, currentIndex) =>
                        currentIndex === index ? nextField : item,
                      ),
                    )
                  }
                  onDelete={() =>
                    setFields((current) =>
                      current.filter((item) => item.id !== field.id),
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save form"}
        </Button>
      </div>

      <Card className="sticky top-6 h-fit">
        <p className="text-sm font-medium">Live preview</p>
        <p className="mt-1 text-sm text-[var(--muted-ink)]">/f/{publicSlug}</p>
        <div className="mt-6 space-y-4">
          {previewFields.map((field) => (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium">
                {field.label}
                {field.required ? " *" : ""}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-[var(--line)] px-4 py-3"
                  placeholder={field.placeholder}
                  disabled
                />
              ) : field.type === "select" ? (
                <select className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" disabled>
                  <option>Select one</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
                  disabled
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
