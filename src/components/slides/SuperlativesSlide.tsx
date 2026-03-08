"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { formatNumbersInText } from "@/lib/utils";

export function SuperlativesSlide({ data, direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.superlatives} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-8"
        style={{ color: `${SLIDE_COLORS.superlatives}C4` }}
      >
        Superlatives
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {data.superlatives.map((award, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors"
          >
            <p className="type-meta text-[#B69CFF] font-semibold">
              {award.title}
            </p>
            <p className="text-white font-semibold text-[15px] mt-1.5 leading-[1.2] copy-pretty">
              {award.teamName}
            </p>
            <p className="text-white/76 text-[13px] leading-[1.35] mt-1 copy-pretty">{formatNumbersInText(award.detail)}</p>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
