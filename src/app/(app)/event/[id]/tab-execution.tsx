"use client";

import { EditableTab } from "@/components/editable-tab";
import { EditableField } from "@/components/editable-field";

const fields = [
  { key: "Ora incepere eveniment", label: "Ora începere eveniment", type: "date" },
  { key: "Ora Felul 1", label: "Ora Felul 1", type: "date" },
  { key: "Ora Felul 2", label: "Ora Felul 2", type: "date" },
  { key: "Ora Fel 3", label: "Ora Fel 3", type: "date" },
  { key: "Ora Traditii", label: "Ora Tradiții", type: "date" },
  { key: "Ora Prezentare tort", label: "Ora Prezentare tort", type: "date" },
  { key: "Parintii/Mirii ajung la ora", label: "Părinții/Mirii ajung la", type: "date" },
  { key: "Momente artistice", label: "Momente artistice", type: "rich_text" },
  { key: "Momente artistice externe", label: "Momente artistice externe", type: "rich_text" },
  { key: "Data si ora organizare finala sala & plicuri", label: "Data organizare finală", type: "date" },
  { key: "Detalii aduse de client", label: "Detalii aduse de client", type: "rich_text" },
  { key: "Observatii", label: "Observații", type: "rich_text" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TabExecution({ properties, eventId, lastEditedTime }: { properties: any; eventId: string; lastEditedTime: string }) {
  return (
    <EditableTab
      eventId={eventId}
      lastEditedTime={lastEditedTime}
      properties={properties}
      fields={fields}
      renderField={(field, notionValue, editing, value, onChange) => (
        <EditableField
          key={field.key}
          label={field.label}
          name={field.key}
          notionValue={notionValue}
          type={field.type}
          editing={editing}
          value={value}
          onChange={onChange}
          options={field.options}
        />
      )}
    />
  );
}
