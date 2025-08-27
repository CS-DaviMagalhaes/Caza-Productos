"use client";
import { useState } from "react";
import { Title } from "@/components/Title";
import { SearchBar } from "@/components/SearchBar";
import { ActivityIndicator } from "@/components/ActivityIndicator";
import { SearchResults } from "@/components/SearchResults";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    setStep(0);
    setResults([]);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, country: "pe", numResults: 8 }),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          msg = err?.detail || err?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al buscar";
      setError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main
      className={cn(
        "flex flex-col items-center min-h-screen p-6 container mx-auto max-w-4xl min-w-xs",
        results.length || isSearching ? "justify-start" : "justify-center"
      )}
    >
      <Title />
      <SearchBar onSearch={handleSearch} />
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {isSearching && results.length === 0 && !error && (
        <ActivityIndicator step={step} />
      )}
      {results.length > 0 && <SearchResults results={results} />}
    </main>
  );
}
