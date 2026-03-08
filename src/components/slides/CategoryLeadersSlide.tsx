"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function CategoryLeadersSlide({ data, direction }: SlideProps) {
  const leaders = data.categoryLeaders;
  if (!leaders) return null;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.categories} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#B69CFF]/75 mb-8"
      >
        Category Leaders
      </motion.p>

      <div className="w-full max-w-lg space-y-2">
        {leaders.map((leader, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center justify-between glass rounded-lg px-4 py-3 hover:bg-white/[0.08] transition-colors"
          >
            <div>
              <p className="text-white font-medium text-sm">
                {leader.teamName}
              </p>
              <p className="type-meta text-white/35 mt-0.5">{leader.category}</p>
            </div>
            <p className="font-stat text-[#B69CFF] font-bold text-[22px] leading-none">
              {leader.value.toFixed(0)}
            </p>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
