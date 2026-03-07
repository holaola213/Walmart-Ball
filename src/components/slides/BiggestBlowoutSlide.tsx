"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function BiggestBlowoutSlide({ data, direction }: SlideProps) {
  const blowout = data.biggestBlowout;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.blowout} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-blue-400/50 text-xs uppercase tracking-[0.5em] mb-8"
      >
        Biggest Blowout
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
        style={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.08)" }}
      >
        <p className="text-white/25 text-[10px] font-stat text-center mb-4 tracking-widest">
          WEEK {blowout.week}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[blowout.winnerId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[blowout.winnerId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2 border-blue-400/30"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-xs leading-tight  min-h-[2.5rem] flex items-center justify-center">
              {blowout.winnerName}
            </p>
            <p className="font-stat text-3xl font-bold text-green-400 mt-1" style={{ textShadow: "0 0 20px rgba(34, 197, 94, 0.2)" }}>
              {blowout.winnerScore.toFixed(1)}
            </p>
          </div>

          <div className="text-white/15 text-xs font-display text-2xl shrink-0">VS</div>

          <div className="text-center flex-1 min-w-0 flex flex-col items-center">
            {data.teamLogoMap[blowout.loserId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[blowout.loserId])}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-white/10 mb-2 border-2 border-blue-400/30"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white/50 font-semibold text-xs leading-tight  min-h-[2.5rem] flex items-center justify-center">
              {blowout.loserName}
            </p>
            <p className="font-stat text-3xl font-bold text-red-400 mt-1" style={{ textShadow: "0 0 20px rgba(239, 68, 68, 0.2)" }}>
              {blowout.loserScore.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 font-stat text-blue-400 text-xl font-bold tracking-wider"
        style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
      >
        +{blowout.margin.toFixed(1)} MARGIN
      </motion.p>
    </SlideLayout>
  );
}
