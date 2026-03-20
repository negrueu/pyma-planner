"use client";

import { EditableTab } from "@/components/editable-tab";
import { EditableField } from "@/components/editable-field";

const fields = [
  // Preparate
  { key: "Antreu", label: "Antreu", type: "select", options: ["Antreu 1", "Antreu 2"] },
  { key: "Fel Principal", label: "Fel principal", type: "select", options: ["Tomahawk de porc cu budinca de cartofi si mix de seminte sos spaniol si salata de muraturi asortate", "Duet din muschiulet si ceafa"] },
  { key: "Gustare calda", label: "Gustare caldă", type: "select", options: ["Sarmalute cu mamaliguta bacon si smantana", "Vrem premium", "Rulada din pulpa de pui cu sos de ardei copt si legume juliene", "Pui vanatoresc"] },
  { key: "Extra Optiuni Mancare", label: "Extra opțiuni mâncare", type: "select", options: ["Nu dorim", "Sarmale platouri"] },
  { key: "Preparate extra - gustare calda", label: "Preparate extra gustare", type: "select", options: ["Confit de rata cu sos de visine si fulgi de chilli cu piure de mazare", "Nu vrem mulțumesc!", "Rata domneasca coapta domol la cuptor cu legume si ghebe mamaliguta"] },
  { key: "Mentiuni Antreu", label: "Mențiuni antreu", type: "rich_text" },
  { key: "Mentiuni Fel Principal", label: "Mențiuni fel principal", type: "rich_text" },
  { key: "Mentiuni Gustare Calda", label: "Mențiuni gustare caldă", type: "rich_text" },
  // Meniuri speciale
  { key: "Meniu fara sare", label: "Fără sare (nr.)", type: "number" },
  { key: "Meniu fara gluten", label: "Fără gluten (nr.)", type: "number" },
  { key: "Meniu fara porc", label: "Fără porc (nr.)", type: "number" },
  { key: "Meniu Vegetarian", label: "Vegetarian (nr.)", type: "number" },
  { key: "Meniu Vegan", label: "Vegan (nr.)", type: "number" },
  { key: "Meniu Lacto Ovo Veg", label: "Lacto Ovo Veg (nr.)", type: "number" },
  { key: "Meniu Lacto Ovo Veg cu Peste", label: "Lacto Ovo cu Pește (nr.)", type: "number" },
  { key: "Meniu Vegetarian cu Peste", label: "Vegetarian cu Pește (nr.)", type: "number" },
  { key: "Meniu fara lactate", label: "Fără lactate", type: "rich_text" },
  { key: "Meniuri Speciale - MENTIUNI", label: "Mențiuni speciale", type: "rich_text" },
  // Deserturi
  { key: "Prezentare tort", label: "Prezentare tort", type: "select", options: ["Monoportii", "Macheta etaj comestibil", "Macheta full"] },
  { key: "Tort extra", label: "Tort extra", type: "number" },
  { key: "Prajituri", label: "Prăjituri", type: "rich_text" },
  { key: "Mentiuni Prajituri", label: "Mențiuni prăjituri", type: "rich_text" },
  // Staff
  { key: "DJ", label: "DJ", type: "select", options: ["Yes", "Dj Covalciuc Senior", "Stefan Covalciuc", "Tibi", "Buggy", "Gabi Partac", "Mihai Michelle", "Claudiu Zuppy", "DEEJAY PRODAN"] },
  { key: "DJ inclus", label: "DJ inclus", type: "checkbox" },
  { key: "Fotograf inclus", label: "Fotograf inclus", type: "checkbox" },
  { key: "Videograf inclus", label: "Videograf inclus", type: "checkbox" },
  { key: "Fum greu inclus in oferta", label: "Fum greu inclus", type: "checkbox" },
  { key: "Sef Sala", label: "Șef sală", type: "select", options: ["Claudiu", "Remus Popa", "Emilian Ailenei", "Ionut Spiridon", "Madalina Dianu", "Irinel Barsan", "Ionut Birca", "Robert Diac"] },
  // Logistică
  { key: "Autocar", label: "Autocar", type: "select", options: ["Da", "NU"] },
  { key: "Casuta Dar", label: "Căsuță dar", type: "select", options: ["Da", "Nu"] },
  { key: "Pahare Nasi", label: "Pahare nași", type: "select", options: ["Da", "NU"] },
  { key: "Pachet Cabina foto ", label: "Pachet cabină foto", type: "select", options: ["4 ore", "6 ore", "full event", "NU", "3 ore"] },
  { key: "Degustare", label: "Degustare", type: "number" },
  { key: "Numar dansatori", label: "Număr dansatori", type: "number" },
  { key: "Gustare Calda", label: "Gustare caldă (nr.)", type: "number" },
  { key: "Arcada", label: "Arcadă", type: "number" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TabMenu({ properties, eventId, lastEditedTime }: { properties: any; eventId: string; lastEditedTime: string }) {
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
