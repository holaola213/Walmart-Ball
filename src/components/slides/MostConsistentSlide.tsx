"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";
import { formatNumber } from "@/lib/utils";

export function MostConsistentSlide({ data, direction }: SlideProps) {
  const team = data.mostConsistent;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.consistent} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-6"
        style={{ color: `${SLIDE_COLORS.consistent}C0` }}
      >
        Most Consistent
      </motion.p>

      {data.teamLogoMap[team.teamId] && (
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
          src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
          alt=""
          className="w-16 h-16 rounded-full object-cover bg-white/10 mb-4"
          style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="type-title-md text-white text-center mb-8 title-balance measure-medium"
        style={{ textShadow: "0 0 30px rgba(99, 102, 241, 0.2)" }}
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
          <p className="type-number-lg font-bold text-indigo-400">
            {formatNumber(team.averageScore, 1)}
          </p>
          <p className="type-meta text-white/66 mt-1">Avg pts/wk</p>
        </div>
        <div className="glass rounded-xl px-6 py-4">
          <p className="type-number-lg font-bold text-indigo-400">
            {formatNumber(team.standardDeviation, 1)}
          </p>
          <p className="type-meta text-white/66 mt-1">Std dev</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-white/76 text-[15px] leading-[1.45] text-center measure-medium copy-pretty italic"
      >
        Steady and reliable every week. You always knew what you were getting.
      </motion.p>

      {data.mostConsistentRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.consistent}
          delay={1.1}
          items={data.mostConsistentRunnersUp.map((t) => ({
            label: t.teamName,
            value: `${formatNumber(t.averageScore, 1)} avg / ${formatNumber(t.standardDeviation, 1)} SD`,
            avatarUrl: data.teamLogoMap[t.teamId] ? getTeamLogoUrl(data.teamLogoMap[t.teamId]) : undefined,
          }))}
        />
      )}
    </SlideLayout>
  );
}
