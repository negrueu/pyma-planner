import { FieldDisplay, FieldGrid, SectionTitle } from "@/components/field-display";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TabFinancial({ properties: p }: { properties: any }) {
  return (
    <div className="border border-border rounded-md bg-card">
      <SectionTitle>Rezumat financiar</SectionTitle>
      <FieldGrid>
        <FieldDisplay label="Total" value={p["Total"]} type="formula" />
        <FieldDisplay label="Estimare" value={p["Estimare"]} type="formula" />
        <FieldDisplay label="Încasare finală" value={p["Incasare Finala"]} type="formula" />
        <FieldDisplay label="Minim încasare" value={p["Minim Incasare"]} type="formula" />
        <FieldDisplay label="Nr. pers. încasat" value={p["nrPersIncasat"]} type="number" />
        <FieldDisplay label="Total tarif rezervare" value={p["Total Tarif Rezervare"]} type="formula" />
      </FieldGrid>

      <SectionTitle>Detalii pe categorii</SectionTitle>
      <FieldGrid>
        <FieldDisplay label="Total bucătărie" value={p["Total Bucatarie"]} type="formula" />
        <FieldDisplay label="Total plăți part time" value={p["Total plati part time"]} type="formula" />
        <FieldDisplay label="Total cazare" value={p["TotalCazare"]} type="formula" />
        <FieldDisplay label="Total bar sarmale" value={p["Total BarSarmale"]} type="formula" />
        <FieldDisplay label="Total Dubai Bar" value={p["Total DubaiBar"]} type="formula" />
        <FieldDisplay label="Total Fruit Bar" value={p["Total Fruit Bar"]} type="formula" />
        <FieldDisplay label="Total melanj sărat" value={p["Total MelanjSarat"]} type="formula" />
        <FieldDisplay label="Total ofertă bar" value={p["Total Oferta Bar"]} type="formula" />
        <FieldDisplay label="Total taxă pahare" value={p["Total TaxaPahare"]} type="formula" />
        <FieldDisplay label="Total copii +7" value={p["Total copii +7"]} type="formula" />
        <FieldDisplay label="Total copii -7" value={p["Total copii - 7"]} type="formula" />
        <FieldDisplay label="Total meniu dansatori" value={p["TotalMeniuDansatori"]} type="formula" />
        <FieldDisplay label="Total preparat extra" value={p["TotalPreparat extra"]} type="formula" />
        <FieldDisplay label="Total produse extra" value={p["TotalProduseExtra"]} type="formula" />
      </FieldGrid>

      <SectionTitle>Prețuri personal</SectionTitle>
      <FieldGrid>
        <FieldDisplay label="Preț bucătărie" value={p["prBucatarie"]} type="formula" />
        <FieldDisplay label="Preț responsabil bucătărie" value={p["prResponsabilBucatarie"]} type="formula" />
        <FieldDisplay label="Total ospătari Gr1" value={p["Total prPtOspatariGr1 (1)"]} type="formula" />
        <FieldDisplay label="Total ospătari Gr2" value={p["Total prPtOspatariGr2"]} type="formula" />
        <FieldDisplay label="Total ospătari Gr3" value={p["Total prPtOspatariGr3"]} type="formula" />
        <FieldDisplay label="Total ospătari Gr4" value={p["Total prPtOspatariGr4"]} type="formula" />
      </FieldGrid>
    </div>
  );
}
