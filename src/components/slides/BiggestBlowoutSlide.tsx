"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function BiggestBlowoutSlide({ data, direction }: SlideProps) {
  const blowout = data.biggestBlowout;

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.blowout}
      direction={direction}
      pattern="contour"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-blue-400/55 mb-8"
      >
        Biggest Blowout
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-[38rem] px-4"
      >
        <p className="type-meta text-white/30 text-center mb-7">
          Week {blowout.week}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-6 md:gap-10">
          <div className="text-center min-w-0 flex flex-col items-center">
            {data.teamLogoMap[blowout.winnerId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[blowout.winnerId])}
                alt=""
                className="w-[4.25rem] h-[4.25rem] rounded-full object-cover bg-white/10 mb-3 border-2 border-blue-400/30"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-[1.1rem] leading-[1.15] min-h-[2.7rem] flex items-center justify-center copy-pretty text-center">
              {blowout.winnerName}
            </p>
            <p
              className="mt-3 font-stat font-bold text-[#5ECF9B] text-[clamp(1.9rem,4.2vw,2.8rem)] tracking-[-0.045em]"
              style={{ textShadow: "0 0 20px rgba(94, 207, 155, 0.2)" }}
            >
              {blowout.winnerScore.toFixed(1)}
            </p>
          </div>

          <div className="text-white/15 type-meta shrink-0 pt-[5.2rem] md:pt-[5.5rem]">VS</div>

          <div className="text-center min-w-0 flex flex-col items-center">
            {data.teamLogoMap[blowout.loserId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[blowout.loserId])}
                alt=""
                className="w-[4.25rem] h-[4.25rem] rounded-full object-cover bg-white/10 mb-3 border-2 border-blue-400/30"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white/72 font-semibold text-[1.1rem] leading-[1.15] min-h-[2.7rem] flex items-center justify-center copy-pretty text-center">
              {blowout.loserName}
            </p>
            <p
              className="mt-3 font-stat font-bold text-[#F28B82] text-[clamp(1.9rem,4.2vw,2.8rem)] tracking-[-0.045em]"
              style={{ textShadow: "0 0 20px rgba(242, 139, 130, 0.2)" }}
            >
              {blowout.loserScore.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 font-stat text-blue-400 text-[clamp(1.1rem,2.8vw,1.5rem)] font-bold tracking-[0.08em]"
        style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
      >
        +{blowout.margin.toFixed(1)} MARGIN
      </motion.p>
    </SlideLayout>
  );
}
