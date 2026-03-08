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
        className="type-kicker text-[#5ECF9B]/75 mb-8"
      >
        Your Highs &amp; Lows
      </motion.p>

      <div className="flex flex-col gap-4 max-w-xs w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5 text-center"
          style={{ boxShadow: "0 0 20px rgba(94, 207, 155, 0.12)", borderColor: "rgba(94, 207, 155, 0.2)" }}
        >
          <p className="type-meta text-[#5ECF9B]/80 mb-2">
            Best Week (Week {team.bestWeek.week})
          </p>
          <p className="type-number-lg font-bold text-[#5ECF9B]" style={{ textShadow: "0 0 20px rgba(94, 207, 155, 0.3)" }}>
            <StatNumber value={team.bestWeek.score} decimals={1} />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-5 text-center"
          style={{ boxShadow: "0 0 20px rgba(242, 139, 130, 0.12)", borderColor: "rgba(242, 139, 130, 0.2)" }}
        >
          <p className="type-meta text-[#F28B82]/80 mb-2">
            Worst Week (Week {team.worstWeek.week})
          </p>
          <p className="type-number-lg font-bold text-[#F28B82]" style={{ textShadow: "0 0 20px rgba(242, 139, 130, 0.3)" }}>
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
