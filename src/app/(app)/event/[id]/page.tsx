import { getEventById, extract } from "@/lib/notion";
import { logAudit } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  const [event, session] = await Promise.all([
    getEventById(id),
    getServerSession(authOptions),
  ]);
  const p = event.properties;

  // Log view
  const name1 = extract.title(p["Nume 1"]);
  if (session?.user?.email) {
    logAudit({
      user_email: session.user.email,
      user_name: session.user.name || "",
      action: "view_event",
      event_id: id,
      event_name: name1,
    });
  }

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
    : "";

  return (
    <div className="max-w-[900px] mx-auto px-[96px] py-8">
      <div className="text-[12px] text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{name}</span>
      </div>

      <h1 className="text-[40px] font-bold leading-[1.2] mb-1">
        {name}
        {name2 && <span className="text-muted-foreground font-normal"> &amp; {name2}</span>}
      </h1>

      <div className="flex flex-wrap items-center gap-[6px] mb-6 text-[14px] text-muted-foreground">
        {displayDate && <span>{displayDate}</span>}
        {salon && <NotionBadge style={salonStyles[salon]}>{salon}</NotionBadge>}
        {eventType && <NotionBadge style={eventTypeStyles[eventType]}>{eventType}</NotionBadge>}
        {phase && <NotionBadge style={phaseStyles[phase]}>{phase}</NotionBadge>}
      </div>

      <Tabs defaultValue="client">
        <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto gap-0">
          {[
            { value: "client", label: "Date client" },
            { value: "contract", label: "Ofertă & Contract" },
            { value: "menu", label: "Meniu & Staff" },
            { value: "execution", label: "Execuție" },
            { value: "financial", label: "Financiar" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-[13px] text-muted-foreground data-[state=active]:text-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="pt-4">
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
        </div>
      </Tabs>
    </div>
  );
}
