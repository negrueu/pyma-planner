"use client";

import { EditableTab } from "@/components/editable-tab";
import { EditableField } from "@/components/editable-field";

const fields = [
  // Confirmare
  { key: "nrPersConfirmate", label: "Nr. persoane confirmate", type: "number" },
  { key: "nrPersIncasat", label: "Nr. persoane încasat", type: "number" },
  { key: "Zi din saptamana", label: "Zi din săptămâna", type: "select", options: ["V", "S", "D", "J", "L"] },
  // Ore
  { key: "Ora incepere eveniment", label: "Ora începere eveniment", type: "date" },
  { key: "Parintii/Mirii ajung la ora", label: "Părinții/Mirii ajung la", type: "date" },
  { key: "Ora Felul 1", label: "Ora Antreu", type: "date" },
  { key: "Ora Felul 2", label: "Ora Gustare caldă", type: "date" },
  { key: "Ora Fel 3", label: "Ora Fel principal", type: "date" },
  { key: "Ora Traditii", label: "Ora Tradiții", type: "date" },
  { key: "Ora Prezentare tort", label: "Ora Prezentare tort", type: "date" },
  // Cazare
  { key: "Camere", label: "Cazare (camere)", type: "multi_select", options: ["1", "2", "3", "4", "5", "6"] },
  // Tradiții
  { key: "Traditii", label: "Tradiții", type: "multi_select", options: ["Gaina", "Colacii"] },
  { key: "Ancar", label: "Ancar", type: "select", options: ["Alb", "Roz", "Turcoaz", "Piersica", "Albastru deschis", "Verde"] },
  // Coordonare
  { key: "Data si ora organizare finala sala & plicuri", label: "Data organizare finală sală", type: "date" },
  { key: "Detalii aduse de client", label: "Detalii aduse de client", type: "rich_text" },
  { key: "Observatii", label: "Observații", type: "rich_text" },
  { key: "Observatii nunta de proba", label: "Observații nuntă de probă", type: "rich_text" },
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
