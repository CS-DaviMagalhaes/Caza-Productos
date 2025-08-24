import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { AnimatePresence, motion } from "framer-motion";

export function SearchResults({ results }: { results: Product[] }) {
  if (results.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No se encontraron resultados
      </p>
    );
  }

  return (
    <motion.div className="flex flex-col gap-4 mt-6">
      <AnimatePresence mode="wait">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
