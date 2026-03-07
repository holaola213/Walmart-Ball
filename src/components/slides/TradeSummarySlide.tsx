"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function TradeSummarySlide({ data, direction }: SlideProps) {
  const trades = data.tradeSummary;

  return (
    <SlideLayout accentColor={SLIDE_COLORS.trades} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-cyan-400/50 text-xs uppercase tracking-[0.5em] mb-6"
      >
        Trade Summary
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <p className="font-stat text-7xl font-bold text-cyan-400" style={{ textShadow: "0 0 40px rgba(6, 182, 212, 0.3)" }}>
          {trades.totalTrades}
        </p>
        <p className="text-white/25 text-[10px] font-stat mt-3 tracking-widest uppercase">
          {trades.totalTrades === 1 ? "Trade" : "Trades"} this season
        </p>
      </motion.div>

      {trades.totalTrades > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/30 text-[10px] font-stat uppercase tracking-[0.3em] mb-3"
          >
            Most Active Trader
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-strong rounded-xl px-6 py-4 text-center flex flex-col items-center"
            style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.08)" }}
          >
            {data.teamLogoMap[trades.mostActiveTrader.teamId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[trades.mostActiveTrader.teamId])}
                alt=""
                className="w-10 h-10 rounded-full object-cover bg-white/10 mb-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <p className="text-white font-semibold">
              {trades.mostActiveTrader.teamName}
            </p>
            <p className="font-stat text-cyan-400 text-sm mt-1 tracking-wider">
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
          className="text-white/30 text-sm text-center italic"
        >
          No trades? Y&apos;all need to be more social.
        </motion.p>
      )}
    </SlideLayout>
  );
}
