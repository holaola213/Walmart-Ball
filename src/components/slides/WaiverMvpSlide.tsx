"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

export function WaiverMvpSlide({ data, direction }: SlideProps) {
  const waiver = data.waiverMvp;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.waiverMvp} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-lime-400/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        Waiver Wire MVP
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ boxShadow: "0 0 40px rgba(132, 204, 22, 0.08)" }}
      >
        <div className="inline-block px-4 py-1.5 rounded-full glass text-lime-400 text-[10px] font-stat tracking-[0.3em] mb-4">
          FREE AGENT
        </div>
        {waiver.playerId > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{ background: "#84CC16" }} />
              <img
                src={getPlayerHeadshotUrl(waiver.playerId)}
                alt={waiver.playerName}
                className="relative w-24 h-24 rounded-full object-cover bg-white/10 border border-lime-500/30"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}
        <div className="font-stat text-lime-400/60 text-[10px] uppercase tracking-[0.3em] mb-2">
          {waiver.position}
        </div>
        <h3 className="font-display text-4xl md:text-5xl text-white mb-2">
          {waiver.playerName}
        </h3>
        <p className="text-white/30 text-xs mb-6">
          Picked up by {waiver.teamName}
        </p>
        <div className="font-stat text-5xl font-bold text-lime-400" style={{ textShadow: "0 0 30px rgba(132, 204, 22, 0.3)" }}>
          <StatNumber value={waiver.totalPoints} decimals={1} />
        </div>
        <p className="text-white/20 text-[10px] font-stat uppercase tracking-widest mt-2">Total Fantasy Points</p>
      </motion.div>

      {data.waiverMvpRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.waiverMvp}
          delay={1.0}
          items={data.waiverMvpRunnersUp.map((p) => ({
            label: p.playerName,
            sublabel: p.teamName,
            value: `${p.totalPoints.toFixed(1)} pts`,
            avatarUrl: p.playerId > 0 ? getPlayerHeadshotUrl(p.playerId) : undefined,
          }))}
        />
      )}
    </SlideLayout>
  );
}
