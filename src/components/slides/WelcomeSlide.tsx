"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { MOTION } from "@/lib/motion";

export function WelcomeSlide({ data, direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.welcome} direction={direction} mood="hero">
      <motion.div
        {...MOTION.intro}
        transition={{ ...MOTION.intro.transition, delay: 0.15 }}
        className="w-full max-w-5xl"
      >
        <p className="type-kicker mb-5 text-center md:text-left" style={{ color: `${SLIDE_COLORS.welcome}BE` }}>
          {data.seasonYear} Regular Season Recap
        </p>

        <div className="grid md:grid-cols-[1.8fr_1fr] gap-6 md:gap-10 items-end">
          <div className="text-center md:text-left">
            <motion.p
              {...MOTION.reveal}
              transition={{ ...MOTION.reveal.transition, delay: 0.3 }}
              className="type-title-xl text-white title-balance"
              style={{ textShadow: "0 0 38px rgba(139, 157, 255, 0.22)" }}
            >
              WRAPPED
            </motion.p>
            <motion.h1
              {...MOTION.reveal}
              transition={{ ...MOTION.reveal.transition, delay: 0.42 }}
              className="type-title-md text-white/90 mt-2 break-words title-balance measure-medium mx-auto md:mx-0"
            >
              {data.leagueName}
            </motion.h1>
          </div>

          <motion.div
            {...MOTION.hero}
            transition={{ ...MOTION.hero.transition, delay: 0.55 }}
            className="glass-strong rounded-2xl px-5 py-4 text-left"
          >
            <p className="type-meta text-white/68">Season Scope</p>
            <div className="mt-3 space-y-2">
              <p className="font-stat text-base md:text-lg text-white/85 leading-tight">
                {data.standings.length} teams
              </p>
              <p className="font-stat text-base md:text-lg text-white/85 leading-tight">
                {data.totalMatchupPeriods} weeks
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SlideLayout>
  );
}
