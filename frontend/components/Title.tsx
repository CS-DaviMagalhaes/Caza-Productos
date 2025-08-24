"use client";
import { motion } from "framer-motion";

export function Title() {
  return (
    <motion.h1 layout className="text-4xl font-bold text-center mb-6">
      ¿Qué quieres encontrar hoy?
    </motion.h1>
  );
}
