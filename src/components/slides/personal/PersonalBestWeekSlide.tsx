"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { TeamWrappedData } from "@/lib/types";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

export function PersonalBestWeekSlide({ team, direction }: Props) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.personalBest} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-green-400/50 text-xs uppercase tracking-[0.5em] mb-8"
      >
        Your Highs &amp; Lows
      </motion.p>

      <div className="flex flex-col gap-4 max-w-xs w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5 text-center"
          style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.15)" }}
        >
          <p className="font-stat text-green-400/60 text-[10px] uppercase tracking-[0.3em] mb-2">
            Best Week (Week {team.bestWeek.week})
          </p>
          <p className="font-stat text-4xl font-bold text-green-400" style={{ textShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}>
            <StatNumber value={team.bestWeek.score} decimals={1} />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-5 text-center"
          style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.15)" }}
        >
          <p className="font-stat text-red-400/60 text-[10px] uppercase tracking-[0.3em] mb-2">
            Worst Week (Week {team.worstWeek.week})
          </p>
          <p className="font-stat text-4xl font-bold text-red-400" style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.3)" }}>
            <StatNumber
              value={team.worstWeek.score}
              decimals={1}
              delay={600}
            />
          </p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
