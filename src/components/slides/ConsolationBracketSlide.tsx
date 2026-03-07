"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { StandingEntry } from "@/lib/types";

function TeamCell({
  team,
  seed,
  accentColor,
}: {
  team: StandingEntry;
  seed: number;
  accentColor: string;
}) {
  return (
    <div
      className="flex items-center gap-2 w-[120px] md:w-[160px] h-[34px] md:h-[40px] rounded-md px-2.5"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <span
        className="font-stat text-[10px] md:text-[11px] shrink-0 w-5 text-center"
        style={{ color: `${accentColor}70` }}
      >
        {seed}
      </span>
      {team.logo && (
        <img
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover bg-white/10 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <span className="text-white/70 text-[10px] md:text-xs font-medium truncate leading-tight">
        {team.abbrev}
      </span>
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      className="flex items-center justify-center gap-1 w-[120px] md:w-[160px] h-[34px] md:h-[40px] rounded-md"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed rgba(255, 255, 255, 0.1)",
      }}
    >
      <span className="font-stat text-[10px] text-white/15">TBD</span>
    </div>
  );
}

function Connector({ heightPx }: { heightPx: number }) {
  const border = "1px solid rgba(255, 255, 255, 0.12)";
  return (
    <div className="flex flex-col shrink-0" style={{ width: "20px" }}>
      <div
        style={{
          borderTop: border,
          borderRight: border,
          height: heightPx / 2,
          borderTopRightRadius: "3px",
        }}
      />
      <div
        style={{
          borderBottom: border,
          borderRight: border,
          height: heightPx / 2,
          borderBottomRightRadius: "3px",
        }}
      />
    </div>
  );
}

function HLine() {
  return (
    <div
      className="shrink-0"
      style={{
        width: "14px",
        height: "1px",
        background: "rgba(255, 255, 255, 0.12)",
      }}
    />
  );
}

export function ConsolationBracketSlide({ data, direction }: SlideProps) {
  const accentColor = SLIDE_COLORS.consolationBracket;
  const seeds = data.standings.slice(8, 12);

  const matchups = [
    [seeds[0], seeds[3]], // 9 vs 12
    [seeds[1], seeds[2]], // 10 vs 11
  ];

  const cellH = 34;
  const pairGap = 6;
  const matchupGap = 20;
  const pairH = cellH * 2 + pairGap;
  const connectorH = pairH + matchupGap;

  return (
    <SlideLayout accentColor={accentColor} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-xs uppercase tracking-[0.5em] mb-2"
        style={{ color: `${accentColor}80` }}
      >
        Projected
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display text-4xl md:text-5xl text-white text-center mb-1"
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        CONSOLATION BRACKET
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-[10px] font-stat tracking-[0.3em] uppercase mb-8"
      >
        Seeds 9-12
      </motion.p>

      {/* Round labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex items-center mb-3"
      >
        <span className="w-[120px] md:w-[160px] text-center text-white/15 text-[8px] font-stat tracking-[0.2em] uppercase">
          Round 1
        </span>
        <span className="w-[34px] shrink-0" />
        <span className="w-[120px] md:w-[160px] text-center text-white/15 text-[8px] font-stat tracking-[0.2em] uppercase">
          Finals
        </span>
      </motion.div>

      {/* Bracket */}
      <div className="flex items-center">
        {/* Round 1 matchups */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col"
          style={{ gap: `${matchupGap}px` }}
        >
          {matchups.map((pair, i) => (
            <div key={i} className="flex flex-col" style={{ gap: `${pairGap}px` }}>
              <TeamCell team={pair[0]} seed={pair[0].rank} accentColor={accentColor} />
              <TeamCell team={pair[1]} seed={pair[1].rank} accentColor={accentColor} />
            </div>
          ))}
        </motion.div>

        {/* Connector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="shrink-0"
        >
          <Connector heightPx={connectorH} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="shrink-0"
        >
          <HLine />
        </motion.div>

        {/* Finals slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <EmptySlot />
        </motion.div>
      </div>
    </SlideLayout>
  );
}
