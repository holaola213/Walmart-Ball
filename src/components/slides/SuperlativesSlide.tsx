"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function SuperlativesSlide({ data, direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.superlatives} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-pink-300/50 text-xs uppercase tracking-[0.5em] mb-8"
      >
        Superlatives
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
        {data.superlatives.map((award, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors"
          >
            <p className="font-stat text-pink-400 text-[10px] font-semibold uppercase tracking-[0.2em]">
              {award.title}
            </p>
            <p className="text-white font-semibold text-sm mt-1.5">
              {award.teamName}
            </p>
            <p className="text-white/25 text-xs mt-1">{award.detail}</p>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
