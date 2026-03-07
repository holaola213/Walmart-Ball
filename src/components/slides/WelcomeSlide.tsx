"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function WelcomeSlide({ data, direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.welcome} direction={direction}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-white/30 text-xs uppercase tracking-[0.5em] mb-6"
      >
        {data.seasonYear} Regular Season Recap
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl text-white text-center leading-[0.9]"
        style={{ textShadow: "0 0 60px rgba(139, 92, 246, 0.3)" }}
      >
        {data.leagueName}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="h-[1px] w-32 mt-6 mb-4"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="font-display text-violet-400 text-3xl md:text-4xl tracking-wider"
      >
        WRAPPED
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-white/20 text-xs font-stat tracking-widest"
      >
        {data.standings.length} TEAMS &middot; {data.totalMatchupPeriods} WEEKS
      </motion.p>
    </SlideLayout>
  );
}
