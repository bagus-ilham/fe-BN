"use client";

import { motion } from "framer-motion";

interface TemplateProps {
  children: React.ReactNode;
}

/**
 * Template with 'Cinematic Reveal' transition for pages
 * 
 * High-quality cinematic effect:
 * - Initial blur hides hard cut
 * - 0.8s duration creates sense of calm and luxury
 * - Bézier curve [0.25, 1, 0.5, 1] decelerates very smoothly
 * - Eliminates 'hard cut' and 'flicker' during navigation
 */
export default function Template({ children }: TemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1], // Bézier curve that decelerates very smoothly at the end
      }}
    >
      {children}
    </motion.div>
  );
}
