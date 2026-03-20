import { getEventById, extract } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabClient } from "./tab-client";
import { TabContract } from "./tab-contract";
import { TabMenu } from "./tab-menu";
import { TabExecution } from "./tab-execution";
import { TabFinancial } from "./tab-financial";
import Link from "next/link";

export const dynamic = "force-dynamic";

const eventColors: Record<string, string> = {
  NUNTA: "bg-blue-500/20 text-blue-400",
  Botez: "bg-pink-500/20 text-pink-400",
  Aniversare: "bg-green-500/20 text-green-400",
  Corporate: "bg-zinc-500/20 text-zinc-400",
  Cumătrie: "bg-orange-500/20 text-orange-400",
  Majorat: "bg-purple-500/20 text-purple-400",
};

const salonColors: Record<string, string> = {
  BallRoom: "bg-amber-500/20 text-amber-400",
  Imperial: "bg-indigo-500/20 text-indigo-400",
  Glamour: "bg-rose-500/20 text-rose-400",
};

const phaseColors: Record<string, string> = {
  "Cerere nouă": "bg-yellow-500/20 text-yellow-400",
  "Ofertă trimisă": "bg-orange-500/20 text-orange-400",
  "Contract semnat": "bg-blue-500/20 text-blue-400",
  "În planificare": "bg-purple-500/20 text-purple-400",
  "Pre-eveniment": "bg-green-500/20 text-green-400",
  Finalizat: "bg-zinc-500/20 text-zinc-400",
  Anulat: "bg-red-500/20 text-red-400",
};

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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Dashboard</Link>
        <span>/</span>
        <span>{name}</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {name}
          {name2 && <span className="text-muted-foreground font-normal"> &amp; {name2}</span>}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{displayDate}</span>
          {salon && (
            <Badge variant="secondary" className={salonColors[salon] || ""}>{salon}</Badge>
          )}
          {eventType && (
            <Badge variant="secondary" className={eventColors[eventType] || ""}>{eventType}</Badge>
          )}
          {phase && (
            <Badge variant="secondary" className={phaseColors[phase] || ""}>{phase}</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="client">Date client</TabsTrigger>
          <TabsTrigger value="contract">Ofertă & Contract</TabsTrigger>
          <TabsTrigger value="menu">Meniu & Staff</TabsTrigger>
          <TabsTrigger value="execution">Execuție</TabsTrigger>
          <TabsTrigger value="financial">Financiar</TabsTrigger>
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
