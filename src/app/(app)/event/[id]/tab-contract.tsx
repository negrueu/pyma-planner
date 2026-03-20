"use client";

import { EditableTab } from "@/components/editable-tab";
import { EditableField } from "@/components/editable-field";

const fields = [
  { key: "prMeniu", label: "Preț meniu", type: "number" },
  { key: "Avans Achitat", label: "Avans achitat", type: "number" },
  { key: "Tarif rezervare 1", label: "Tarif rezervare 1", type: "number" },
  { key: "Valoare Tarif 2", label: "Valoare tarif 2", type: "number" },
  { key: "OpenBar", label: "OpenBar", type: "select", options: ["Whiskey Crema", "Whiskey Cinzano"] },
  { key: "Pret servicii extra total", label: "Preț servicii extra total", type: "number" },
  { key: "NR CTR", label: "Nr. contract", type: "formula" },
  { key: "Data semnarii ctr", label: "Data semnării", type: "date" },
  { key: "Semnatar", label: "Semnatar", type: "select", options: ["Madalina Dianu", "Paul Padurariu", "Elena Padurariu", "Andrei Lungu"] },
  { key: "A completat formularul", label: "A completat formularul", type: "select", options: ["da", "nu"] },
  { key: "Indeplinit CTR", label: "Îndeplinit CTR", type: "rich_text" },
  { key: "Nunta de proba", label: "Nuntă de probă", type: "number" },
  { key: "TotalNuntadeProba", label: "Total nuntă probă", type: "formula" },
  { key: "Observatii nunta de proba", label: "Observații nuntă de probă", type: "rich_text" },
  { key: "CNP", label: "CNP", type: "number" },
  { key: "CNP2", label: "CNP 2", type: "number" },
  { key: "Serie si Nr C.I.", label: "Serie și Nr. C.I.", type: "rich_text" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TabContract({ properties, eventId, lastEditedTime }: { properties: any; eventId: string; lastEditedTime: string }) {
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
