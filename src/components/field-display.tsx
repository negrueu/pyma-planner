import { extract } from "@/lib/notion";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { label: string; value: any; type: string };

export function FieldDisplay({ label, value, type }: Props) {
  const rendered = renderValue(value, type);

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm min-h-[20px]">{rendered}</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderValue(prop: any, type: string): React.ReactNode {
  if (!prop) return <span className="text-muted-foreground/50">—</span>;

  switch (type) {
    case "title":
      return extract.title(prop) || dash();
    case "rich_text":
      return extract.richText(prop) || dash();
    case "select": {
      const val = extract.select(prop);
      return val ? <Badge variant="secondary">{val}</Badge> : dash();
    }
    case "multi_select": {
      const vals = extract.multiSelect(prop);
      return vals.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {vals.map((v) => (
            <Badge key={v} variant="secondary" className="text-xs">
              {v}
            </Badge>
          ))}
        </div>
      ) : (
        dash()
      );
    }
    case "number": {
      const num = extract.number(prop);
      return num !== null ? (
        <span className="tabular-nums">{num.toLocaleString("ro-RO")}</span>
      ) : (
        dash()
      );
    }
    case "date": {
      const d = extract.date(prop);
      if (!d) return dash();
      return new Date(d).toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    case "phone_number":
      return extract.phone(prop) || dash();
    case "email":
      return extract.email(prop) || dash();
    case "checkbox":
      return extract.checkbox(prop) ? "Da" : "Nu";
    case "formula": {
      const f = extract.formula(prop);
      if (f === null) return dash();
      if (typeof f === "number") return (
        <span className="tabular-nums text-muted-foreground italic">
          {f.toLocaleString("ro-RO")}
        </span>
      );
      return <span className="text-muted-foreground italic">{f}</span>;
    }
    default:
      return dash();
  }
}

function dash() {
  return <span className="text-muted-foreground/50">—</span>;
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-muted-foreground px-4 pt-4 pb-1">
      {children}
    </h3>
  );
}
