"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { TeamWrappedData } from "@/lib/types";
import { formatOrdinal } from "@/lib/utils";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

function getDeltaColor(delta: number): string {
  if (delta > 0) return "#5ECF9B";
  if (delta < 0) return "#F28B82";
  return "#72D5FF";
}

export function PersonalDraftSlide({ team, direction }: Props) {
  const draftReview = team.draftReview;
  const bestValue = draftReview.bestValue;

  if (draftReview.picks.length === 0) {
    return (
      <SlideLayout
        accentColor={SLIDE_COLORS.personalDraft}
        direction={direction}
        pattern="wash"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="type-kicker text-[#F4C542]/80 mb-6"
        >
          Draft vs Reality
        </motion.p>
        <p className="text-white/40 text-center text-sm">
          No draft board data was available for this team.
        </p>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.personalDraft}
      direction={direction}
      pattern="wash"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#F4C542]/80 mb-5"
      >
        Draft vs Reality
      </motion.p>

      {bestValue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-strong rounded-2xl px-5 py-4 mb-4 max-w-xl w-full"
          style={{ boxShadow: "0 0 32px rgba(244, 197, 66, 0.12)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/6 flex items-center justify-center shrink-0">
              <img
                src={getPlayerHeadshotUrl(bestValue.playerId)}
                alt={bestValue.playerName}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-meta text-[#F4C542]/75 mb-1">Best Draft Value</p>
              <h3 className="text-white font-semibold text-[1.5rem] leading-[1.05] title-balance">
                {bestValue.playerName}
              </h3>
              <p className="text-white/44 text-[10px] tracking-[0.14em] uppercase mt-2">
                Pick {bestValue.draftPick} - Finished {bestValue.actualRank}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="font-stat text-[2rem] leading-none"
                style={{ color: getDeltaColor(bestValue.rankDelta) }}
              >
                {formatDelta(bestValue.rankDelta)}
              </p>
              <p className="type-meta text-white/26 mt-1">spots</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        className="w-full max-w-6xl grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5"
      >
        {draftReview.picks.map((pick) => (
          <div
            key={pick.playerId}
            className="glass rounded-xl px-3 py-2.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/6 flex items-center justify-center shrink-0">
              <img
                src={getPlayerHeadshotUrl(pick.playerId)}
                alt={pick.playerName}
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white/92 text-[12px] leading-tight copy-pretty truncate">
                {pick.playerName}
              </p>
              <p className="text-white/38 text-[9px] tracking-[0.12em] uppercase mt-1">
                {formatOrdinal(pick.draftPick)} pick -&gt; {formatOrdinal(pick.actualRank)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="font-stat text-[14px] leading-none"
                style={{ color: getDeltaColor(pick.rankDelta) }}
              >
                {formatDelta(pick.rankDelta)}
              </p>
              <p className="text-white/25 text-[9px] tracking-[0.14em] uppercase mt-1">
                spots
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </SlideLayout>
  );
}
