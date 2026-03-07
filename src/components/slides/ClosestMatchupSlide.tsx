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
        className="font-stat text-teal-400/50 text-xs uppercase tracking-[0.5em] mb-8"
      >
        Closest Matchup
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
        style={{ boxShadow: "0 0 30px rgba(20, 184, 166, 0.08)" }}
      >
        <p className="text-white/25 text-[10px] font-stat text-center mb-4 tracking-widest">
          WEEK {closest.week}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.winnerId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.winnerId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2 border-teal-400/30"
                style={{ boxShadow: "0 0 15px rgba(20, 184, 166, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-xs leading-tight  min-h-[2.5rem] flex items-center justify-center">
              {closest.winnerName}
            </p>
            <p className="font-stat text-3xl font-bold text-teal-400 mt-1" style={{ textShadow: "0 0 20px rgba(20, 184, 166, 0.2)" }}>
              {closest.winnerScore.toFixed(1)}
            </p>
          </div>

          <div className="text-white/15 text-xs font-display text-2xl shrink-0">VS</div>

          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.loserId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.loserId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2 border-teal-400/30"
                style={{ boxShadow: "0 0 15px rgba(20, 184, 166, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white/50 font-semibold text-xs leading-tight  min-h-[2.5rem] flex items-center justify-center">
              {closest.loserName}
            </p>
            <p className="font-stat text-3xl font-bold text-white/50 mt-1">
              {closest.loserScore.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 font-stat text-teal-400 text-lg font-semibold tracking-wider"
        style={{ textShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
      >
        Only {closest.margin.toFixed(1)} points apart
      </motion.p>
    </SlideLayout>
  );
}
