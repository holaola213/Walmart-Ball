"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl, getTeamLogoUrl } from "@/lib/constants";
import { WrappedData, UnfairTradeRecord } from "@/lib/types";

interface Props {
  data: WrappedData;
  direction: number;
  trade: UnfairTradeRecord;
  rank: number;
}

function formatTradeLabel(trade: UnfairTradeRecord) {
  if (trade.week) {
    return `Week ${trade.week}`;
  }

  if (trade.tradeDate) {
    return trade.tradeDate;
  }

  return "Post-trade results";
}

function TradeSide({
  side,
  label,
  color,
  logoUrl,
}: {
  side: UnfairTradeRecord["winner"];
  label: string;
  color: string;
  logoUrl?: string;
}) {
  return (
    <div
      className="glass-strong rounded-2xl px-5 py-5 md:px-6 md:py-6"
      style={{ boxShadow: `0 0 24px ${color}1F` }}
    >
      <div className="flex items-center gap-3 mb-4">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="w-11 h-11 rounded-full object-cover bg-white/10 border"
            style={{ borderColor: `${color}3A` }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center bg-white/6"
            style={{ borderColor: `${color}24` }}
          >
            <span className="font-display text-[14px] text-white/55">
              {side.teamName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="type-meta mb-1" style={{ color }}>
            {label}
          </p>
          <p className="text-white font-semibold text-[15px] leading-tight copy-pretty">
            {side.teamName}
          </p>
        </div>
      </div>

      <div
        className="font-stat font-bold text-[2rem] tracking-[-0.05em] mb-4"
        style={{ color, textShadow: `0 0 24px ${color}33` }}
      >
        {side.totalPoints.toFixed(1)}
      </div>

      <div className="space-y-2.5">
        {side.playersReceived.map((player) => (
          <div
            key={`${side.teamId}-${player.playerId}`}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/6 flex items-center justify-center shrink-0">
              {player.playerId > 0 ? (
                <img
                  src={getPlayerHeadshotUrl(player.playerId)}
                  alt={player.playerName}
                  className="w-9 h-9 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="font-display text-[12px] text-white/55">
                  {player.playerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white/92 text-[14px] leading-tight copy-pretty">
                {player.playerName}
              </p>
              <p className="text-white/45 text-[10px] mt-0.5 tracking-[0.14em] uppercase">
                {player.position}
              </p>
            </div>
            <p className="font-stat text-[12px] tracking-[0.08em]" style={{ color }}>
              {player.pointsAfterTrade.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UnfairTradeSlide({ data, direction, trade, rank }: Props) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.trades} direction={direction} pattern="grid">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-4"
        style={{ color: `${SLIDE_COLORS.trades}C4` }}
      >
        Most Unfair Trade
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="type-title-md text-white text-center mb-2"
      >
        #{rank} biggest post-trade swing
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.46 }}
        className="type-meta text-white/38 mb-7"
      >
        {formatTradeLabel(trade)}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55 }}
        className="w-full max-w-6xl grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center"
      >
        <TradeSide
          side={trade.winner}
          label="Won the trade"
          color="#5ECF9B"
          logoUrl={
            data.teamLogoMap[trade.winner.teamId]
              ? getTeamLogoUrl(data.teamLogoMap[trade.winner.teamId])
              : undefined
          }
        />

        <div className="px-2 text-center">
          <p className="type-meta text-white/28 mb-2">Gap</p>
          <p
            className="font-stat font-bold text-[clamp(1.8rem,4vw,2.6rem)] tracking-[-0.05em]"
            style={{ color: "#72D5FF", textShadow: "0 0 24px rgba(114, 213, 255, 0.25)" }}
          >
            +{trade.pointGap.toFixed(1)}
          </p>
          <p className="type-meta text-white/28 mt-2">post-trade pts</p>
        </div>

        <TradeSide
          side={trade.loser}
          label="Lost the trade"
          color="#F28B82"
          logoUrl={
            data.teamLogoMap[trade.loser.teamId]
              ? getTeamLogoUrl(data.teamLogoMap[trade.loser.teamId])
              : undefined
          }
        />
      </motion.div>
    </SlideLayout>
  );
}
