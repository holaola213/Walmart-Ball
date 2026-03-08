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
      className="flex items-center gap-2 w-[175px] md:w-[210px] h-[40px] md:h-[44px] rounded-lg px-2.5 md:px-3"
      style={{
        background: "linear-gradient(90deg, rgba(111, 174, 255, 0.18), rgba(15, 24, 38, 0.82))",
        border: "1px solid rgba(157, 208, 255, 0.3)",
      }}
    >
      <span
        className="font-stat text-[11px] md:text-[12px] shrink-0 w-6 text-right"
        style={{ color: `${accentColor}C7` }}
      >
        #{team.rank}
      </span>
      {team.logo ? (
        <img
          src={getTeamLogoUrl(team.logo)}
          alt=""
          className="w-6 h-6 rounded-full object-cover bg-white/10 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 shrink-0 flex items-center justify-center">
          <span className="text-white/82 text-[10px] font-display">{team.teamName.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/92 text-[11px] md:text-[12px] font-medium truncate leading-tight">
          {team.teamName}
        </p>
        <p className="text-white/72 text-[10px] font-stat leading-tight">
          {team.wins}-{team.losses}
        </p>
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      className="flex items-center justify-center gap-1 w-[175px] md:w-[210px] h-[40px] md:h-[44px] rounded-lg"
      style={{
        background: "rgba(15, 24, 38, 0.72)",
        border: "1px dashed rgba(162, 206, 255, 0.3)",
      }}
    >
      <span className="font-stat text-[10px] text-white/58">TBD</span>
    </div>
  );
}

function Connector({ heightPx }: { heightPx: number }) {
  const border = "1px solid rgba(255, 255, 255, 0.12)";
  return (
    <div className="flex flex-col shrink-0" style={{ width: "18px" }}>
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

export function ConsolationBracketSlide({ data, direction }: SlideProps) {
  const accentColor = SLIDE_COLORS.consolationBracket;
  const seeds = data.standings.slice(8, 12);

  // ESPN order: higher seed (worse) on top
  const matchups = [
    [seeds[1], seeds[0]], // #10 vs #9
    [seeds[3], seeds[2]], // #12 vs #11
  ];

  const cellH = 40;
  const pairGap = 4;
  const matchupGap = 18;
  const pairH = cellH * 2 + pairGap;
  const connectorH = pairH + matchupGap;

  return (
    <SlideLayout accentColor={accentColor} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-2"
        style={{ color: `${accentColor}80` }}
      >
        Projected
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="type-title-md text-white text-center mb-1 title-balance"
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        CONSOLATION BRACKET
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="type-meta text-white/66 mb-6"
      >
        Seeds 9-12
      </motion.p>

      <div className="w-full overflow-x-auto custom-scrollbar pb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex items-center mb-2 min-w-[420px] mx-auto"
        >
          <span className="w-[175px] md:w-[210px] text-center text-white/65 type-meta">
            Round 1
          </span>
          <span className="w-[30px] shrink-0" />
          <span className="w-[175px] md:w-[210px] text-center text-white/65 type-meta">
            Finals
          </span>
        </motion.div>

        <div className="flex items-center min-w-[420px] mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
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
            transition={{ delay: 0.9 }}
            className="shrink-0 flex items-center"
          >
            <Connector heightPx={connectorH} />
            <HLine />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <EmptySlot />
          </motion.div>
        </div>
      </div>
    </SlideLayout>
  );
}
