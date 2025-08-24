import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { AnimatePresence, motion } from "framer-motion";

export function SearchResults({ results }: { results: Product[] }) {
  return (
    <motion.div className="flex flex-col gap-4 mt-6 w-full">
      <AnimatePresence mode="wait">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
