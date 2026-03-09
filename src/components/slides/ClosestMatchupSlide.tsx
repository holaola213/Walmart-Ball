"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function ClosestMatchupSlide({ data, direction }: SlideProps) {
  const closest = data.closestMatchup;

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.closest}
      direction={direction}
      pattern="contour"
    >
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
        className="w-full max-w-[38rem] px-4"
      >
        <p className="type-meta text-white/30 text-center mb-7">
          Week {closest.week}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-6 md:gap-10">
          <div className="text-center min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.winnerId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.winnerId])}
                alt=""
                className="w-[4.25rem] h-[4.25rem] rounded-full object-cover bg-white/10 mb-3 border-2"
                style={{ borderColor: "rgba(86, 199, 193, 0.32)", boxShadow: "0 0 15px rgba(86, 199, 193, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-[1.1rem] leading-[1.15] min-h-[2.7rem] flex items-center justify-center copy-pretty text-center">
              {closest.winnerName}
            </p>
            <p
              className="mt-3 font-stat font-bold text-[#56C7C1] text-[clamp(1.9rem,4.2vw,2.8rem)] tracking-[-0.045em]"
              style={{ textShadow: "0 0 20px rgba(86, 199, 193, 0.2)" }}
            >
              {closest.winnerScore.toFixed(1)}
            </p>
          </div>

          <div className="text-white/15 type-meta shrink-0 pt-[5.2rem] md:pt-[5.5rem]">VS</div>

          <div className="text-center min-w-0 flex flex-col items-center">
            {data.teamLogoMap[closest.loserId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[closest.loserId])}
                alt=""
                className="w-[4.25rem] h-[4.25rem] rounded-full object-cover bg-white/10 mb-3 border-2"
                style={{ borderColor: "rgba(86, 199, 193, 0.32)", boxShadow: "0 0 15px rgba(86, 199, 193, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white/72 font-semibold text-[1.1rem] leading-[1.15] min-h-[2.7rem] flex items-center justify-center copy-pretty text-center">
              {closest.loserName}
            </p>
            <p className="mt-3 font-stat font-bold text-white/58 text-[clamp(1.9rem,4.2vw,2.8rem)] tracking-[-0.045em]">
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
