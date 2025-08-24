import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function SearchResults({ results }: { results: Product[] }) {
  if (results.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No se encontraron resultados
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {results.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
