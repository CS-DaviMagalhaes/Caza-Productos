"use client";
import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ActivityIndicator } from "@/components/ActivityIndicator";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/Title";
import { SearchResults } from "@/components/SearchResults";
import { SearchHistory } from "@/components/SearchHistory";
import { FavoritesPanel } from "@/components/FavoritePanels";
import { SectionsPanel } from "@/components/SectionsPanels";
import { SortControls } from "@/components/SortControls";
import { useLocalStorage } from "@/components/useLocalStorage";

type Section = {
  id: string;
  name: string;
  products: Product[];
};

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [history, setHistory] = useLocalStorage<string[]>("searchHistory", []);
  const [favorites, setFavorites] = useLocalStorage<Product[]>("favorites", []);
  const [sections, setSections] = useLocalStorage<Section[]>("sections", []);
  const [showFav, setShowFav] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  // Dark mode body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = (query: string) => {
    if (!query) return;
    setIsSearching(true);
    setStep(0);
    setResults([]);
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query.trim());
      return [query.trim(), ...filtered].slice(0, 8);
    });
    let steps = 0;
    const interval = setInterval(() => {
      setStep((s) => s + 1);
      steps++;
      if (steps > 2) {
        clearInterval(interval);
        setResults([
          {
            id: "1",
            name: `Producto relacionado con "${query}"`,
            description: "Descripción breve del producto",
            price: 129.99,
            imageUrl: "https://via.placeholder.com/150",
            onfavorite: false,
          },
          {
            id: "2",
            name: "Otro producto interesante",
            description: "Otra descripción breve",
            price: 89.5,
            imageUrl: "https://via.placeholder.com/150",
            onfavorite: false,
          },
        ]);
        setIsSearching(false);
      }
    }, 1000);
  };

  const addFavorite = (product: Product) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFavorite = (product: Product) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        products: s.products.filter((p) => p.id !== product.id),
      }))
    );
  };

  const clearHistory = () => setHistory([]);
  
  const removeHistoryItem = (item: string) => {
    setHistory((prev) => prev.filter((h) => h !== item));
  };

  const onDragStart = (product: Product) => setDraggedProduct(product);
  
  const onDropProduct = (sectionId: string) => {
    if (!draggedProduct) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId && !s.products.some((p) => p.id === draggedProduct.id)
          ? { ...s, products: [...s.products, draggedProduct] }
          : s
      )
    );
    setDraggedProduct(null);
  };

  const closePanels = () => {
    setShowFav(false);
    setShowSections(false);
  };

  const filteredResults = (() => {
    if (sortOrder === "asc") {
      return [...results].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === "desc") {
      return [...results].sort((a, b) => b.price - a.price);
    }
    return results;
  })();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-zinc-900 dark:to-zinc-800 transition-colors">
      {/* Overlay para cerrar paneles */}
      {(showFav || showSections) && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={closePanels}
          aria-label="Close panels"
        />
      )}

      {/* Panels */}
      <SectionsPanel
        showSections={showSections}
        setShowSections={setShowSections}
        sections={sections}
        setSections={setSections}
        onDropProduct={onDropProduct}
      />

      <FavoritesPanel
        showFav={showFav}
        setShowFav={setShowFav}
        favorites={favorites}
        onDragStart={onDragStart}
        removeFavorite={removeFavorite}
      />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 z-10">
        <Button
          variant="outline"
          className="absolute top-8 left-1/2 -translate-x-1/2"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "🌙 Light mode" : "🌞 Dark mode"}
        </Button>

        <Title isSearching={isSearching} />
        <SearchBar onSearch={handleSearch} />

        <SearchHistory
          history={history}
          onSearch={handleSearch}
          onClearHistory={clearHistory}
          onRemoveHistoryItem={removeHistoryItem}
          setResults={setResults}
          setIsSearching={setIsSearching}
          setStep={setStep}
        />

        {isSearching && results.length === 0 && <ActivityIndicator step={step} />}

        {results.length > 0 && (
          <SortControls
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        )}

        {results.length > 0 && (
          <SearchResults
            results={filteredResults}
            onFavorite={addFavorite}
            favorites={favorites}
          />
        )}
      </div>
    </main>
  );
}