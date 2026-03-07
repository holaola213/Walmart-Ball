"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

export function WorstWeekSlide({ data, direction }: SlideProps) {
  const worst = data.worstWeek;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.worstWeek} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-red-400/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        Worst Week
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <div className="font-stat text-7xl md:text-8xl font-bold text-red-400 mb-4" style={{ textShadow: "0 0 40px rgba(239, 68, 68, 0.3)" }}>
          <StatNumber value={worst.score} decimals={1} duration={2000} />
        </div>
        <p className="text-white/25 text-xs font-stat uppercase tracking-widest mb-8">points... yikes</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center flex flex-col items-center"
      >
        {data.teamLogoMap[worst.teamId] && (
          <img
            src={getTeamLogoUrl(data.teamLogoMap[worst.teamId])}
            alt=""
            className="w-12 h-12 rounded-full object-cover bg-white/10 mb-3"
            style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <h3 className="font-display text-3xl text-white">{worst.teamName}</h3>
        <p className="text-white/30 text-xs font-stat mt-2 tracking-wider">WEEK {worst.week}</p>
      </motion.div>

      {data.worstWeekRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.worstWeek}
          delay={1.0}
          items={data.worstWeekRunnersUp.map((w) => ({
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
