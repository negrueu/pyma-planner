// Notion-identical tag colors — uses CSS variables that adapt to light/dark
// These map to --color-notion-* variables in globals.css

export const eventTypeStyles: Record<string, React.CSSProperties> = {
  NUNTA: { backgroundColor: "var(--color-notion-blue)", color: "var(--color-notion-blue-text)" },
  Botez: { backgroundColor: "var(--color-notion-pink)", color: "var(--color-notion-pink-text)" },
  Aniversare: { backgroundColor: "var(--color-notion-green)", color: "var(--color-notion-green-text)" },
  Corporate: { backgroundColor: "var(--color-notion-gray)", color: "var(--color-notion-gray-text)" },
  "Cumătrie": { backgroundColor: "var(--color-notion-orange)", color: "var(--color-notion-orange-text)" },
  Majorat: { backgroundColor: "var(--color-notion-purple)", color: "var(--color-notion-purple-text)" },
  Banchet: { backgroundColor: "var(--color-notion-yellow)", color: "var(--color-notion-yellow-text)" },
  "Prânz": { backgroundColor: "var(--color-notion-brown)", color: "var(--color-notion-brown-text)" },
};

export const salonStyles: Record<string, React.CSSProperties> = {
  BallRoom: { backgroundColor: "var(--color-notion-orange)", color: "var(--color-notion-orange-text)" },
  Imperial: { backgroundColor: "var(--color-notion-purple)", color: "var(--color-notion-purple-text)" },
  Glamour: { backgroundColor: "var(--color-notion-pink)", color: "var(--color-notion-pink-text)" },
};

export const phaseStyles: Record<string, React.CSSProperties> = {
  "Cerere nouă": { backgroundColor: "var(--color-notion-yellow)", color: "var(--color-notion-yellow-text)" },
  "Ofertă trimisă": { backgroundColor: "var(--color-notion-orange)", color: "var(--color-notion-orange-text)" },
  "Contract semnat": { backgroundColor: "var(--color-notion-blue)", color: "var(--color-notion-blue-text)" },
  "În planificare": { backgroundColor: "var(--color-notion-purple)", color: "var(--color-notion-purple-text)" },
  "Pre-eveniment": { backgroundColor: "var(--color-notion-green)", color: "var(--color-notion-green-text)" },
  Finalizat: { backgroundColor: "var(--color-notion-gray)", color: "var(--color-notion-gray-text)" },
  Anulat: { backgroundColor: "var(--color-notion-red)", color: "var(--color-notion-red-text)" },
};

// Calendar event colors (solid, for calendar dots/bars)
export const calendarEventColors: Record<string, string> = {
  NUNTA: "#0B6E99",
  Botez: "#AD1A72",
  Aniversare: "#0F7B6C",
  Corporate: "#9B9A97",
  "Cumătrie": "#D9730D",
  Majorat: "#6940A5",
  Banchet: "#DFAB01",
  "Prânz": "#64473A",
};

// Kanban column top border colors
export const kanbanPhaseColors: Record<string, string> = {
  "Cerere nouă": "#DFAB01",
  "Ofertă trimisă": "#D9730D",
  "Contract semnat": "#0B6E99",
  "În planificare": "#6940A5",
  "Pre-eveniment": "#0F7B6C",
};
