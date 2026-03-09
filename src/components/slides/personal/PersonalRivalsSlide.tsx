"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { TeamWrappedData } from "@/lib/types";

interface Props {
  team: TeamWrappedData;
  direction: number;
  teamLogoMap: Record<number, string>;
}

export function PersonalRivalsSlide({ team, direction, teamLogoMap }: Props) {
  const sortedRivals = [...team.rivals].sort(
    (a, b) => b.wins + b.losses + b.ties - (a.wins + a.losses + a.ties)
  );
  const [failedLogos, setFailedLogos] = useState<Record<number, boolean>>({});
  const [loadedLogos, setLoadedLogos] = useState<Record<number, boolean>>({});

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.personalRivals}
      direction={direction}
      pattern="contour"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-blue-400/55 mb-8"
      >
        Head-to-Head Record
      </motion.p>

      <div className="w-full max-w-4xl grid gap-1.5 max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 md:grid-cols-2 md:gap-x-4 md:gap-y-2 md:max-h-none md:overflow-visible md:pr-0">
        {sortedRivals.map((rival, i) => {
          const total = rival.wins + rival.losses + rival.ties;
          const winPct = total > 0 ? rival.wins / total : 0;
          const logoUrl = rival.logo || teamLogoMap[rival.opponentId];

          return (
            <motion.div
              key={rival.opponentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 glass rounded-lg px-4 py-2.25 hover:bg-white/[0.08] transition-colors min-w-0"
            >
              <div className="relative w-10 h-10 rounded-full bg-white/8 shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
                <span
                  className={`absolute inset-0 flex items-center justify-center font-display text-sm text-white/55 leading-none transition-opacity duration-200 ${
                    loadedLogos[rival.opponentId] && !failedLogos[rival.opponentId]
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  {rival.opponentName.charAt(0).toUpperCase()}
                </span>
                {logoUrl && !failedLogos[rival.opponentId] ? (
                  <img
                    src={getTeamLogoUrl(logoUrl)}
                    alt=""
                    className={`absolute inset-0 w-10 h-10 rounded-full object-cover transition-opacity duration-200 ${
                      loadedLogos[rival.opponentId] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => {
                      setLoadedLogos((prev) => ({ ...prev, [rival.opponentId]: true }));
                    }}
                    onError={() => {
                      setFailedLogos((prev) => ({ ...prev, [rival.opponentId]: true }));
                    }}
                  />
                ) : null}
              </div>
              <span className="flex-1 text-white text-[15px] min-w-0 break-words leading-[1.2] copy-pretty">
                {rival.opponentName}
              </span>
              <span
                className="font-stat font-bold text-[14px] tracking-[0.08em]"
                style={{
                  color:
                    winPct > 0.5
                      ? "#5ECF9B"
                      : winPct < 0.5
                      ? "#F28B82"
                      : "#E9C46A",
                }}
              >
                {rival.wins}-{rival.losses}
                {rival.ties > 0 ? `-${rival.ties}` : ""}
              </span>
            </motion.div>
          );
        })}
      </div>
    </SlideLayout>
  );
}
