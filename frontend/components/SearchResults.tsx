import { AnimatePresence, motion } from "framer-motion";
import { SearchResult } from "@/types/search";

export function SearchResults({ results }: { results: SearchResult[] }) {
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
        {results.map((r, idx) => (
          <motion.a
            key={`${r.link}-${idx}`}
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded border hover:bg-gray-50"
          >
            <div className="font-semibold">{r.title || r.link}</div>
            {r.snippet ? (
              <div className="text-sm text-gray-600 mt-1">{r.snippet}</div>
            ) : null}
          </motion.a>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
