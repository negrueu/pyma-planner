const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const DB_ID = process.env.NOTION_DB_ID!;
const NOTION_VERSION = "2022-06-28";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function notionFetch(path: string, body?: any): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("retry-after") || "1");
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return notionFetch(path, body);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`Notion API ${res.status}: ${error.message || res.statusText}`);
  }

  return res.json();
}

// --- Query database ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryDB(params: Record<string, any> = {}) {
  return notionFetch(`/databases/${DB_ID}/query`, params);
}

// --- Search ---
export async function searchEvents(query: string, limit = 20) {
  const filter = query
    ? {
        or: [
          { property: "Nume 1", title: { contains: query } },
          { property: "telefon", phone_number: { contains: query } },
          { property: "Nume 2 ", rich_text: { contains: query } },
        ],
      }
    : undefined;

  const response = await queryDB({
    filter,
    sorts: [{ property: "Data evenimentului", direction: "ascending" }],
    page_size: limit,
  });

  return (response.results || [])
    .filter((p: { properties?: unknown }) => p.properties)
    .map(extractEventSummary);
}

// --- Upcoming events ---
export async function getUpcomingEvents(limit = 5) {
  const today = new Date().toISOString().split("T")[0];

  const response = await queryDB({
    filter: {
      property: "Data evenimentului",
      date: { on_or_after: today },
    },
    sorts: [{ property: "Data evenimentului", direction: "ascending" }],
    page_size: limit,
  });

  return (response.results || [])
    .filter((p: { properties?: unknown }) => p.properties)
    .map(extractEventSummary);
}

// --- Single event ---
export async function getEventById(pageId: string) {
  const page = await notionFetch(`/pages/${pageId}`);

  return {
    id: page.id,
    lastEditedTime: page.last_edited_time,
    properties: page.properties,
  };
}

// --- Stats ---
export async function getEventStats() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const response = await queryDB({
    filter: {
      and: [
        { property: "Data evenimentului", date: { on_or_after: startOfMonth } },
        { property: "Data evenimentului", date: { on_or_before: endOfMonth } },
      ],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = (response.results || []).filter((p: any) => p.properties);

  const stats = {
    total: events.length,
    byType: {} as Record<string, number>,
    bySalon: {} as Record<string, number>,
    totalPersons: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const event of events as any[]) {
    const type = getSelectValue(event.properties.Eveniment) || "Necunoscut";
    const salon = getSelectValue(event.properties.Salonul) || "Necunoscut";
    const persons = getNumberValue(event.properties.nrEstPers) || 0;

    stats.byType[type] = (stats.byType[type] || 0) + 1;
    stats.bySalon[salon] = (stats.bySalon[salon] || 0) + 1;
    stats.totalPersons += persons;
  }

  return stats;
}

// --- Events by date range (for calendar) — with pagination ---
export async function getEventsByDateRange(start: string, end: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allResults: any[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {
      filter: {
        and: [
          { property: "Data evenimentului", date: { on_or_after: start } },
          { property: "Data evenimentului", date: { on_or_before: end } },
        ],
      },
      sorts: [{ property: "Data evenimentului", direction: "ascending" }],
      page_size: 100,
    };
    if (cursor) params.start_cursor = cursor;

    const response = await queryDB(params);
    allResults.push(...(response.results || []));
    hasMore = response.has_more;
    cursor = response.next_cursor;
  }

  return allResults
    .filter((p: { properties?: unknown }) => p.properties)
    .map(extractEventSummary);
}

// --- Update event ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateEvent(pageId: string, properties: Record<string, any>) {
  return notionFetch(`/pages/${pageId}`, { properties });
}

// --- Create event ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createEvent(properties: Record<string, any>) {
  return notionFetch("/pages", {
    parent: { database_id: DB_ID },
    properties,
  });
}

// --- Check for concurrent edit ---
export async function getLastEditedTime(pageId: string): Promise<string> {
  const page = await notionFetch(`/pages/${pageId}`);
  return page.last_edited_time;
}

// --- Add property to database ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addDatabaseProperty(name: string, config: Record<string, any>) {
  return notionFetch(`/databases/${DB_ID}`, {
    properties: { [name]: config },
  });
}

// --- Property value extractors ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelectValue(prop: any): string | null {
  if (!prop || prop.type !== "select" || !prop.select) return null;
  return prop.select.name;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNumberValue(prop: any): number | null {
  if (!prop || prop.type !== "number") return null;
  return prop.number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTitleValue(prop: any): string {
  if (!prop || prop.type !== "title") return "";
  return prop.title?.map((t: { plain_text: string }) => t.plain_text).join("") || "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRichTextValue(prop: any): string {
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text?.map((t: { plain_text: string }) => t.plain_text).join("") || "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDateValue(prop: any): string | null {
  if (!prop || prop.type !== "date" || !prop.date) return null;
  return prop.date.start;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPhoneValue(prop: any): string {
  if (!prop || prop.type !== "phone_number") return "";
  return prop.phone_number || "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMultiSelectValue(prop: any): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select?.map((s: { name: string }) => s.name) || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCheckboxValue(prop: any): boolean {
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox || false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEmailValue(prop: any): string {
  if (!prop || prop.type !== "email") return "";
  return prop.email || "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFormulaValue(prop: any): string | number | null {
  if (!prop || prop.type !== "formula") return null;
  const formula = prop.formula;
  if (formula.type === "string") return formula.string;
  if (formula.type === "number") return formula.number;
  if (formula.type === "boolean") return formula.boolean ? "Da" : "Nu";
  if (formula.type === "date") return formula.date?.start || null;
  return null;
}

// --- Extract summary for list/table views ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEventSummary(page: any) {
  const p = page.properties;
  return {
    id: page.id as string,
    name: getTitleValue(p["Nume 1"]),
    name2: getRichTextValue(p["Nume 2 "]),
    date: getDateValue(p["Data evenimentului"]),
    salon: getSelectValue(p["Salonul"]),
    eventType: getSelectValue(p["Eveniment"]),
    minPersons: getNumberValue(p["nrMinPers"]),
    estPersons: getNumberValue(p["nrEstPers"]),
    confirmedPersons: getNumberValue(p["nrPersConfirmate"]),
    phase: getSelectValue(p["Fază"]),
    planner: getSelectValue(p["Event planner"]),
    phone: getPhoneValue(p["telefon"]),
    menuPrice: getNumberValue(p["prMeniu"]),
    lastEdited: page.last_edited_time as string,
  };
}

export type EventSummary = ReturnType<typeof extractEventSummary>;

// Export extractors for use in event detail pages
export const extract = {
  title: getTitleValue,
  richText: getRichTextValue,
  select: getSelectValue,
  multiSelect: getMultiSelectValue,
  number: getNumberValue,
  date: getDateValue,
  phone: getPhoneValue,
  checkbox: getCheckboxValue,
  email: getEmailValue,
  formula: getFormulaValue,
};
