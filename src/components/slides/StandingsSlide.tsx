"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function StandingsSlide({ data, direction }: SlideProps) {
  const [failedLogos, setFailedLogos] = useState<Record<number, boolean>>({});

  return (
    <SlideLayout accentColor={SLIDE_COLORS.standings} direction={direction} pattern="grid">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="type-title-md text-white mb-2 tracking-[0.04em] text-center title-balance"
      >
        FINAL STANDINGS
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="type-kicker text-white/48 mb-5"
      >
        Regular season finish
      </motion.p>

      <div className="w-full max-w-[42rem] divide-y divide-white/8">
        {data.standings.map((team, i) => (
          <motion.div
            key={team.teamId}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-center gap-3.5 px-3 md:px-4 py-2.5"
          >
            <span
              className="font-stat text-[1.25rem] md:text-[1.35rem] font-bold w-9 text-right shrink-0 tracking-[-0.04em]"
              style={{
                color:
                  i === 0
                    ? "#EAB308"
                    : i === 1
                    ? "#C0C0C0"
                    : i === 2
                    ? "#CD7F32"
                    : "rgba(255,255,255,0.34)",
              }}
            >
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/8 shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
              {team.logo && !failedLogos[team.teamId] ? (
                <img
                  src={getTeamLogoUrl(team.logo)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  onError={() => {
                    setFailedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                  }}
                />
              ) : (
                <span className="font-display text-[11px] text-white/55 leading-none">
                  {team.teamName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[15px] md:text-[16px] font-medium min-w-0 break-words leading-[1.2] copy-pretty">
                {team.teamName}
              </p>
            </div>
            <span className="text-[15px] font-stat shrink-0 tracking-[0.06em] flex items-center gap-1">
              <span className="text-[#5ECF9B]">{team.wins}</span>
              <span className="text-white/34">-</span>
              <span className="text-[#F28B82]">{team.losses}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
