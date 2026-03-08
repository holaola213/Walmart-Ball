"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { MOTION } from "@/lib/motion";

const SUPERLATIVE_COLORS: Record<string, string> = {
  "#1 Seed": "#E9C46A",
  "Scoring Machine": "#5ECF9B",
  "Hot Streak": "#F0A35E",
  "Weekly Warrior": "#5ECF9B",
  "Blowout Artist": "#6EB9FF",
  "Draft Day MVP": "#B69CFF",
  "Most Active GM": "#72D5FF",
  "Trade Dealer": "#B69CFF",
  "Second Half Surge": "#56C7C1",
  "First Half Hero": "#F0A35E",
  "Overachiever": "#67CDA2",
  "Nail Biter King": "#E9C46A",
  "Strength of Schedule": "#67CDA2",
  "Streaky Scorer": "#D29AF3",
  "Rollercoaster": "#67CDA2",
  "Lucky Winner": "#E9C46A",
  "Slow Starter": "#D29AF3",
  "Couch Potato GM": "#9AA9BF",
  "Easy Street": "#9EA6FF",
  "Injury Ward": "#9AA9BF",
  "Heartbreak Kid": "#F28B82",
  "Punching Bag": "#F28B82",
  "Underachiever": "#56C7C1",
  "Cold Streak": "#9EA6FF",
  "Bottom Feeder": "#9EA6FF",
  "Peak Performer": "#E9C46A",
  "Almost": "#B69CFF",
  "Season Veteran": "#9AA9BF",
  "Roster Tinkerer": "#72D5FF",
};

function getAwardColor(title: string): string {
  if (SUPERLATIVE_COLORS[title]) return SUPERLATIVE_COLORS[title];
  // Check for "Almost X" pattern
  if (title.startsWith("Almost")) return "#B69CFF";
  return "#B69CFF";
}

export function OutroSlide({ data, direction }: SlideProps) {
  const awards = data.teamAwards;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.outro} direction={direction} mood="hero">
      <motion.div
        {...MOTION.intro}
        transition={{ ...MOTION.intro.transition, delay: 0.15 }}
        className="w-full max-w-5xl"
      >
        <p className="type-kicker text-[#8B9DFF]/70 mb-2 text-center">
          Season Closed
        </p>

        <h2 className="type-title-lg text-white text-center break-words title-balance measure-wide mx-auto">
          {data.leagueName}
        </h2>
        <p className="font-display text-[#8B9DFF] text-[clamp(1rem,2.4vw,1.55rem)] mt-1 tracking-[0.08em] text-center">
          {data.seasonYear} YEARBOOK
        </p>

        <motion.div
          {...MOTION.reveal}
          transition={{ ...MOTION.reveal.transition, delay: 0.45 }}
          className="mt-5 mb-4 text-center"
        >
          <span className="inline-flex px-4 py-1.5 rounded-full glass type-meta text-white/60">
            {awards.length} season awards
          </span>
        </motion.div>

        <motion.div
          {...MOTION.reveal}
          transition={{ ...MOTION.reveal.transition, delay: 0.6 }}
          className="w-full max-h-[48vh] overflow-y-auto custom-scrollbar pr-1"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {awards.map((award, i) => {
              const color = getAwardColor(award.title);
              return (
                <motion.div
                  key={`${award.teamId}-${award.title}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 + i * 0.03 }}
                  className="glass rounded-xl px-3 py-4 text-center flex flex-col items-center gap-2 min-h-[132px]"
                >
                  {data.teamLogoMap[award.teamId] ? (
                    <img
                      src={getTeamLogoUrl(data.teamLogoMap[award.teamId])}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover bg-white/5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <span className="text-white/45 text-sm font-display">
                        {award.teamName.charAt(0)}
                      </span>
                    </div>
                  )}

                  <p className="text-white/65 text-sm font-medium leading-tight w-full copy-pretty">
                    {award.teamName}
                  </p>

                  <p
                    className="type-meta leading-tight"
                    style={{ color: `${color}D9` }}
                  >
                    {award.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          {...MOTION.reveal}
          transition={{ ...MOTION.reveal.transition, delay: 1.15 }}
          className="mt-5 text-[#8B9DFF]/65 type-kicker text-center"
        >
          Continue to your personal chapter
        </motion.p>
      </motion.div>
    </SlideLayout>
  );
}
