"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { RunnersUpList } from "@/components/ui/RunnersUpList";
import { SlideProps } from "./SlideContainer";

function formatGameLabel(scoringPeriodId: number, matchupPeriod?: number) {
  if (matchupPeriod) {
    return `Week ${matchupPeriod}`;
  }

  return scoringPeriodId > 0 ? "Single Game" : "";
}

export function WorstFantasyGameSlide({ data, direction }: SlideProps) {
  const worstGame = data.worstFantasyGame;
  const worstGameLabel = formatGameLabel(
    worstGame.scoringPeriodId,
    worstGame.matchupPeriod
  );

  return (
    <SlideLayout accentColor={SLIDE_COLORS.worstGame} direction={direction} pattern="wash">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#FF9A7A]/80 mb-6"
      >
        Worst Fantasy Game
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.84 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ boxShadow: "0 0 40px rgba(255, 154, 122, 0.12)" }}
      >
        {worstGame.playerId > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-30"
                style={{ background: "#FF9A7A" }}
              />
              <img
                src={getPlayerHeadshotUrl(worstGame.playerId)}
                alt={worstGame.playerName}
                className="relative w-24 h-24 rounded-full object-cover bg-white/10 border"
                style={{ borderColor: "rgba(255, 154, 122, 0.35)" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}
        <div className="type-meta text-[#FF9A7A]/80 mb-2">
          {worstGame.position}
        </div>
        <h3 className="type-title-md text-white mb-2 title-balance measure-medium mx-auto">
          {worstGame.playerName}
        </h3>
        <p className="text-white/35 text-[14px] leading-[1.35] mb-3 copy-pretty">
          On {worstGame.teamName}
        </p>
        {worstGameLabel && (
          <p className="font-stat text-[11px] md:text-[12px] tracking-[0.14em] uppercase text-white/45 mb-6">
            {worstGameLabel}
          </p>
        )}
        <div
          className="type-number-lg font-bold text-[#FF9A7A]"
          style={{ textShadow: "0 0 30px rgba(255, 154, 122, 0.3)" }}
        >
          <StatNumber value={worstGame.points} decimals={1} />
        </div>
        <p className="type-meta text-white/25 mt-2">Fantasy points in one game</p>
      </motion.div>

      {data.worstFantasyGameRunnersUp.length > 0 && (
        <RunnersUpList
          accentColor={SLIDE_COLORS.worstGame}
          columns={2}
          delay={1.0}
          items={data.worstFantasyGameRunnersUp.map((game) => ({
            label: game.playerName,
            sublabel: [game.teamName, formatGameLabel(game.scoringPeriodId, game.matchupPeriod)]
              .filter(Boolean)
              .join(" - "),
            value: `${game.points.toFixed(1)} pts`,
            avatarUrl: game.playerId > 0 ? getPlayerHeadshotUrl(game.playerId) : undefined,
          }))}
        />
      )}
    </SlideLayout>
  );
}
