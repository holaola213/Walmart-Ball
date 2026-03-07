"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";
import { StandingEntry } from "@/lib/types";

function TeamCell({
  team,
  accentColor,
}: {
  team: StandingEntry;
  accentColor: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 md:gap-2 w-[135px] md:w-[190px] h-[34px] md:h-[42px] rounded-lg px-2 md:px-2.5"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <span
        className="font-stat text-[8px] md:text-[9px] shrink-0 w-4 text-right"
        style={{ color: `${accentColor}60` }}
      >
        #{team.rank}
      </span>
      {team.logo ? (
        <img
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover bg-white/10 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/5 shrink-0 flex items-center justify-center">
          <span className="text-white/30 text-[8px] font-display">{team.teamName.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-[8px] md:text-[10px] font-medium truncate leading-tight">
          {team.teamName}
        </p>
        <p className="text-white/25 text-[7px] md:text-[8px] font-stat leading-tight">
          {team.wins}-{team.losses}
        </p>
      </div>
    </div>
  );
}

function EmptySlot({ showTrophy = false }: { showTrophy?: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-1 w-[135px] md:w-[190px] h-[34px] md:h-[42px] rounded-lg"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed rgba(255, 255, 255, 0.08)",
      }}
    >
      {showTrophy && <span className="text-[10px]">🏆</span>}
      <span className="font-stat text-[8px] text-white/15">TBD</span>
    </div>
  );
}

function Connector({ heightPx }: { heightPx: number }) {
  const border = "1px solid rgba(255, 255, 255, 0.12)";
  return (
    <div className="flex flex-col shrink-0 w-[14px] md:w-[18px]">
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
        width: "10px",
        height: "1px",
        background: "rgba(255, 255, 255, 0.12)",
      }}
    />
  );
}

export function WinnersBracketSlide({ data, direction }: SlideProps) {
  const accentColor = SLIDE_COLORS.winnersBracket;
  const seeds = data.standings.slice(0, 8);

  // ESPN matchup order: higher seed (worse) on top, lower seed (better) on bottom
  const topR1 = [
    [seeds[7], seeds[0]], // #8 vs #1
    [seeds[4], seeds[3]], // #5 vs #4
  ];
  const botR1 = [
    [seeds[5], seeds[2]], // #6 vs #3
    [seeds[6], seeds[1]], // #7 vs #2
  ];

  // Spacing constants
  const cellH = 34;
  const pairGap = 2;
  const matchupGap = 10;
  const pairH = cellH * 2 + pairGap;
  const connectorR1 = pairH + matchupGap;
  const connectorSemi = connectorR1 * 2 + matchupGap;

  const renderHalf = (
    matchups: StandingEntry[][],
    delayBase: number,
  ) => (
    <div className="flex items-center">
      {/* Round 1 */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayBase }}
        className="flex flex-col"
        style={{ gap: `${matchupGap}px` }}
      >
        {matchups.map((pair, i) => (
          <div key={i} className="flex flex-col" style={{ gap: `${pairGap}px` }}>
            <TeamCell team={pair[0]} accentColor={accentColor} />
            <TeamCell team={pair[1]} accentColor={accentColor} />
          </div>
        ))}
      </motion.div>

      {/* Connector R1 → Semi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase + 0.3 }}
        className="shrink-0 flex items-center"
      >
        <Connector heightPx={connectorR1} />
        <HLine />
      </motion.div>

      {/* Semi slot */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delayBase + 0.5 }}
        className="flex flex-col justify-center"
      >
        <EmptySlot />
      </motion.div>
    </div>
  );

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
        className="font-display text-3xl md:text-5xl text-white text-center mb-1"
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        WINNER&apos;S BRACKET
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-[10px] font-stat tracking-[0.3em] uppercase mb-5"
      >
        Seeds 1-8
      </motion.p>

      {/* Round labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex items-center mb-2 w-full max-w-2xl justify-center"
      >
        <span className="w-[135px] md:w-[190px] text-center text-white/15 text-[7px] md:text-[8px] font-stat tracking-[0.2em] uppercase">
          Round 1
        </span>
        <span className="w-[24px] shrink-0" />
        <span className="w-[135px] md:w-[190px] text-center text-white/15 text-[7px] md:text-[8px] font-stat tracking-[0.2em] uppercase">
          Semifinals
        </span>
        <span className="w-[24px] shrink-0" />
        <span className="w-[135px] md:w-[190px] text-center text-white/15 text-[7px] md:text-[8px] font-stat tracking-[0.2em] uppercase">
          Championship
        </span>
      </motion.div>

      {/* Bracket */}
      <div className="flex items-center">
        {/* Left: Two halves stacked */}
        <div className="flex flex-col" style={{ gap: `${matchupGap * 2}px` }}>
          {renderHalf(topR1, 0.6)}
          {renderHalf(botR1, 0.75)}
        </div>

        {/* Connector Semi → Final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="shrink-0 flex items-center"
        >
          <Connector heightPx={connectorSemi} />
          <HLine />
        </motion.div>

        {/* Finals slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
        >
          <EmptySlot showTrophy />
        </motion.div>
      </div>
    </SlideLayout>
  );
}
