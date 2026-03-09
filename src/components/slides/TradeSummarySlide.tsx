"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function TradeSummarySlide({ data, direction }: SlideProps) {
  const trades = data.tradeSummary;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.trades} direction={direction} pattern="beams">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-6"
        style={{ color: `${SLIDE_COLORS.trades}C4` }}
      >
        Trade Summary
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <p className="type-number-xl font-bold text-[#72D5FF]" style={{ textShadow: "0 0 40px rgba(114, 213, 255, 0.3)" }}>
          {trades.totalTrades}
        </p>
        <p className="type-meta text-white/66 mt-3">
          {trades.totalTrades === 1 ? "Trade" : "Trades"} this season
        </p>
      </motion.div>

      {trades.totalTrades > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="type-meta text-white/68 mb-3"
          >
            Most Active Trader
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-strong rounded-xl px-6 py-4 text-center flex flex-col items-center"
            style={{ boxShadow: "0 0 20px rgba(114, 213, 255, 0.12)" }}
          >
            {data.teamLogoMap[trades.mostActiveTrader.teamId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[trades.mostActiveTrader.teamId])}
                alt=""
                className="w-10 h-10 rounded-full object-cover bg-white/10 mb-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold text-[15px] leading-[1.2] copy-pretty text-center measure-tight">
              {trades.mostActiveTrader.teamName}
            </p>
            <p className="font-stat text-[#72D5FF] text-[14px] mt-1 tracking-[0.08em]">
              {trades.mostActiveTrader.tradeCount} trades
            </p>
          </motion.div>
        </>
      )}

      {trades.totalTrades === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/76 text-[15px] leading-[1.45] text-center italic measure-medium copy-pretty"
        >
          No trades? Y&apos;all need to be more social.
        </motion.p>
      )}
    </SlideLayout>
  );
}
