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
      className="flex items-center gap-2.5 w-[182px] md:w-[216px] h-[42px] md:h-[46px] rounded-2xl px-3 md:px-3.5"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(14, 22, 36, 0.76))",
        border: "1px solid rgba(180, 226, 214, 0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <span
        className="font-stat text-[11px] md:text-[12px] shrink-0 w-6 text-right tracking-[0.08em]"
        style={{ color: `${accentColor}C7` }}
      >
        #{team.rank}
      </span>
      {team.logo ? (
        <img
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-7 h-7 rounded-full object-cover bg-white/10 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 shrink-0 flex items-center justify-center">
          <span className="text-white/55 text-[10px] font-display">{team.teamName.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/92 text-[11px] md:text-[12px] font-medium truncate leading-tight">
          {team.teamName}
        </p>
        <p className="text-white/56 text-[10px] font-stat leading-tight tracking-[0.06em]">
          {team.wins}-{team.losses}
        </p>
      </div>
    </div>
  );
}

function EmptySlot({ showTrophy = false }: { showTrophy?: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-1 w-[182px] md:w-[216px] h-[42px] md:h-[46px] rounded-2xl"
      style={{
        background: "rgba(13, 20, 32, 0.7)",
        border: "1px dashed rgba(186, 230, 214, 0.22)",
      }}
    >
      {showTrophy && (
        <span className="font-stat text-[10px] text-[#BFFFE7] tracking-wider">
          CHAMP
        </span>
      )}
      {!showTrophy && <span className="font-stat text-[10px] text-white/58">TBD</span>}
    </div>
  );
}

function Connector({ heightPx }: { heightPx: number }) {
  const border = "1px solid rgba(255, 255, 255, 0.14)";
  return (
    <div className="flex flex-col shrink-0 w-[20px]">
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

  // ESPN matchup order: higher seed (worse) on top, lower seed (better) on bottom.
  const topR1 = [
    [seeds[7], seeds[0]], // #8 vs #1
    [seeds[4], seeds[3]], // #5 vs #4
  ];
  const botR1 = [
    [seeds[5], seeds[2]], // #6 vs #3
    [seeds[6], seeds[1]], // #7 vs #2
  ];

  const cellH = 40;
  const pairGap = 4;
  const matchupGap = 12;
  const pairH = cellH * 2 + pairGap;
  const connectorR1 = pairH + matchupGap;
  const connectorSemi = connectorR1 * 2 + matchupGap;

  const renderHalf = (matchups: StandingEntry[][], delayBase: number) => (
    <div className="flex items-center">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase + 0.3 }}
        className="shrink-0 flex items-center"
      >
        <Connector heightPx={connectorR1} />
        <HLine />
      </motion.div>

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
    <SlideLayout accentColor={accentColor} direction={direction} pattern="grid">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-2"
        style={{ color: `${accentColor}80` }}
      >
        Playoffs
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="type-title-md text-white text-center mb-1 title-balance"
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        WINNER&apos;S BRACKET
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="type-meta text-white/66 mb-5"
      >
        Seeds 1-8
      </motion.p>

      <div className="w-full overflow-x-auto custom-scrollbar pb-2">
        <div className="w-fit min-w-[792px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center mb-3 justify-center"
          >
            <span className="w-[182px] md:w-[216px] text-center text-white/65 type-meta">
              Round 1
            </span>
            <span className="w-[32px] shrink-0" />
            <span className="w-[182px] md:w-[216px] text-center text-white/65 type-meta">
              Semifinals
            </span>
            <span className="w-[32px] shrink-0" />
            <span className="w-[182px] md:w-[216px] text-center text-white/65 type-meta">
              Championship
            </span>
          </motion.div>

          <div className="flex items-center w-fit mx-auto">
            <div className="flex flex-col" style={{ gap: `${matchupGap * 2}px` }}>
              {renderHalf(topR1, 0.6)}
              {renderHalf(botR1, 0.75)}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="shrink-0 flex items-center"
            >
              <Connector heightPx={connectorSemi} />
              <HLine />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
            >
              <EmptySlot showTrophy />
            </motion.div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
