"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command, CommandInput } from "@/components/ui/command";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const navigate = useCallback(
    (value: string) => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.push(`/search?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    if (query === defaultValue) return;
    const timer = setTimeout(() => {
      navigate(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, defaultValue, navigate]);

  return (
    <Command className="border border-border rounded-md bg-card" shouldFilter={false}>
      <CommandInput
        placeholder="Caută după nume sau telefon..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            navigate(query);
          }
        }}
      />
    </Command>
  );
}
