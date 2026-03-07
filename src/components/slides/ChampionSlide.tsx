"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function ChampionSlide({ data, direction }: SlideProps) {
  const champ = data.champion;
  const logo = data.teamLogoMap[champ.teamId];

  return (
    <SlideLayout accentColor={SLIDE_COLORS.champion} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-yellow-500/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        #1 Seed
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="mb-8 relative"
      >
        {/* Glow ring behind logo */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{ background: "radial-gradient(circle, #EAB308, transparent)" }}
        />
        {logo ? (
          <img
            src={getTeamLogoUrl(logo)}
            alt={champ.teamName}
            className="relative w-28 h-28 rounded-full object-cover border-2 border-yellow-500/40"
            style={{ boxShadow: "0 0 30px rgba(234, 179, 8, 0.3)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <svg className="relative" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M20 25H10C10 25 8 25 8 35C8 45 15 45 15 45L20 45" stroke="#EAB308" strokeWidth="2" fill="none"/>
            <path d="M60 25H70C70 25 72 25 72 35C72 45 65 45 65 45L60 45" stroke="#EAB308" strokeWidth="2" fill="none"/>
            <path d="M20 20H60V50C60 55 55 60 40 60C25 60 20 55 20 50V20Z" stroke="#EAB308" strokeWidth="2" fill="#EAB30820"/>
            <rect x="35" y="60" width="10" height="8" stroke="#EAB308" strokeWidth="2" fill="none"/>
            <rect x="28" y="68" width="24" height="4" rx="1" stroke="#EAB308" strokeWidth="2" fill="none"/>
          </svg>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="font-display text-5xl md:text-6xl lg:text-7xl text-white text-center"
        style={{ textShadow: "0 0 40px rgba(234, 179, 8, 0.2)" }}
      >
        {champ.teamName}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 font-stat text-yellow-400 text-2xl tracking-wider"
      >
        {champ.wins}-{champ.losses}
        {champ.ties > 0 ? `-${champ.ties}` : ""}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-2 text-white/30 text-xs font-stat tracking-wider"
      >
        {champ.pointsFor.toFixed(1)} TOTAL POINTS
      </motion.p>
    </SlideLayout>
  );
}
