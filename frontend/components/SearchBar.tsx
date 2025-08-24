"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex gap-2 w-full max-w-lg mx-auto">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe el producto..."
      />
      <Button onClick={() => onSearch(query)}>Buscar</Button>
    </div>
  );
}
