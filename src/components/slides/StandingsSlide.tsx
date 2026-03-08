"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function StandingsSlide({ data, direction }: SlideProps) {
  const [failedLogos, setFailedLogos] = useState<Record<number, boolean>>({});

  return (
    <SlideLayout accentColor={SLIDE_COLORS.standings} direction={direction}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="type-title-md text-white mb-8 tracking-[0.04em] text-center title-balance"
      >
        FINAL STANDINGS
      </motion.h2>

      <div className="w-full max-w-lg space-y-2">
        {data.standings.map((team, i) => (
          <motion.div
            key={team.teamId}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-center gap-3 glass rounded-lg px-4 py-2.5 group hover:bg-white/[0.08] transition-colors"
          >
            <span
              className="font-display text-2xl w-8 text-right shrink-0"
              style={{
                color:
                  i === 0
                    ? "#EAB308"
                    : i === 1
                    ? "#C0C0C0"
                    : i === 2
                    ? "#CD7F32"
                    : "rgba(255,255,255,0.25)",
              }}
            >
              {i + 1}
            </span>
            <div className="w-7 h-7 rounded-full bg-white/10 shrink-0 flex items-center justify-center border border-white/15 overflow-hidden">
              {team.logo && !failedLogos[team.teamId] ? (
                <img
                  src={getTeamLogoUrl(team.logo)}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                  onError={() => {
                    setFailedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                  }}
                />
              ) : (
                <span className="font-display text-[10px] text-white/55 leading-none">
                  {team.teamName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="flex-1 text-white text-[15px] font-medium min-w-0 break-words leading-[1.2] copy-pretty">
              {team.teamName}
            </span>
            <span className="text-white/45 text-[14px] font-stat shrink-0">
              {team.wins}-{team.losses}
            </span>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
