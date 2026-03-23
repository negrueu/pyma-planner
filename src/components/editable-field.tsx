"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotionBadge } from "@/components/notion-badge";
import { extract } from "@/lib/notion";

type FieldProps = {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notionValue: any;
  type: string;
  editing: boolean;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  options?: string[];
};

export function EditableField({
  label,
  name,
  notionValue,
  type,
  editing,
  value,
  onChange,
  options,
}: FieldProps) {
  if (!editing) {
    return (
      <div>
        <p className="text-[12px] text-muted-foreground mb-[2px]">{label}</p>
        <div className="text-[14px] min-h-[20px]">{renderReadonly(notionValue, type)}</div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12px] text-muted-foreground mb-[2px]">{label}</p>
      {renderEditable(name, type, value, onChange, options)}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderReadonly(prop: any, type: string): React.ReactNode {
  if (!prop) return <span className="text-muted-foreground/50">—</span>;

  switch (type) {
    case "title": return extract.title(prop) || dash();
    case "rich_text": return extract.richText(prop) || dash();
    case "select": {
      const v = extract.select(prop);
      return v ? <span className="text-[13px] break-words leading-snug">{v}</span> : dash();
    }
    case "multi_select": {
      const vals = extract.multiSelect(prop);
      return vals.length > 0 ? (
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {vals.map((v) => <NotionBadge key={v} className="text-[11px] max-w-full truncate">{v}</NotionBadge>)}
        </div>
      ) : dash();
    }
    case "number": {
      const n = extract.number(prop);
      return n !== null ? <span className="tabular-nums">{n.toLocaleString("ro-RO")}</span> : dash();
    }
    case "date": {
      const d = extract.date(prop);
      return d ? new Date(d).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" }) : dash();
    }
    case "phone_number": return extract.phone(prop) || dash();
    case "email": return extract.email(prop) || dash();
    case "checkbox": return extract.checkbox(prop) ? "Da" : "Nu";
    case "formula": {
      const f = extract.formula(prop);
      if (f === null) return dash();
      return <span className="text-muted-foreground italic tabular-nums">{typeof f === "number" ? f.toLocaleString("ro-RO") : f}</span>;
    }
    default: return dash();
  }
}

function renderEditable(
  name: string,
  type: string,
  value: unknown,
  onChange: (name: string, value: unknown) => void,
  options?: string[]
): React.ReactNode {
  switch (type) {
    case "title":
    case "phone_number":
    case "email":
      return (
        <Input
          value={(value as string) || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className="h-7 text-[13px]"
        />
      );
    case "rich_text":
      return (
        <Textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className="text-[13px] min-h-[50px]"
          rows={2}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(name, e.target.value === "" ? null : Number(e.target.value))}
          className="h-7 text-[13px] tabular-nums"
        />
      );
    case "date":
      return (
        <Input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className="h-7 text-[13px]"
        />
      );
    case "select":
      return (
        <Select value={(value as string) || ""} onValueChange={(v) => onChange(name, v)}>
          <SelectTrigger className="h-7 text-[13px] w-full overflow-hidden">
            <span className="truncate block">{(value as string) || "Selectează..."}</span>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-[100]" sideOffset={4}>
            {(options || []).map((opt) => (
              <SelectItem key={opt} value={opt} className="text-[13px] max-w-[350px]">
                <span className="line-clamp-2">{opt}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "checkbox":
      return (
        <Checkbox
          checked={value as boolean}
          onCheckedChange={(checked) => onChange(name, checked)}
        />
      );
    case "multi_select":
      return (
        <Input
          value={(value as string[])?.join(", ") || ""}
          onChange={(e) => onChange(name, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          placeholder="Valori separate prin virgulă"
          className="h-7 text-[13px]"
        />
      );
    default:
      return <span className="text-muted-foreground/50">—</span>;
  }
}

function dash() {
  return <span className="text-muted-foreground/50">—</span>;
}
