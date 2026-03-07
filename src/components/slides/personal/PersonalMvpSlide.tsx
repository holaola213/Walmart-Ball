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
      <SlideLayout accentColor={SLIDE_COLORS.personalMvp} direction={direction}>
        <p className="text-white/40">No player data available</p>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout accentColor={SLIDE_COLORS.personalMvp} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-orange-400/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        Your MVP
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ boxShadow: "0 0 40px rgba(249, 115, 22, 0.1)" }}
      >
        {mvp.playerId > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{ background: "#F97316" }} />
              <img
                src={getPlayerHeadshotUrl(mvp.playerId)}
                alt={mvp.playerName}
                className="relative w-24 h-24 rounded-full object-cover bg-white/10 border border-orange-500/30"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}
        <div className="font-stat text-orange-400/60 text-[10px] uppercase tracking-[0.3em] mb-2">
          {mvp.position}
        </div>
        <h3 className="font-display text-4xl text-white mb-4">
          {mvp.playerName}
        </h3>
        <div className="font-stat text-5xl font-bold text-orange-400" style={{ textShadow: "0 0 30px rgba(249, 115, 22, 0.3)" }}>
          <StatNumber value={mvp.totalPoints} decimals={1} />
        </div>
        <p className="text-white/20 text-[10px] font-stat uppercase tracking-widest mt-2">Total Fantasy Points</p>
        <div className="mt-4 inline-block px-4 py-1.5 rounded-full glass text-orange-400 text-[10px] font-stat tracking-[0.3em]">
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
