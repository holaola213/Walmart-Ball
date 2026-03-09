"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { MOTION } from "@/lib/motion";

export function ChampionSlide({ data, direction }: SlideProps) {
  const champ = data.champion;
  const logo = data.teamLogoMap[champ.teamId];

  return (
    <SlideLayout accentColor={SLIDE_COLORS.champion} direction={direction} mood="hero" pattern="contour">
      <motion.div
        {...MOTION.intro}
        transition={{ ...MOTION.intro.transition, delay: 0.15 }}
        className="w-full max-w-5xl"
      >
        <p className="type-kicker text-[#F4C542]/75 mb-6 text-center md:text-left">
          League Champion
        </p>

        <div className="grid md:grid-cols-[1.15fr_1fr] gap-6 items-center">
          <motion.div
            {...MOTION.hero}
            transition={{ ...MOTION.hero.transition, delay: 0.3 }}
            className="glass-strong rounded-2xl p-6 md:p-8 text-center md:text-left"
            style={{
              borderColor: "rgba(244, 197, 66, 0.25)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.35), 0 0 28px rgba(244, 197, 66, 0.12)",
            }}
          >
            <p className="type-meta text-[#F4C542]/70">#1 Seed</p>
            <h2
              className="type-title-lg text-white mt-3 break-words title-balance measure-medium"
              style={{ textShadow: "0 0 30px rgba(244, 197, 66, 0.15)" }}
            >
              {champ.teamName}
            </h2>
            <p className="mt-4 font-stat text-[#F4C542] text-[clamp(1.35rem,2.6vw,2rem)] tracking-[0.12em]">
              {champ.wins}-{champ.losses}
              {champ.ties > 0 ? `-${champ.ties}` : ""}
            </p>
            <p className="mt-2 type-meta text-white/55">
              {champ.pointsFor.toFixed(1)} total points
            </p>
          </motion.div>

          <motion.div
            {...MOTION.reveal}
            transition={{ ...MOTION.reveal.transition, delay: 0.55 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ background: "radial-gradient(circle, #F4C542, transparent)" }}
              />
              {logo ? (
                <img
                  src={getTeamLogoUrl(logo)}
                  alt={champ.teamName}
                  className="relative w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2"
                  style={{ borderColor: "rgba(244, 197, 66, 0.42)" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <svg className="relative" width="108" height="108" viewBox="0 0 80 80" fill="none">
                  <path d="M20 25H10C10 25 8 25 8 35C8 45 15 45 15 45L20 45" stroke="#F4C542" strokeWidth="2" fill="none"/>
                  <path d="M60 25H70C70 25 72 25 72 35C72 45 65 45 65 45L60 45" stroke="#F4C542" strokeWidth="2" fill="none"/>
                  <path d="M20 20H60V50C60 55 55 60 40 60C25 60 20 55 20 50V20Z" stroke="#F4C542" strokeWidth="2" fill="#F4C54220"/>
                  <rect x="35" y="60" width="10" height="8" stroke="#F4C542" strokeWidth="2" fill="none"/>
                  <rect x="28" y="68" width="24" height="4" rx="1" stroke="#F4C542" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </div>
            <p className="type-meta text-white/40">Crowned Weekly</p>
          </motion.div>
        </div>
      </motion.div>
    </SlideLayout>
  );
}
