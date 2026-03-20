"use client";

import { EditableTab } from "@/components/editable-tab";
import { EditableField } from "@/components/editable-field";

const fields = [
  { key: "Nume 1", label: "Nume 1", type: "title" },
  { key: "Nume 2 ", label: "Nume 2", type: "rich_text" },
  { key: "telefon", label: "Telefon", type: "phone_number" },
  { key: "telefon2", label: "Telefon 2", type: "phone_number" },
  { key: "Email 1", label: "Email 1", type: "email" },
  { key: "Email 2", label: "Email 2", type: "email" },
  { key: "adresa", label: "Adresă", type: "rich_text" },
  { key: "Data evenimentului", label: "Data evenimentului", type: "date" },
  { key: "Salonul", label: "Salon", type: "select", options: ["BallRoom", "Imperial", "Glamour"] },
  { key: "Eveniment", label: "Eveniment", type: "select", options: ["NUNTA", "Botez", "Aniversare", "Majorat", "Banchet", "Cumătrie", "Prânz", "Corporate"] },
  { key: "Zi din saptamana", label: "Zi din săptămâna", type: "select", options: ["L", "M", "Mi", "J", "V", "S", "D"] },
  { key: "nrMinPers", label: "Nr. minim persoane", type: "number" },
  { key: "nrEstPers", label: "Nr. estimat persoane", type: "number" },
  { key: "nrPersConfirmate", label: "Nr. confirmate", type: "number" },
  { key: "Consultant", label: "Consultant", type: "rich_text" },
  { key: "Event planner", label: "Event planner", type: "select", options: ["Paul Padurariu", "Madalina Raluca Dianu"] },
  { key: "Fază", label: "Fază", type: "select", options: ["Cerere nouă", "Ofertă trimisă", "Contract semnat", "În planificare", "Pre-eveniment", "Finalizat", "Anulat"] },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TabClient({ properties, eventId, lastEditedTime }: { properties: any; eventId: string; lastEditedTime: string }) {
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
