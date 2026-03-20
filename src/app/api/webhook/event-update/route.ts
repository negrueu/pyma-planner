import { NextRequest, NextResponse } from "next/server";

// Webhook endpoint for n8n to trigger on event create/update
// n8n can call this to sync with Google Calendar or other services
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.WEBHOOK_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // body: { eventId, action: "created" | "updated", fields: { ... } }
  return NextResponse.json({
    received: true,
    eventId: body.eventId,
    action: body.action,
    timestamp: new Date().toISOString(),
  });
}
