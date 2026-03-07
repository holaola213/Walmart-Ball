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
      className="flex items-center gap-1.5 w-[100px] md:w-[140px] h-[30px] md:h-[36px] rounded-md px-2"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <span
        className="font-stat text-[9px] md:text-[10px] shrink-0 w-4 text-center"
        style={{ color: `${accentColor}70` }}
      >
        {seed}
      </span>
      {team.logo && (
        <img
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover bg-white/10 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <span className="text-white/70 text-[9px] md:text-[11px] font-medium truncate leading-tight">
        {team.abbrev}
      </span>
    </div>
  );
}

function EmptySlot({ showTrophy = false }: { showTrophy?: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-1 w-[100px] md:w-[140px] h-[30px] md:h-[36px] rounded-md"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed rgba(255, 255, 255, 0.1)",
      }}
    >
      {showTrophy && <span className="text-[10px]">🏆</span>}
      <span className="font-stat text-[9px] text-white/15">TBD</span>
    </div>
  );
}

function Connector({ heightPx }: { heightPx: number }) {
  const border = "1px solid rgba(255, 255, 255, 0.12)";
  return (
    <div className="flex flex-col shrink-0" style={{ width: "16px" }}>
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
        width: "12px",
        height: "1px",
        background: "rgba(255, 255, 255, 0.12)",
      }}
    />
  );
}

export function WinnersBracketSlide({ data, direction }: SlideProps) {
  const accentColor = SLIDE_COLORS.winnersBracket;
  const seeds = data.standings.slice(0, 8);

  // Matchup pairs: [top, bottom]
  // Top half: 1v8, 4v5 → semi → final
  // Bottom half: 2v7, 3v6 → semi → final
  const topR1 = [
    [seeds[0], seeds[7]], // 1 vs 8
    [seeds[3], seeds[4]], // 4 vs 5
  ];
  const botR1 = [
    [seeds[1], seeds[6]], // 2 vs 7
    [seeds[2], seeds[5]], // 3 vs 6
  ];

  // Spacing constants (in px) — derived from cell heights + gaps
  const cellH = 30; // mobile cell height
  const pairGap = 4; // gap between two teams in a pair
  const matchupGap = 12; // gap between two matchup pairs
  const pairH = cellH * 2 + pairGap; // height of one matchup pair
  const connectorR1 = pairH + matchupGap; // connector height for R1→Semi
  const connectorSemi = connectorR1 * 2 + matchupGap; // connector height for Semi→Final

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
            <TeamCell team={pair[0]} seed={pair[0].rank} accentColor={accentColor} />
            <TeamCell team={pair[1]} seed={pair[1].rank} accentColor={accentColor} />
          </div>
        ))}
      </motion.div>

      {/* Connector R1 → Semi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase + 0.3 }}
        className="flex flex-col shrink-0"
        style={{ gap: `${matchupGap}px` }}
      >
        <Connector heightPx={connectorR1} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase + 0.3 }}
        className="shrink-0"
      >
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
        className="font-display text-4xl md:text-5xl text-white text-center mb-1"
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        PLAYOFF BRACKET
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-[10px] font-stat tracking-[0.3em] uppercase mb-6"
      >
        Winner&apos;s Bracket &middot; Seeds 1-8
      </motion.p>

      {/* Round labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex items-center mb-3 w-full max-w-lg justify-center"
      >
        <span className="w-[100px] md:w-[140px] text-center text-white/15 text-[8px] font-stat tracking-[0.2em] uppercase">
          Round 1
        </span>
        <span className="w-[28px] shrink-0" />
        <span className="w-[100px] md:w-[140px] text-center text-white/15 text-[8px] font-stat tracking-[0.2em] uppercase">
          Semis
        </span>
        <span className="w-[28px] shrink-0" />
        <span className="w-[100px] md:w-[140px] text-center text-white/15 text-[8px] font-stat tracking-[0.2em] uppercase">
          Finals
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
          className="shrink-0"
        >
          <Connector heightPx={connectorSemi} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="shrink-0"
        >
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
