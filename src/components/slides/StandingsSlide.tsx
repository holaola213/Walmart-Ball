"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function StandingsSlide({ data, direction }: SlideProps) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.standings} direction={direction}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl text-white mb-8 tracking-wide"
      >
        FINAL STANDINGS
      </motion.h2>

      <div className="w-full max-w-md space-y-1.5">
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
            {team.logo && (
              <img
                src={getTeamLogoUrl(team.logo)}
                alt=""
                className="w-7 h-7 rounded-full object-cover bg-white/10 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="flex-1 text-white text-sm font-medium min-w-0 break-words leading-tight">
              {team.teamName}
            </span>
            <span className="text-white/40 text-sm font-stat shrink-0">
              {team.wins}-{team.losses}
            </span>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}
