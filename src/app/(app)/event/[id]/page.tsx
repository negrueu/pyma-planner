import { getEventById, extract } from "@/lib/notion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotionBadge } from "@/components/notion-badge";
import { eventTypeStyles, salonStyles, phaseStyles } from "@/lib/notion-colors";
import { TabClient } from "./tab-client";
import { TabContract } from "./tab-contract";
import { TabMenu } from "./tab-menu";
import { TabExecution } from "./tab-execution";
import { TabFinancial } from "./tab-financial";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  const p = event.properties;

  const name = extract.title(p["Nume 1"]);
  const name2 = extract.richText(p["Nume 2 "]);
  const date = extract.date(p["Data evenimentului"]);
  const salon = extract.select(p["Salonul"]);
  const eventType = extract.select(p["Eveniment"]);
  const phase = extract.select(p["Fază"]);

  const displayDate = date
    ? new Date(date).toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground">{name}</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {name}
          {name2 && <span className="text-muted-foreground font-normal"> &amp; {name2}</span>}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{displayDate}</span>
          {salon && <NotionBadge style={salonStyles[salon]}>{salon}</NotionBadge>}
          {eventType && <NotionBadge style={eventTypeStyles[eventType]}>{eventType}</NotionBadge>}
          {phase && <NotionBadge style={phaseStyles[phase]}>{phase}</NotionBadge>}
        </div>
      </div>

      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="bg-muted/50 h-9">
          <TabsTrigger value="client" className="text-xs">Date client</TabsTrigger>
          <TabsTrigger value="contract" className="text-xs">Ofertă & Contract</TabsTrigger>
          <TabsTrigger value="menu" className="text-xs">Meniu & Staff</TabsTrigger>
          <TabsTrigger value="execution" className="text-xs">Execuție</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">Financiar</TabsTrigger>
        </TabsList>

        <TabsContent value="client">
          <TabClient properties={p} eventId={event.id} lastEditedTime={event.lastEditedTime} />
        </TabsContent>
        <TabsContent value="contract">
          <TabContract properties={p} eventId={event.id} lastEditedTime={event.lastEditedTime} />
        </TabsContent>
        <TabsContent value="menu">
          <TabMenu properties={p} eventId={event.id} lastEditedTime={event.lastEditedTime} />
        </TabsContent>
        <TabsContent value="execution">
          <TabExecution properties={p} eventId={event.id} lastEditedTime={event.lastEditedTime} />
        </TabsContent>
        <TabsContent value="financial">
          <TabFinancial properties={p} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
