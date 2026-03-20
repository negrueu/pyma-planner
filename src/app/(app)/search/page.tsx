import { searchEvents } from "@/lib/notion";
import { SearchBar } from "@/components/search-bar";
import { EventTable } from "@/components/event-table";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  const events = query ? await searchEvents(query, 50) : [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Caută eveniment</h1>
      <SearchBar defaultValue={query} />
      {query && (
        <p className="text-sm text-muted-foreground">
          {events.length} rezultat{events.length !== 1 ? "e" : ""} pentru &quot;{query}&quot;
        </p>
      )}
      {query ? (
        <EventTable events={events} />
      ) : (
        <p className="text-muted-foreground text-center py-12">
          Introdu un nume sau număr de telefon pentru a căuta.
        </p>
      )}
    </div>
  );
}
