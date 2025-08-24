"use client";
import { cn } from "@/lib/utils";
import { delay, motion, type HTMLMotionProps } from "framer-motion";

const steps = ["Buscando...", "Analizando...", "Filtrando..."];

export function ActivityIndicator({
  step,
  className,
}: { step: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      layout
      className={cn("text-center text-gray-600 mt-4", className)}
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        delay: 0.4,
      }}
    >
      {steps[step]}
    </motion.div>
  );
}
