import { getEventById, extract } from "@/lib/notion";

export const dynamic = "force-dynamic";

// Fixed menu descriptions per type
const ANTREU_DISHES: Record<string, string[]> = {
  "Antreu 2": [
    "Gustări tradiționale: ceafă afumată și pastramă de curcan",
    "Balotină din mușchiuleț de porc cu salată de ardei copți și verdeață",
    "Ruladă tradițională din curcan cu pipote și ceapă caramelizată",
    "Paregio în nucă cu roșii crud-uscate",
    "Bouchee cu hummus și tabouleh",
    "Butoiaș de brânză în crustă de alune coapte",
    "Cannoli cu parfait de foie gras și cognac",
    "Salată tradițională de curcan cu castraveciori murați și ciupercuțe",
    "Turnuleț de cremă de brânză aromatizată cu castraveți",
  ],
  // TODO: Add Antreu 1 dishes when Paul provides them
  "Antreu 1": [],
};

const GUSTARE_DESCRIPTIONS: Record<string, string> = {
  "Pui vanatoresc":
    "Steak de pui in sunca de Parma cu legume coapte, piure de sfecla rosie si sos de cappuccino cu ciuperci salbatice",
  "Sarmalute cu mamaliguta bacon si smantana":
    "Sarmăluțe cu mămăliguță, bacon și smântână",
  "Rulada din pulpa de pui cu sos de ardei copt si legume juliene":
    "Ruladă din pulpă de pui cu sos de ardei copt și legume juliene",
  // TODO: Add "Vrem premium" description when Paul provides it
  "Vrem premium": "Meniu premium (detalii TBD)",
};

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default async function PrintKitchenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  const p = event.properties;

  const name1 = extract.title(p["Nume 1"]);
  const eventType = extract.select(p["Eveniment"]);
  const date = extract.date(p["Data evenimentului"]);
  const salon = extract.select(p["Salonul"]);
  const estPers = extract.number(p["nrEstPers"]);
  const confPers = extract.number(p["nrPersConfirmate"]);
  const planner = extract.select(p["Event planner"]);

  // Menu selections
  const antreu = extract.select(p["Antreu"]);
  const felPrincipal = extract.select(p["Fel Principal"]);
  const gustareCalda = extract.select(p["Gustare calda"]);
  const extraGustare = extract.select(p["Preparate extra - gustare calda"]);
  const extraOptiuni = extract.select(p["Extra Optiuni Mancare"]);

  // Times
  const oraStart = extract.date(p["Ora incepere eveniment"]);
  const oraAntreu = extract.date(p["Ora Felul 1"]);
  const oraGustare = extract.date(p["Ora Felul 2"]);
  const oraFelPrincipal = extract.date(p["Ora Fel 3"]);

  // Special menus
  const copiiPlus7 = extract.number(p["NrCopii+7Ani"]);
  const copiiMinus7 = extract.number(p["NrCopii-7"]);
  const meniuVegetarian = extract.number(p["Meniu Vegetarian"]);
  const meniuVegan = extract.number(p["Meniu Vegan"]);
  const meniuFaraGluten = extract.number(p["Meniu fara gluten"]);
  const meniuFaraPorc = extract.number(p["Meniu fara porc"]);
  const meniuFaraSare = extract.number(p["Meniu fara sare"]);
  const meniuLactoOvo = extract.number(p["Meniu Lacto Ovo Veg"]);
  const mentiuniSpeciale = extract.richText(p["Meniuri Speciale - MENTIUNI"]);

  // Staff counts
  const nrFotoVideo = extract.number(p["Nr Pers Foto-Video"]);
  const nrMuzica = extract.number(p["Nr Pers muzica"]);
  const fotoVideoTotal = (nrFotoVideo || 0) + (nrMuzica || 0);

  // Kitchen staff
  const bucatarie = extract.multiSelect(p["Bucatarie"]);
  const responsabil = extract.multiSelect(p["ResponsabilBucatarie"]);

  const displayDate = date
    ? new Date(date).toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  const antDishes = antreu ? ANTREU_DISHES[antreu] || [] : [];
  const gustareDesc = gustareCalda ? GUSTARE_DESCRIPTIONS[gustareCalda] || gustareCalda : "";

  // Collect special menus
  const specialMenus: string[] = [];
  if (meniuVegetarian) specialMenus.push(`Vegetarian: ${meniuVegetarian}`);
  if (meniuVegan) specialMenus.push(`Vegan: ${meniuVegan}`);
  if (meniuFaraGluten) specialMenus.push(`Fără gluten: ${meniuFaraGluten}`);
  if (meniuFaraPorc) specialMenus.push(`Fără porc: ${meniuFaraPorc}`);
  if (meniuFaraSare) specialMenus.push(`Fără sare: ${meniuFaraSare}`);
  if (meniuLactoOvo) specialMenus.push(`Lacto-Ovo Veg: ${meniuLactoOvo}`);

  return (
    <html>
      <head>
        <title>Bucătărie — {name1} — {salon} — {displayDate}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding: 20px 30px; color: #000; font-size: 13px; line-height: 1.5; }
          h1 { font-size: 14px; font-weight: 400; margin: 0 0 8px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .header-table td { padding: 4px 8px; border: 1px solid #000; font-size: 13px; }
          .header-table td:first-child { font-weight: 400; width: 180px; }
          .header-table td:last-child { font-weight: 600; }
          .course-header { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 6px 0; margin-top: 16px; font-weight: 600; font-size: 14px; }
          .course-name { font-size: 15px; color: #2563EB; font-weight: 600; margin: 6px 0 2px; }
          .course-desc { margin: 0; padding-left: 20px; }
          .course-desc li { margin-bottom: 2px; }
          .footer-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .footer-table td { padding: 6px 8px; border: 1px solid #000; font-size: 12px; vertical-align: top; }
          .footer-table td:first-child { width: 180px; font-weight: 500; }
          .staff-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; margin-top: 20px; }
          .staff-cell { border: 1px solid #000; padding: 8px; text-align: center; min-height: 40px; }
          .staff-label { font-weight: 600; font-size: 11px; text-transform: uppercase; }
          .staff-value { font-size: 12px; margin-top: 4px; }
          @page { margin: 10mm; }
        `,
          }}
        />
      </head>
      <body>
        <h1>{eventType}</h1>

        <table className="header-table">
          <tbody>
            <tr><td>Data</td><td>{displayDate}</td><td rowSpan={2} style={{ verticalAlign: "top" }}>Verificat: {planner || "—"}</td></tr>
            <tr><td>Ora</td><td>{oraStart ? formatTime(oraStart) : "—"}</td></tr>
            <tr><td>Sala</td><td colSpan={2}>{salon || "—"}</td></tr>
            <tr><td>Nr persoane estimativ</td><td>{estPers ?? "—"}</td><td>Nr persoane final: <strong>{confPers ?? "—"}</strong></td></tr>
          </tbody>
        </table>

        {/* ANTREU */}
        <div className="course-header">
          <span>ORA: {oraAntreu ? formatTime(oraAntreu) : "—"}</span>
          <span>{antreu || "ANTREU"}</span>
        </div>
        {antDishes.length > 0 ? (
          <ul className="course-desc">
            {antDishes.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        ) : (
          <p style={{ paddingLeft: 20, color: "#666" }}>{antreu || "—"}</p>
        )}

        {/* GUSTARE CALDĂ */}
        <div className="course-header">
          <span>ORA: {oraGustare ? formatTime(oraGustare) : "—"}</span>
          <span>GUSTARE CALDĂ</span>
        </div>
        <div className="course-name">{gustareCalda || "—"}</div>
        {gustareDesc && gustareDesc !== gustareCalda && (
          <ul className="course-desc">
            <li>{gustareDesc}</li>
          </ul>
        )}
        {extraGustare && extraGustare !== "Nu vrem mulțumesc!" && (
          <p style={{ paddingLeft: 20, fontStyle: "italic" }}>Extra: {extraGustare}</p>
        )}

        {/* FEL PRINCIPAL */}
        <div className="course-header">
          <span>ORA: {oraFelPrincipal ? formatTime(oraFelPrincipal) : "—"}</span>
          <span>FEL PRINCIPAL</span>
        </div>
        <div className="course-name" style={{ fontWeight: 700, color: "#000" }}>
          {felPrincipal || "—"}
        </div>
        {extraOptiuni && extraOptiuni !== "Nu dorim" && (
          <p style={{ paddingLeft: 20 }}>Extra: {extraOptiuni}</p>
        )}

        {/* Footer table */}
        <table className="footer-table">
          <tbody>
            <tr>
              <td>COPII - CRISPY</td>
              <td>{copiiPlus7 ? `${copiiPlus7} porții` : "—"}</td>
            </tr>
            <tr>
              <td>COPII 1/2</td>
              <td>{copiiMinus7 ?? "—"}</td>
            </tr>
            <tr>
              <td>FOTO-VIDEO, FORMAȚIE</td>
              <td>{fotoVideoTotal || "—"}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: "center", fontWeight: 600 }}>
                MENIURI SPECIALE
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                {specialMenus.length > 0 ? specialMenus.join(" | ") : "—"}
                {mentiuniSpeciale && <><br />{mentiuniSpeciale}</>}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Staff row */}
        <div className="staff-row">
          <div className="staff-cell">
            <div className="staff-label">BUCĂTAR</div>
            <div className="staff-value">{responsabil.length > 0 ? responsabil.join(", ") : ""}</div>
          </div>
          <div className="staff-cell">
            <div className="staff-label">AJUTOR BUCĂTAR</div>
            <div className="staff-value">{bucatarie.length > 0 ? bucatarie.join(", ") : ""}</div>
          </div>
          <div className="staff-cell">
            <div className="staff-label">VASE</div>
            <div className="staff-value"></div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: "window.onload = function() { window.print(); };" }} />
      </body>
    </html>
  );
}
