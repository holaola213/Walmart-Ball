"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS } from "@/lib/constants";
import { TeamWrappedData } from "@/lib/types";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

export function PersonalRivalsSlide({ team, direction }: Props) {
  const sortedRivals = [...team.rivals].sort(
    (a, b) => b.wins + b.losses + b.ties - (a.wins + a.losses + a.ties)
  );

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.personalRivals}
      direction={direction}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-blue-400/50 text-xs uppercase tracking-[0.5em] mb-8"
      >
        Head-to-Head Record
      </motion.p>

      <div className="w-full max-w-md space-y-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {sortedRivals.map((rival, i) => {
          const total = rival.wins + rival.losses + rival.ties;
          const winPct = total > 0 ? rival.wins / total : 0;

          return (
            <motion.div
              key={rival.opponentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 glass rounded-lg px-4 py-2.5 hover:bg-white/[0.08] transition-colors"
            >
              <span className="flex-1 text-white text-sm min-w-0 break-words leading-tight">
                {rival.opponentName}
              </span>
              <span
                className="font-stat font-bold text-sm tracking-wider"
                style={{
                  color:
                    winPct > 0.5
                      ? "#22C55E"
                      : winPct < 0.5
                      ? "#EF4444"
                      : "#F59E0B",
                }}
              >
                {rival.wins}-{rival.losses}
                {rival.ties > 0 ? `-${rival.ties}` : ""}
              </span>
            </motion.div>
          );
        })}
      </div>
    </SlideLayout>
  );
}
