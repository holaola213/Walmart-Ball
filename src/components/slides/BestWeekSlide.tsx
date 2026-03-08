"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

export function BestWeekSlide({ data, direction }: SlideProps) {
  const best = data.bestWeek;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.bestWeek} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#5ECF9B]/75 mb-6"
      >
        Best Week
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <div className="type-number-xl font-bold text-[#5ECF9B] mb-4" style={{ textShadow: "0 0 40px rgba(94, 207, 155, 0.3)" }}>
          <StatNumber value={best.score} decimals={1} duration={2000} />
        </div>
        <p className="font-stat text-[12px] md:text-[13px] text-white/55 tracking-[0.14em] uppercase mb-8">
          Points in a single week
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center flex flex-col items-center"
      >
        {data.teamLogoMap[best.teamId] && (
          <img
            src={getTeamLogoUrl(data.teamLogoMap[best.teamId])}
            alt=""
            className="w-12 h-12 rounded-full object-cover bg-white/10 mb-3"
            style={{ boxShadow: "0 0 20px rgba(94, 207, 155, 0.2)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <h3 className="type-title-md text-white title-balance measure-tight">{best.teamName}</h3>
        <p className="type-meta text-white/50 mt-2">Week {best.week}</p>
      </motion.div>

      {data.bestWeekRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.bestWeek}
          delay={1.0}
          items={data.bestWeekRunnersUp.map((w) => ({
            label: w.teamName,
            sublabel: `Week ${w.week}`,
            value: `${w.score.toFixed(1)} pts`,
            avatarUrl: data.teamLogoMap[w.teamId] ? getTeamLogoUrl(data.teamLogoMap[w.teamId]) : undefined,
          }))}
        />
      )}
    </SlideLayout>
  );
}
