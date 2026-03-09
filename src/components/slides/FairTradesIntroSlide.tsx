"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function FairTradesIntroSlide({ direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.trades} direction={direction} pattern="beams" mood="hero">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-5"
        style={{ color: `${SLIDE_COLORS.trades}C4` }}
      >
        Trade Block
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="type-title-xl text-white text-center title-balance measure-wide"
      >
        Most Ethical Trades
      </motion.h2>
    </SlideLayout>
  );
}
