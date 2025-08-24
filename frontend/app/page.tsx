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

  const handleSearch = (query: string) => {
    if (!query) return;
    setIsSearching(true);
    setStep(0);
    setResults([]);

    // Simulación de proceso de búsqueda
    let steps = 0;
    const interval = setInterval(() => {
      setStep((s) => s + 1);
      steps++;
      if (steps > 2) {
        clearInterval(interval);
        // Simular resultados
        setResults([
          {
            id: "1",
            name: `Producto relacionado con "${query}"`,
            description: "Descripción breve del producto",
            price: 129.99,
            imageUrl: "https://placehold.co/96",
          },
          {
            id: "2",
            name: "Otro producto interesante",
            description: "Otra descripción breve",
            price: 89.5,
            imageUrl: "https://placehold.co/96",
          },
        ]);
      }
    }, 1000);
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
      {isSearching && results.length == 0 && <ActivityIndicator step={step} />}
      {results.length > 0 && <SearchResults results={results} />}
    </main>
  );
}
