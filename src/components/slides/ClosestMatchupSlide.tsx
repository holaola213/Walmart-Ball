"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function ClosestMatchupSlide({ data, direction }: SlideProps) {
  const closest = data.closestMatchup;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.closest} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#56C7C1]/75 mb-8"
      >
        Closest Matchup
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
        style={{ boxShadow: "0 0 30px rgba(86, 199, 193, 0.1)" }}
      >
        <p className="type-meta text-white/30 text-center mb-4">
          Week {closest.week}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.winnerId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.winnerId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2"
                style={{ borderColor: "rgba(86, 199, 193, 0.32)", boxShadow: "0 0 15px rgba(86, 199, 193, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-sm leading-[1.2] min-h-[2.5rem] flex items-center justify-center copy-pretty text-center">
              {closest.winnerName}
            </p>
            <p className="type-number-lg font-bold text-[#56C7C1] mt-1" style={{ textShadow: "0 0 20px rgba(86, 199, 193, 0.2)" }}>
              {closest.winnerScore.toFixed(1)}
            </p>
          </div>

          <div className="text-white/15 type-meta shrink-0">VS</div>

          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.loserId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.loserId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2"
                style={{ borderColor: "rgba(86, 199, 193, 0.32)", boxShadow: "0 0 15px rgba(86, 199, 193, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white/55 font-semibold text-sm leading-[1.2] min-h-[2.5rem] flex items-center justify-center copy-pretty text-center">
              {closest.loserName}
            </p>
            <p className="type-number-lg font-bold text-white/50 mt-1">
              {closest.loserScore.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 font-stat text-[#56C7C1] text-[clamp(1rem,2.4vw,1.35rem)] font-semibold tracking-[0.06em] text-center measure-medium"
        style={{ textShadow: "0 0 20px rgba(86, 199, 193, 0.3)" }}
      >
        Only {closest.margin.toFixed(1)} points apart
      </motion.p>
    </SlideLayout>
  );
}
