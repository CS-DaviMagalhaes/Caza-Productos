"use client";
import { motion } from "framer-motion";

export function Title({ isSearching }: { isSearching: boolean }) {
  return (
    <motion.h1
      className="text-4xl font-bold text-center mb-6"
      initial={{ y: 0 }}
      animate={{ y: isSearching ? -100 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      ¿Qué quieres encontrar hoy?
    </motion.h1>
  );
}
