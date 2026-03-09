"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { MOTION } from "@/lib/motion";

export function WelcomeSlide({ data, direction }: SlideProps) {
  const [failedLogos, setFailedLogos] = useState<Record<number, boolean>>({});

  return (
    <SlideLayout accentColor={SLIDE_COLORS.welcome} direction={direction} mood="hero" pattern="beams">
      <motion.div
        {...MOTION.intro}
        transition={{ ...MOTION.intro.transition, delay: 0.15 }}
        className="w-full max-w-5xl"
      >
        <p className="type-kicker mb-5 text-center md:text-left" style={{ color: `${SLIDE_COLORS.welcome}BE` }}>
          {data.seasonYear} Regular Season Recap
        </p>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 md:gap-10 items-end">
          <div className="text-center md:text-left">
            <motion.h1
              {...MOTION.reveal}
              transition={{ ...MOTION.reveal.transition, delay: 0.24 }}
              className="font-display text-white text-[clamp(2.7rem,6.2vw,5.4rem)] leading-[0.9] tracking-[0.015em] break-words title-balance measure-medium mx-auto md:mx-0"
              style={{ textShadow: "0 0 46px rgba(139, 157, 255, 0.2)" }}
            >
              {data.leagueName}
            </motion.h1>
            <motion.p
              {...MOTION.reveal}
              transition={{ ...MOTION.reveal.transition, delay: 0.38 }}
              className="type-title-xl text-white/94 mt-4 title-balance"
              style={{ textShadow: "0 0 32px rgba(139, 157, 255, 0.18)" }}
            >
              WRAPPED
            </motion.p>
          </div>

          <motion.div
            {...MOTION.hero}
            transition={{ ...MOTION.hero.transition, delay: 0.55 }}
            className="glass-strong rounded-2xl px-5 py-4 text-left"
          >
            <p className="type-meta" style={{ color: `${SLIDE_COLORS.welcome}CC` }}>League Members</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {data.standings.map((team) => (
                <div
                  key={team.teamId}
                  className="flex items-center gap-2.5 min-w-0"
                >
                  {data.teamLogoMap[team.teamId] && !failedLogos[team.teamId] ? (
                    <img
                      src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover bg-white/10 border border-white/12 shrink-0"
                      onError={() => {
                        setFailedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                      }}
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-white/8 border border-white/10 shrink-0 flex items-center justify-center font-display text-xs text-white/55">
                      {team.teamName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <p className="text-sm md:text-[15px] text-white/82 leading-tight copy-pretty min-w-0">
                    {team.teamName}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SlideLayout>
  );
}
