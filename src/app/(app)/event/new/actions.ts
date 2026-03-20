"use server";

import { createEvent } from "@/lib/notion";
import { revalidatePath } from "next/cache";

type NewEventForm = {
  name: string;
  phone: string;
  date: string;
  salon: string;
  eventType: string;
  minPersons: string;
  estPersons: string;
  consultant: string;
  planner: string;
};

export async function createNewEvent(
  form: NewEventForm
): Promise<{ success: boolean; pageId?: string; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {
      "Nume 1": { title: [{ text: { content: form.name } }] },
      "Fază": { select: { name: "Cerere nouă" } },
    };

    if (form.phone) {
      properties["telefon"] = { phone_number: form.phone };
    }
    if (form.date) {
      properties["Data evenimentului"] = { date: { start: form.date } };
    }
    if (form.salon) {
      properties["Salonul"] = { select: { name: form.salon } };
    }
    if (form.eventType) {
      properties["Eveniment"] = { select: { name: form.eventType } };
    }
    if (form.minPersons) {
      properties["nrMinPers"] = { number: Number(form.minPersons) };
    }
    if (form.estPersons) {
      properties["nrEstPers"] = { number: Number(form.estPersons) };
    }
    if (form.planner) {
      properties["Event planner"] = { select: { name: form.planner } };
    }

    const result = await createEvent(properties);

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/pipeline");
    revalidatePath("/calendar");

    return { success: true, pageId: result.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Eroare necunoscută";
    return { success: false, error: msg };
  }
}
