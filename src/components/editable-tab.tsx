"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateEventFields, type UpdateResult } from "@/app/(app)/event/[id]/actions";
import { extract } from "@/lib/notion";

type FieldDef = {
  key: string;
  label: string;
  type: string;
  options?: string[];
};

type Props = {
  eventId: string;
  lastEditedTime: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  fields: FieldDef[];
  renderField: (
    field: FieldDef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notionValue: any,
    editing: boolean,
    value: unknown,
    onChange: (name: string, value: unknown) => void
  ) => React.ReactNode;
};

function extractCurrentValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prop: any,
  type: string
): unknown {
  switch (type) {
    case "title": return extract.title(prop);
    case "rich_text": return extract.richText(prop);
    case "select": return extract.select(prop);
    case "multi_select": return extract.multiSelect(prop);
    case "number": return extract.number(prop);
    case "date": return extract.date(prop);
    case "phone_number": return extract.phone(prop);
    case "email": return extract.email(prop);
    case "checkbox": return extract.checkbox(prop);
    default: return null;
  }
}

export function EditableTab({ eventId, lastEditedTime, properties, fields, renderField }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const f of fields) {
      initial[f.key] = extractCurrentValue(properties[f.key], f.type);
    }
    return initial;
  });
  const [originalValues] = useState(values);

  const onChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);

    // Build only changed fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changed: Record<string, any> = {};
    for (const f of fields) {
      if (f.type === "formula") continue; // Skip formulas
      const curr = values[f.key];
      const orig = originalValues[f.key];
      if (JSON.stringify(curr) !== JSON.stringify(orig)) {
        changed[f.key] = { type: f.type, value: curr };
      }
    }

    if (Object.keys(changed).length === 0) {
      setEditing(false);
      setSaving(false);
      toast.info("Nicio modificare.");
      return;
    }

    const result: UpdateResult = await updateEventFields(eventId, lastEditedTime, changed);
    setSaving(false);

    if (result.success) {
      setEditing(false);
      toast.success("Salvat cu succes.");
    } else {
      toast.error(result.error || "Eroare la salvare.");
    }
  }

  function handleCancel() {
    setValues(originalValues);
    setEditing(false);
  }

  return (
    <div className="border border-border rounded-md bg-card">
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border">
        {!editing ? (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Editează
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
              Anulează
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Salvează..." : "Salvează"}
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {fields.map((field) =>
          renderField(
            field,
            properties[field.key],
            editing && field.type !== "formula",
            values[field.key],
            onChange
          )
        )}
      </div>
    </div>
  );
}
