"use client";
import { motion } from "framer-motion";

const steps = ["Buscando...", "Analizando...", "Filtrando..."];

export function ActivityIndicator({ step }: { step: number }) {
  return (
    <motion.div
      className="text-center text-gray-600 mt-4"
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {steps[step]}
    </motion.div>
  );
}
