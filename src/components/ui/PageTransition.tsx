"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          willChange: "transform, opacity", 
          transform: "translate3d(0, 0, 0)", 
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
