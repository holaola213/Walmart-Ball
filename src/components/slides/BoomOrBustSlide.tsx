"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

export function BoomOrBustSlide({ data, direction }: SlideProps) {
  const team = data.boomOrBust;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.boomBust} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-pink-400/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        Boom or Bust
      </motion.p>

      {data.teamLogoMap[team.teamId] && (
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
          src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
          alt=""
          className="w-16 h-16 rounded-full object-cover bg-white/10 mb-4"
          style={{ boxShadow: "0 0 20px rgba(236, 72, 153, 0.2)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-4xl md:text-5xl text-white text-center mb-8"
        style={{ textShadow: "0 0 30px rgba(236, 72, 153, 0.2)" }}
      >
        {team.teamName}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-6 text-center"
      >
        <div className="glass rounded-xl px-6 py-4">
          <p className="font-stat text-3xl font-bold text-pink-400">
            {team.averageScore.toFixed(1)}
          </p>
          <p className="text-white/25 text-[10px] font-stat mt-1 tracking-widest">AVG PTS/WK</p>
        </div>
        <div className="glass rounded-xl px-6 py-4">
          <p className="font-stat text-3xl font-bold text-pink-400">
            {team.standardDeviation.toFixed(1)}
          </p>
          <p className="text-white/25 text-[10px] font-stat mt-1 tracking-widest">STD DEV</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-white/30 text-sm text-center max-w-xs italic"
      >
        A wild ride every week. Either dominating or getting destroyed.
      </motion.p>

      {data.boomOrBustRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.boomBust}
          delay={1.1}
          items={data.boomOrBustRunnersUp.map((t) => ({
            label: t.teamName,
            value: `${t.averageScore.toFixed(1)} avg / ${t.standardDeviation.toFixed(1)} SD`,
            avatarUrl: data.teamLogoMap[t.teamId] ? getTeamLogoUrl(data.teamLogoMap[t.teamId]) : undefined,
          }))}
        />
      )}
    </SlideLayout>
  );
}
