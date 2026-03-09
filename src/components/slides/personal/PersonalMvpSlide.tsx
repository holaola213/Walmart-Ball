"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { TeamWrappedData } from "@/lib/types";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

export function PersonalMvpSlide({ team, direction }: Props) {
  const mvp = team.mvpPlayer;

  if (!mvp) {
    return (
      <SlideLayout accentColor={SLIDE_COLORS.personalMvp} direction={direction} pattern="orbs">
        <p className="text-white/40">No player data available</p>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout accentColor={SLIDE_COLORS.personalMvp} direction={direction} pattern="orbs">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#F0A35E]/75 mb-6"
      >
        Your MVP
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ boxShadow: "0 0 40px rgba(240, 163, 94, 0.12)" }}
      >
        {mvp.playerId > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{ background: "#F0A35E" }} />
              <img
                src={getPlayerHeadshotUrl(mvp.playerId)}
                alt={mvp.playerName}
                className="relative w-24 h-24 rounded-full object-cover bg-white/10 border"
                style={{ borderColor: "rgba(240, 163, 94, 0.35)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}
        <div className="type-meta text-[#F0A35E]/75 mb-2">
          {mvp.position}
        </div>
        <h3 className="type-title-md text-white mb-4 title-balance measure-medium mx-auto">
          {mvp.playerName}
        </h3>
        <div className="type-number-lg font-bold text-[#F0A35E]" style={{ textShadow: "0 0 30px rgba(240, 163, 94, 0.3)" }}>
          <StatNumber value={mvp.totalPoints} decimals={1} />
        </div>
        <p className="type-meta text-white/25 mt-2">Total fantasy points</p>
        <div className="mt-4 inline-block px-4 py-1.5 rounded-full glass text-[#F0A35E] type-meta">
          {mvp.acquisitionType === "DRAFT"
            ? "DRAFTED"
            : mvp.acquisitionType === "TRADE"
            ? "TRADED FOR"
            : "FREE AGENT"}
        </div>
      </motion.div>
    </SlideLayout>
  );
}
