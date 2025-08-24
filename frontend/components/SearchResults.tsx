import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function SearchResults({ results }: { results: Product[] }) {
  return (
    <motion.div className="flex flex-col gap-4 mt-6 w-full">
      <AnimatePresence mode="wait">
        {results.map((r) => (
          <ProductCard key={r.id} product={r}></ProductCard>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
