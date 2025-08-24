"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    onSearch(query);
  };
  return (
    <motion.form onSubmit={handleSubmit} layout className="flex gap-2 w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe el producto..."
        autoFocus
      />
      <Button type="submit">Buscar</Button>
    </motion.form>
  );
}
