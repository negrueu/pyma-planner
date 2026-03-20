"use server";

import { updateEvent, getLastEditedTime } from "@/lib/notion";
import { logAudit } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type UpdateResult = {
  success: boolean;
  error?: string;
};

export async function updateEventFields(
  pageId: string,
  lastEditedTime: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any>
): Promise<UpdateResult> {
  try {
    // Conflict detection
    const currentTime = await getLastEditedTime(pageId);
    if (currentTime !== lastEditedTime) {
      return {
        success: false,
        error: "Altcineva a modificat acest eveniment. Reîncarcă pagina.",
      };
    }

    // Build Notion properties from form fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {};

    for (const [key, val] of Object.entries(fields)) {
      if (val === undefined) continue;
      const field = val as { type: string; value: unknown };

      switch (field.type) {
        case "title":
          properties[key] = {
            title: [{ text: { content: field.value as string } }],
          };
          break;
        case "rich_text":
          properties[key] = {
            rich_text: [{ text: { content: field.value as string } }],
          };
          break;
        case "number":
          properties[key] = {
            number: field.value === "" || field.value === null ? null : Number(field.value),
          };
          break;
        case "select":
          properties[key] = {
            select: field.value ? { name: field.value as string } : null,
          };
          break;
        case "multi_select":
          properties[key] = {
            multi_select: (field.value as string[]).map((name) => ({ name })),
          };
          break;
        case "date":
          properties[key] = {
            date: field.value ? { start: field.value as string } : null,
          };
          break;
        case "phone_number":
          properties[key] = { phone_number: (field.value as string) || null };
          break;
        case "email":
          properties[key] = { email: (field.value as string) || null };
          break;
        case "checkbox":
          properties[key] = { checkbox: Boolean(field.value) };
          break;
      }
    }

    if (Object.keys(properties).length === 0) {
      return { success: true };
    }

    await updateEvent(pageId, properties);

    // Audit log
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      logAudit({
        user_email: session.user.email,
        user_name: session.user.name || "",
        action: "edit_event",
        event_id: pageId,
        details: { changed_fields: Object.keys(fields) },
      });
    }

    revalidatePath(`/event/${pageId}`);
    revalidatePath("/");
    revalidatePath("/search");

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Eroare necunoscută";
    return { success: false, error: msg };
  }
}
