"use client";

import { useState } from "react";
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
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  return (
    <SlideLayout accentColor={SLIDE_COLORS.outro} direction={direction} mood="hero" pattern="orbs">
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
          className="mt-3 mb-3 text-center"
        >
          <span className="inline-flex px-4 py-1.5 rounded-full glass type-meta text-white/60">
            {awards.length} season awards
          </span>
        </motion.div>

        <motion.div
          {...MOTION.reveal}
          transition={{ ...MOTION.reveal.transition, delay: 0.6 }}
          className="w-full"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
            {awards.map((award, i) => {
              const color = getAwardColor(award.title);
              const awardKey = `${award.teamId}-${award.title}-${i}`;
              return (
                <motion.div
                  key={awardKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 + i * 0.03 }}
                  className="group relative overflow-hidden rounded-2xl px-3.5 py-4 text-center flex flex-col items-center justify-start gap-2.5 min-h-[126px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))]"
                  title={award.detail}
                >
                  {data.teamLogoMap[award.teamId] && !failedLogos[awardKey] ? (
                    <img
                      src={getTeamLogoUrl(data.teamLogoMap[award.teamId])}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover bg-white/5"
                      onError={() => {
                        setFailedLogos((prev) => ({ ...prev, [awardKey]: true }));
                      }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/8 border border-white/10"
                    >
                      <span className="text-white/55 text-sm font-display">
                        {award.teamName.charAt(0)}
                      </span>
                    </div>
                  )}

                  <p className="text-white/72 text-[15px] font-medium leading-tight w-full copy-pretty">
                    {award.teamName}
                  </p>

                  <div className="w-10 h-px bg-white/10" />

                  <p
                    className="type-meta leading-tight mt-auto tracking-[0.24em]"
                    style={{ color: `${color}D9` }}
                  >
                    {award.title}
                  </p>

                  <div className="pointer-events-none absolute inset-0 flex items-end bg-[linear-gradient(180deg,rgba(4,8,18,0.04),rgba(4,8,18,0.92))] px-3.5 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p className="w-full text-center text-[12px] leading-[1.35] text-white/86 copy-pretty">
                      {award.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          {...MOTION.reveal}
          transition={{ ...MOTION.reveal.transition, delay: 1.15 }}
          className="mt-4 text-[#8B9DFF]/65 type-kicker text-center"
        >
          Continue to your personal chapter
        </motion.p>
      </motion.div>
    </SlideLayout>
  );
}
