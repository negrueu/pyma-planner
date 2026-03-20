import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Audit Log Types ---
export type AuditAction =
  | "login"
  | "logout"
  | "view_event"
  | "edit_event"
  | "create_event"
  | "search"
  | "view_calendar"
  | "view_pipeline"
  | "view_dashboard";

export type AuditLog = {
  id?: number;
  timestamp?: string;
  user_email: string;
  user_name: string;
  action: AuditAction;
  event_id?: string | null;
  event_name?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  session_id?: string | null;
};

// --- Log an action ---
export async function logAudit(log: Omit<AuditLog, "id" | "timestamp">) {
  try {
    await supabase.from("audit_logs").insert({
      ...log,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    // Don't throw — logging should never break the app
    console.error("Audit log error:", e);
  }
}

// --- Query logs ---
export async function getAuditLogs(params: {
  user_email?: string;
  action?: AuditAction;
  event_id?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("timestamp", { ascending: false });

  if (params.user_email) query = query.eq("user_email", params.user_email);
  if (params.action) query = query.eq("action", params.action);
  if (params.event_id) query = query.eq("event_id", params.event_id);
  if (params.from) query = query.gte("timestamp", params.from);
  if (params.to) query = query.lte("timestamp", params.to);
  if (params.limit) query = query.limit(params.limit);
  if (params.offset) query = query.range(params.offset, params.offset + (params.limit || 50) - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { logs: data as AuditLog[], total: count || 0 };
}
