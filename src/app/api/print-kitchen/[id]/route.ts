import { NextRequest, NextResponse } from "next/server";
import { getEventById, extract } from "@/lib/notion";

export const dynamic = "force-dynamic";

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
  "Antreu 1": [],
};

const GUSTARE_DESC: Record<string, string> = {
  "Pui vanatoresc": "Steak de pui in sunca de Parma cu legume coapte, piure de sfecla rosie si sos de cappuccino cu ciuperci salbatice",
  "Sarmalute cu mamaliguta bacon si smantana": "Sarmăluțe cu mămăliguță, bacon și smântână",
  "Rulada din pulpa de pui cu sos de ardei copt si legume juliene": "Ruladă din pulpă de pui cu sos de ardei copt și legume juliene",
  "Vrem premium": "Meniu premium",
};

function fmtTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await getEventById(id);
  const p = event.properties;

  const name1 = esc(extract.title(p["Nume 1"]));
  const eventType = esc(extract.select(p["Eveniment"]));
  const date = extract.date(p["Data evenimentului"]);
  const salon = esc(extract.select(p["Salonul"]));
  const estPers = extract.number(p["nrEstPers"]);
  const confPers = extract.number(p["nrPersConfirmate"]);
  const planner = esc(extract.select(p["Event planner"]));

  const antreu = extract.select(p["Antreu"]) || "";
  const felPrincipal = extract.select(p["Fel Principal"]) || "";
  const gustareCalda = extract.select(p["Gustare calda"]) || "";
  const extraGustare = extract.select(p["Preparate extra - gustare calda"]) || "";
  const extraOptiuni = extract.select(p["Extra Optiuni Mancare"]) || "";

  const oraStart = extract.date(p["Ora incepere eveniment"]);
  const oraAntreu = extract.date(p["Ora Felul 1"]);
  const oraGustare = extract.date(p["Ora Felul 2"]);
  const oraFelPrincipal = extract.date(p["Ora Fel 3"]);

  const copiiPlus7 = extract.number(p["NrCopii+7Ani"]);
  const copiiMinus7 = extract.number(p["NrCopii-7"]);
  const meniuVeg = extract.number(p["Meniu Vegetarian"]);
  const meniuVegan = extract.number(p["Meniu Vegan"]);
  const meniuGluten = extract.number(p["Meniu fara gluten"]);
  const meniuPorc = extract.number(p["Meniu fara porc"]);
  const meniuSare = extract.number(p["Meniu fara sare"]);
  const meniuLacto = extract.number(p["Meniu Lacto Ovo Veg"]);
  const mentiuni = esc(extract.richText(p["Meniuri Speciale - MENTIUNI"]));

  const nrFV = extract.number(p["Nr Pers Foto-Video"]) || 0;
  const nrMuz = extract.number(p["Nr Pers muzica"]) || 0;
  const fvTotal = nrFV + nrMuz;

  const bucatarie = extract.multiSelect(p["Bucatarie"]);
  const responsabil = extract.multiSelect(p["ResponsabilBucatarie"]);

  const displayDate = date
    ? new Date(date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const dishes = ANTREU_DISHES[antreu] || [];
  const gustDesc = GUSTARE_DESC[gustareCalda] || gustareCalda;

  const specials: string[] = [];
  if (meniuVeg) specials.push(`Vegetarian: ${meniuVeg}`);
  if (meniuVegan) specials.push(`Vegan: ${meniuVegan}`);
  if (meniuGluten) specials.push(`Fără gluten: ${meniuGluten}`);
  if (meniuPorc) specials.push(`Fără porc: ${meniuPorc}`);
  if (meniuSare) specials.push(`Fără sare: ${meniuSare}`);
  if (meniuLacto) specials.push(`Lacto-Ovo Veg: ${meniuLacto}`);

  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8">
<title>Bucătărie — ${name1} — ${salon} — ${displayDate}</title>
<style>
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding: 20px 30px; color: #000; font-size: 13px; line-height: 1.5; }
.hdr { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
.hdr td { padding: 4px 8px; border: 1px solid #000; font-size: 13px; }
.course { display: flex; justify-content: space-between; border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 6px 0; margin-top: 14px; font-weight: 600; font-size: 14px; }
.cname { font-size: 15px; color: #2563EB; font-weight: 600; margin: 4px 0 2px; }
.cdesc { padding-left: 20px; margin: 2px 0; }
.cdesc li { margin-bottom: 1px; }
.ftr { width: 100%; border-collapse: collapse; margin-top: 14px; }
.ftr td { padding: 5px 8px; border: 1px solid #000; font-size: 12px; }
.staff { display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 16px; }
.staff div { border: 1px solid #000; padding: 8px; text-align: center; min-height: 40px; }
.slbl { font-weight: 600; font-size: 11px; text-transform: uppercase; }
.sval { font-size: 12px; margin-top: 4px; }
@page { margin: 10mm; }
</style>
</head>
<body>
<div style="font-size:16px;margin-bottom:8px;">${eventType}</div>

<table class="hdr">
<tr><td style="width:180px">Data</td><td>${displayDate}</td><td rowspan="2" style="vertical-align:top">Verificat: ${planner || "—"}</td></tr>
<tr><td>Ora</td><td>${oraStart ? fmtTime(oraStart) : "—"}</td></tr>
<tr><td>Sala</td><td colspan="2"><strong>${salon}</strong></td></tr>
<tr><td>Nr persoane estimativ</td><td>${estPers ?? "—"}</td><td>Nr persoane final: <strong>${confPers ?? "—"}</strong></td></tr>
</table>

<div class="course"><span>ORA: ${oraAntreu ? fmtTime(oraAntreu) : "—"}</span><span>${esc(antreu) || "ANTREU"}</span></div>
${dishes.length > 0
    ? `<ul class="cdesc">${dishes.map(d => `<li>${esc(d)}</li>`).join("")}</ul>`
    : `<p style="padding-left:20px;color:#666">${esc(antreu) || "—"}</p>`}

<div class="course"><span>ORA: ${oraGustare ? fmtTime(oraGustare) : "—"}</span><span>GUSTARE CALDĂ</span></div>
<div class="cname">${esc(gustareCalda) || "—"}</div>
${gustDesc !== gustareCalda ? `<ul class="cdesc"><li>${esc(gustDesc)}</li></ul>` : ""}
${extraGustare && extraGustare !== "Nu vrem mulțumesc!" ? `<p style="padding-left:20px;font-style:italic">Extra: ${esc(extraGustare)}</p>` : ""}

<div class="course"><span>ORA: ${oraFelPrincipal ? fmtTime(oraFelPrincipal) : "—"}</span><span>FEL PRINCIPAL</span></div>
<div class="cname" style="color:#000;font-weight:700">${esc(felPrincipal) || "—"}</div>
${extraOptiuni && extraOptiuni !== "Nu dorim" ? `<p style="padding-left:20px">Extra: ${esc(extraOptiuni)}</p>` : ""}

<table class="ftr">
<tr><td style="width:180px">COPII - CRISPY</td><td>${copiiPlus7 ? copiiPlus7 + " porții" : "—"}</td></tr>
<tr><td>COPII 1/2</td><td>${copiiMinus7 ?? "—"}</td></tr>
<tr><td>FOTO-VIDEO, FORMAȚIE</td><td>${fvTotal || "—"}</td></tr>
<tr><td colspan="2" style="text-align:center;font-weight:600">MENIURI SPECIALE</td></tr>
<tr><td colspan="2">${specials.length > 0 ? specials.join(" | ") : "—"}${mentiuni ? "<br>" + mentiuni : ""}</td></tr>
</table>

<div class="staff">
<div><div class="slbl">BUCĂTAR</div><div class="sval">${responsabil.map(esc).join(", ")}</div></div>
<div><div class="slbl">AJUTOR BUCĂTAR</div><div class="sval">${bucatarie.map(esc).join(", ")}</div></div>
<div><div class="slbl">VASE</div><div class="sval"></div></div>
</div>

<script>window.onload=function(){window.print();}</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
