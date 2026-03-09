"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { SLIDE_COLORS, getTeamLogoUrl } from "@/lib/constants";
import { SlideProps } from "./SlideContainer";

export function RivalrySlide({ data, direction }: SlideProps) {
  const rivalry = data.rivalry;
  if (!rivalry) return null;

  const accent = SLIDE_COLORS.rivalry;

  return (
    <SlideLayout accentColor={accent} direction={direction} pattern="contour">
      {/* Header */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-6"
        style={{ color: `${accent}80` }}
      >
        Rivalry of the Year
      </motion.p>

      {/* Team face-off: logos + VS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-5 mb-6"
      >
        {/* Team 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-30"
              style={{ background: accent }}
            />
            {data.teamLogoMap[rivalry.team1Id] ? (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[rivalry.team1Id])}
                alt={rivalry.team1Name}
                className="relative w-16 h-16 rounded-full object-cover border-2 bg-white/5"
                style={{
                  borderColor: `${accent}50`,
                  boxShadow: `0 0 20px ${accent}20`,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)" }}
              >
                <span className="font-display text-2xl text-white/55">
                  {rivalry.team1Name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <p className="text-white/65 text-[13px] font-medium text-center max-w-[14ch] leading-[1.25] break-words copy-pretty">
            {rivalry.team1Name}
          </p>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div
            className="w-px h-6 opacity-20"
            style={{ background: accent }}
          />
          <span
            className="font-display text-2xl"
            style={{ color: `${accent}40` }}
          >
            VS
          </span>
          <div
            className="w-px h-6 opacity-20"
            style={{ background: accent }}
          />
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-30"
              style={{ background: accent }}
            />
            {data.teamLogoMap[rivalry.team2Id] ? (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[rivalry.team2Id])}
                alt={rivalry.team2Name}
                className="relative w-16 h-16 rounded-full object-cover border-2 bg-white/5"
                style={{
                  borderColor: `${accent}50`,
                  boxShadow: `0 0 20px ${accent}20`,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)" }}
              >
                <span className="font-display text-2xl text-white/55">
                  {rivalry.team2Name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <p className="text-white/65 text-[13px] font-medium text-center max-w-[14ch] leading-[1.25] break-words copy-pretty">
            {rivalry.team2Name}
          </p>
        </div>
      </motion.div>

      {/* H2H Record - hero stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-2"
      >
        <div className="type-title-xl text-white tracking-[0.03em]">
          <span style={{ textShadow: `0 0 30px ${accent}30` }}>
            {rivalry.team1Wins}
          </span>
          <span className="text-white/15 mx-3">-</span>
          <span style={{ textShadow: `0 0 30px ${accent}30` }}>
            {rivalry.team2Wins}
          </span>
        </div>
        {rivalry.ties > 0 && (
          <p className="type-meta text-white/30 mt-1">
            {rivalry.ties} TIE{rivalry.ties !== 1 ? "S" : ""}
          </p>
        )}
      </motion.div>

      {/* Avg margin pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-4 py-1.5 rounded-full glass mb-6"
      >
        <span
          className="type-meta"
          style={{ color: `${accent}90` }}
        >
          AVG MARGIN: {rivalry.avgMargin.toFixed(1)} PTS
        </span>
      </motion.div>

      {/* Matchup history */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="w-full max-w-sm space-y-1"
      >
        {rivalry.matchups.map((m, i) => {
          const t1Won = m.team1Score > m.team2Score;
          const t2Won = m.team2Score > m.team1Score;
          return (
            <motion.div
              key={m.week}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: `${accent}06` }}
            >
              <span className="font-stat text-[11px] text-white/30 tracking-[0.12em] w-10 shrink-0">
                WK {m.week}
              </span>
              <span
                className={`font-stat text-[13px] flex-1 text-right ${
                  t1Won ? "text-white/70" : "text-white/30"
                }`}
                style={t1Won ? { color: `${accent}90` } : undefined}
              >
                {m.team1Score.toFixed(1)}
              </span>
              <span className="text-white/15 text-[12px] font-stat shrink-0">
                -
              </span>
              <span
                className={`font-stat text-[13px] flex-1 ${
                  t2Won ? "text-white/70" : "text-white/30"
                }`}
                style={t2Won ? { color: `${accent}90` } : undefined}
              >
                {m.team2Score.toFixed(1)}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </SlideLayout>
  );
}
