"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { TeamWrappedData } from "@/lib/types";
import { formatOrdinal } from "@/lib/utils";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

export function PersonalRecapSlide({ team, direction }: Props) {
  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.personalRecap}
      direction={direction}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#8B9DFF]/75 mb-4"
      >
        Your Season
      </motion.p>

      {team.logo && (
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-16 h-16 rounded-full object-cover bg-white/10 mb-4"
          style={{ boxShadow: "0 0 20px rgba(139, 157, 255, 0.2)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      <motion.h3
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="type-title-md text-white text-center mb-8 title-balance measure-medium"
        style={{ textShadow: "0 0 30px rgba(139, 157, 255, 0.2)" }}
      >
        {team.teamName}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-3 max-w-xs w-full"
      >
        <div className="glass rounded-xl p-4 text-center">
          <p className="type-number-lg font-bold text-white">
            {team.record.wins}-{team.record.losses}
          </p>
          <p className="type-meta text-white/30 mt-1">Record</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="type-title-md text-[#8B9DFF]">
            {formatOrdinal(team.rank)}
          </p>
          <p className="type-meta text-white/30 mt-1">Place</p>
        </div>
        <div className="glass rounded-xl p-4 text-center col-span-2">
          <p className="type-number-lg font-bold text-white">
            {team.pointsFor.toFixed(1)}
          </p>
          <p className="type-meta text-white/30 mt-1">Total points</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 type-meta text-white/25"
      >
        {team.totalTransactions} ROSTER MOVES
      </motion.p>
    </SlideLayout>
  );
}
