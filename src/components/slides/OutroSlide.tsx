"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

const SUPERLATIVE_COLORS: Record<string, string> = {
  "#1 Seed": "#EAB308",
  "Scoring Machine": "#22C55E",
  "Hot Streak": "#F97316",
  "Weekly Warrior": "#22C55E",
  "Blowout Artist": "#3B82F6",
  "Draft Day MVP": "#C084FC",
  "Most Active GM": "#06B6D4",
  "Trade Dealer": "#A855F7",
  "Second Half Surge": "#14B8A6",
  "First Half Hero": "#F97316",
  "Overachiever": "#34D399",
  "Nail Biter King": "#EAB308",
  "Strength of Schedule": "#34D399",
  "Streaky Scorer": "#FB7185",
  "Rollercoaster": "#34D399",
  "Lucky Winner": "#FBBF24",
  "Slow Starter": "#FB7185",
  "Couch Potato GM": "#94A3B8",
  "Easy Street": "#6366F1",
  "Injury Ward": "#64748B",
  "Heartbreak Kid": "#EF4444",
  "Punching Bag": "#EF4444",
  "Underachiever": "#14B8A6",
  "Cold Streak": "#6366F1",
  "Bottom Feeder": "#6366F1",
  "Peak Performer": "#F59E0B",
  "Almost": "#8B5CF6",
  "Season Veteran": "#94A3B8",
  "Roster Tinkerer": "#06B6D4",
};

function getAwardColor(title: string): string {
  if (SUPERLATIVE_COLORS[title]) return SUPERLATIVE_COLORS[title];
  // Check for "Almost X" pattern
  if (title.startsWith("Almost")) return "#8B5CF6";
  return "#8B5CF6"; // default violet
}

export function OutroSlide({ data, direction }: SlideProps) {
  const awards = data.teamAwards;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.outro} direction={direction}>
      {/* Header */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-violet-400/50 text-xs uppercase tracking-[0.5em] mb-3"
      >
        That&apos;s a wrap
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        className="font-display text-3xl md:text-4xl text-white text-center mb-1 leading-[0.9]"
      >
        {data.leagueName}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="font-display text-violet-400 text-lg md:text-xl mb-5 tracking-wider"
      >
        {data.seasonYear} SEASON
      </motion.p>

      {/* Yearbook Awards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="w-full max-w-md md:max-w-2xl"
      >
        <p className="text-white/15 text-[9px] font-stat tracking-[0.3em] uppercase mb-3 text-center">
          Season Awards
        </p>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {awards.map((award, i) => {
            const color = getAwardColor(award.title);
            return (
              <motion.div
                key={award.teamId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="glass rounded-xl px-2 py-3 md:px-3 md:py-4 text-center flex flex-col items-center gap-1.5"
              >
                {data.teamLogoMap[award.teamId] ? (
                  <img
                    src={getTeamLogoUrl(data.teamLogoMap[award.teamId])}
                    alt=""
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-white/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5"
                    style={{ border: `1px solid rgba(255,255,255,0.1)` }}
                  >
                    <span className="text-white/40 text-xs md:text-sm font-display">
                      {award.teamName.charAt(0)}
                    </span>
                  </div>
                )}

                <p className="text-white/50 text-[10px] font-medium leading-tight w-full">
                  {award.teamName}
                </p>

                <p
                  className="font-stat text-[8px] tracking-wider leading-tight uppercase"
                  style={{ color: `${color}CC` }}
                >
                  {award.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-5 text-violet-400/50 text-[10px] font-stat tracking-widest"
      >
        CLICK TO SEE YOUR PERSONAL STATS
      </motion.p>
    </SlideLayout>
  );
}
