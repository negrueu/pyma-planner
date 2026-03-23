import { getEventById, extract } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function PrintClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  const p = event.properties;

  const name1 = extract.title(p["Nume 1"]);
  const name2 = extract.richText(p["Nume 2 "]);
  const phone1 = extract.phone(p["telefon"]);
  const phone2 = extract.phone(p["telefon2"]);
  const email1 = extract.email(p["Email 1"]);
  const date = extract.date(p["Data evenimentului"]);
  const salon = extract.select(p["Salonul"]);
  const eventType = extract.select(p["Eveniment"]);
  const minPers = extract.number(p["nrMinPers"]);
  const estPers = extract.number(p["nrEstPers"]);
  const confPers = extract.number(p["nrPersConfirmate"]);
  const prMeniu = extract.number(p["prMeniu"]);
  const consultant = extract.richText(p["Consultant"]);
  const planner = extract.select(p["Event planner"]);

  // Menu
  const antreu = extract.select(p["Antreu"]);
  const felPrincipal = extract.select(p["Fel Principal"]);
  const gustareCalda = extract.select(p["Gustare calda"]);
  const prezTort = extract.select(p["Prezentare tort"]);
  const tipTort = extract.multiSelect(p["Tipul Tortului"]);

  // Services
  const dj = extract.select(p["DJ"]);
  const djInclus = extract.checkbox(p["DJ inclus"]);
  const fotografInclus = extract.checkbox(p["Fotograf inclus"]);
  const videografInclus = extract.checkbox(p["Videograf inclus"]);
  const fumGreu = extract.checkbox(p["Fum greu inclus in oferta"]);
  const pachetCabina = extract.select(p["Pachet Cabina foto "]);
  const autocar = extract.select(p["Autocar"]);
  const casutaDar = extract.select(p["Casuta Dar"]);

  // Cazare
  const camere = extract.multiSelect(p["Camere"]);

  // Extras
  const serviciiExtra = extract.multiSelect(p["Servicii extra oferite de noi"]);
  const ofertaBauturi = extract.multiSelect(p["Oferta Bauturi "]);

  const displayDate = date
    ? new Date(date).toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <html>
      <head>
        <title>Fișă {name1} — {displayDate}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding: 20px 40px; color: #37352F; font-size: 13px; line-height: 1.5; }
          h1 { font-size: 24px; margin: 0 0 4px; font-weight: 700; }
          h2 { font-size: 16px; margin: 20px 0 8px; font-weight: 600; border-bottom: 1px solid #E3E2E0; padding-bottom: 4px; }
          .header-meta { color: #787774; font-size: 13px; margin-bottom: 16px; }
          .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 500; margin-right: 4px; }
          .badge-salon { background: #F3E8FF; color: #6B21A8; }
          .badge-event { background: #DBEAFE; color: #1E40AF; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          td { padding: 6px 8px; border-bottom: 1px solid #F1F0EE; vertical-align: top; }
          td:first-child { color: #787774; width: 200px; font-size: 12px; }
          td:last-child { font-weight: 500; }
          .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
          .footer { margin-top: 40px; text-align: center; color: #B0AFA8; font-size: 11px; }
          @page { margin: 15mm; }
        `,
          }}
        />
      </head>
      <body>
        <h1>
          {name1}
          {name2 && <span style={{ fontWeight: 400, color: "#787774" }}> & {name2}</span>}
        </h1>
        <div className="header-meta">
          {displayDate}
          {salon && <span className="badge badge-salon" style={{ marginLeft: 8 }}>{salon}</span>}
          {eventType && <span className="badge badge-event">{eventType}</span>}
        </div>

        <h2>Date client</h2>
        <table>
          <tbody>
            <tr><td>Telefon</td><td>{phone1 || "—"}</td></tr>
            {phone2 && <tr><td>Telefon 2</td><td>{phone2}</td></tr>}
            {email1 && <tr><td>Email</td><td>{email1}</td></tr>}
            <tr><td>Nr. minim persoane</td><td>{minPers ?? "—"}</td></tr>
            <tr><td>Nr. estimat persoane</td><td>{estPers ?? "—"}</td></tr>
            {confPers && <tr><td>Nr. confirmate</td><td><strong>{confPers}</strong></td></tr>}
            <tr><td>Preț meniu</td><td>{prMeniu ? `${prMeniu} €` : "—"}</td></tr>
            {consultant && <tr><td>Consultant</td><td>{consultant}</td></tr>}
            {planner && <tr><td>Event planner</td><td>{planner}</td></tr>}
          </tbody>
        </table>

        <h2>Meniu</h2>
        <table>
          <tbody>
            <tr><td>Antreu</td><td>{antreu || "—"}</td></tr>
            <tr><td>Gustare caldă</td><td>{gustareCalda || "—"}</td></tr>
            <tr><td>Fel principal</td><td>{felPrincipal || "—"}</td></tr>
            <tr><td>Prezentare tort</td><td>{prezTort || "—"}</td></tr>
            {tipTort.length > 0 && <tr><td>Tipul tortului</td><td>{tipTort.join(", ")}</td></tr>}
          </tbody>
        </table>

        <h2>Servicii incluse</h2>
        <table>
          <tbody>
            <tr><td>DJ</td><td>{dj || "—"} {djInclus ? "(inclus)" : ""}</td></tr>
            <tr><td>Fotograf</td><td>{fotografInclus ? "Inclus" : "—"}</td></tr>
            <tr><td>Videograf</td><td>{videografInclus ? "Inclus" : "—"}</td></tr>
            <tr><td>Fum greu</td><td>{fumGreu ? "Inclus" : "—"}</td></tr>
            <tr><td>Cabină foto</td><td>{pachetCabina || "—"}</td></tr>
            <tr><td>Autocar</td><td>{autocar || "—"}</td></tr>
            <tr><td>Căsuță dar</td><td>{casutaDar || "—"}</td></tr>
            {camere.length > 0 && <tr><td>Cazare</td><td>{camere.length} cameră/e</td></tr>}
          </tbody>
        </table>

        {ofertaBauturi.length > 0 && (
          <>
            <h2>Ofertă băuturi</h2>
            <ul style={{ paddingLeft: 20, margin: "4px 0" }}>
              {ofertaBauturi.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </>
        )}

        {serviciiExtra.length > 0 && (
          <>
            <h2>Servicii extra</h2>
            <ul style={{ paddingLeft: 20, margin: "4px 0" }}>
              {serviciiExtra.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </>
        )}

        <div className="footer">
          Casablanca Events — {displayDate}
        </div>

        <script dangerouslySetInnerHTML={{ __html: "window.onload = function() { window.print(); };" }} />
      </body>
    </html>
  );
}
