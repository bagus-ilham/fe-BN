"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: string | ReactNode;
}

interface ProductAccordionProps {
  items: AccordionItem[];
}

export default function ProductAccordion({ items }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-8 border-t border-brand-softblack/10">
      {items.map((item, index) => (
        <div key={index} className="border-b border-brand-softblack/10 group">
          {/* Accordion Header */}
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center py-5 text-left min-h-[56px] transition-all hover:bg-brand-softblack/[0.02]"
            aria-expanded={openIndex === index}
            aria-controls={`accordion-content-${index}`}
            aria-label={`${item.title}, ${openIndex === index ? "tutup" : "buka"}`}
          >
            <h3 className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${openIndex === index ? "text-brand-green" : "text-brand-softblack"}`}>
              {item.title}
            </h3>
            <div className="flex-shrink-0 ml-4 relative w-5 h-5 flex items-center justify-center">
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0, opacity: openIndex === index ? 0 : 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-brand-softblack/50 group-hover:text-brand-softblack transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ rotate: openIndex === index ? 0 : -180, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </motion.div>
            </div>
          </button>

          {/* Accordion Content */}
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                id={`accordion-content-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pb-6 text-sm font-light text-brand-softblack/70 leading-relaxed pr-8">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
