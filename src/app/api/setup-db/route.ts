import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// One-time setup endpoint — creates audit_logs table
// Call once: POST /api/setup-db?secret=pyma-setup-2026
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== "pyma-setup-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        user_email TEXT NOT NULL,
        user_name TEXT NOT NULL DEFAULT '',
        action TEXT NOT NULL,
        event_id TEXT,
        event_name TEXT,
        details JSONB,
        ip_address TEXT,
        user_agent TEXT,
        session_id TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_email);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_id);
    `,
  });

  if (error) {
    // RPC might not exist — try direct insert to check if table exists
    const { error: checkError } = await supabase
      .from("audit_logs")
      .select("id")
      .limit(1);

    if (checkError?.code === "42P01") {
      // Table doesn't exist — need to create via Supabase Studio SQL editor
      return NextResponse.json({
        error: "Table doesn't exist. Create it via Supabase Studio SQL editor.",
        sql: `
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  event_id TEXT,
  event_name TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_email);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_event ON audit_logs(event_id);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access" ON audit_logs
  FOR ALL USING (true) WITH CHECK (true);
        `,
      });
    }

    // Table exists
    return NextResponse.json({ status: "Table already exists", ok: true });
  }

  return NextResponse.json({ status: "Table created", ok: true });
}
