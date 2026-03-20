"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createNewEvent } from "./actions";

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    salon: "",
    eventType: "",
    minPersons: "",
    estPersons: "",
    consultant: "",
    planner: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.date || !form.salon) {
      toast.error("Completează cel puțin: Nume, Data, Salon.");
      return;
    }

    setSaving(true);
    const result = await createNewEvent(form);
    setSaving(false);

    if (result.success && result.pageId) {
      toast.success("Eveniment creat!");
      router.push(`/event/${result.pageId}`);
    } else {
      toast.error(result.error || "Eroare la creare.");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Eveniment nou</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nume *</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nume miri / client" required />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="40740..." />
          </div>
          <div className="space-y-2">
            <Label>Data evenimentului *</Label>
            <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Salon *</Label>
            <Select value={form.salon} onValueChange={(v) => v && update("salon", v)}>
              <SelectTrigger><SelectValue placeholder="Selectează..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BallRoom">BallRoom</SelectItem>
                <SelectItem value="Imperial">Imperial</SelectItem>
                <SelectItem value="Glamour">Glamour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tip eveniment</Label>
            <Select value={form.eventType} onValueChange={(v) => v && update("eventType", v)}>
              <SelectTrigger><SelectValue placeholder="Selectează..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NUNTA">Nuntă</SelectItem>
                <SelectItem value="Botez">Botez</SelectItem>
                <SelectItem value="Aniversare">Aniversare</SelectItem>
                <SelectItem value="Majorat">Majorat</SelectItem>
                <SelectItem value="Banchet">Banchet</SelectItem>
                <SelectItem value="Cumătrie">Cumătrie</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                <SelectItem value="Prânz">Prânz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nr. minim persoane</Label>
            <Input type="number" value={form.minPersons} onChange={(e) => update("minPersons", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nr. estimat persoane</Label>
            <Input type="number" value={form.estPersons} onChange={(e) => update("estPersons", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Event planner</Label>
            <Select value={form.planner} onValueChange={(v) => v && update("planner", v)}>
              <SelectTrigger><SelectValue placeholder="Selectează..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Paul Padurariu">Paul Pădurariu</SelectItem>
                <SelectItem value="Madalina Raluca Dianu">Mădălina Dianu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Se creează..." : "Creează eveniment"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Anulează
          </Button>
        </div>
      </form>
    </div>
  );
}
