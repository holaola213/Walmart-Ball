"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

export function MvpPlayerSlide({ data, direction }: SlideProps) {
  const mvp = data.mvpPlayer;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.mvp} direction={direction} pattern="orbs">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#F0A35E]/75 mb-6"
      >
        League MVP
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
        <h3 className="type-title-md text-white mb-2 title-balance measure-medium mx-auto">
          {mvp.playerName}
        </h3>
        <p className="text-white/35 text-[14px] leading-[1.35] mb-6 copy-pretty">
          Rostered by {mvp.teamName}
        </p>
        <div className="type-number-lg font-bold text-[#F0A35E]" style={{ textShadow: "0 0 30px rgba(240, 163, 94, 0.3)" }}>
          <StatNumber value={mvp.totalPoints} decimals={1} />
        </div>
        <p className="type-meta text-white/25 mt-2">Total fantasy points</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 px-4 py-1.5 rounded-full glass text-[#F0A35E] type-meta"
      >
        {mvp.acquisitionType === "DRAFT"
          ? "DRAFTED"
          : mvp.acquisitionType === "TRADE"
          ? "TRADED"
          : "FREE AGENT"}
      </motion.div>

      {data.mvpPlayerRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.mvp}
          delay={1.0}
          items={data.mvpPlayerRunnersUp.map((p) => ({
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
