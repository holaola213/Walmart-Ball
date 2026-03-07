"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";
import { getTeamLogoUrl, SUPERLATIVE_COLORS } from "@/lib/constants";
import { Superlative } from "@/lib/types";
import { RunnersUpList } from "@/components/ui/RunnersUpList";

interface Props {
  award: Superlative;
  index: number;
  teamLogoMap: Record<number, string>;
  direction: number;
}

export function SuperlativeSlide({ award, index, teamLogoMap, direction }: Props) {
  const accentColor = SUPERLATIVE_COLORS[index % SUPERLATIVE_COLORS.length];
  const teams = award.tiedTeams || [{ teamName: award.teamName, teamId: award.teamId }];
  const isTied = teams.length > 1;
  const isHeartbreakDetailed = isTied && award.closeLossMatchups && Object.keys(award.closeLossMatchups).length > 0;
  const isNailBiterDetailed = !isTied && award.closeGameMatchups && award.closeGameMatchups.length > 0;

  return (
    <SlideLayout accentColor={accentColor} direction={direction}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-stat text-xs uppercase tracking-[0.5em] mb-4"
        style={{ color: `${accentColor}80` }}
      >
        Award
      </motion.p>

      {/* Team logo(s) — hidden for detailed views */}
      {!isHeartbreakDetailed && !isNailBiterDetailed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className={`mb-6 relative flex ${isTied ? "gap-4" : ""}`}
        >
          {!isTied && (
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
            />
          )}
          {teams.map((t) => {
            const logo = teamLogoMap[t.teamId];
            return logo ? (
              <img
                key={t.teamId}
                src={getTeamLogoUrl(logo)}
                alt={t.teamName}
                className={`relative rounded-full object-cover border-2 ${isTied ? "w-16 h-16" : "w-24 h-24"}`}
                style={{
                  borderColor: `${accentColor}60`,
                  boxShadow: `0 0 30px ${accentColor}30`,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                key={t.teamId}
                className={`relative rounded-full flex items-center justify-center border-2 ${isTied ? "w-16 h-16" : "w-24 h-24"}`}
                style={{
                  borderColor: `${accentColor}60`,
                  background: `${accentColor}15`,
                }}
              >
                <span className={`font-display text-white/60 ${isTied ? "text-2xl" : "text-3xl"}`}>
                  {t.teamName.charAt(0)}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Award title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`font-display text-white text-center ${isHeartbreakDetailed || isNailBiterDetailed ? "text-4xl md:text-5xl mb-1" : "text-5xl md:text-6xl lg:text-7xl"}`}
        style={{ textShadow: `0 0 40px ${accentColor}30` }}
      >
        {award.title}
      </motion.h2>

      {/* Subtitle / description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`text-white/40 text-sm text-center max-w-md ${isHeartbreakDetailed || isNailBiterDetailed ? "mt-1 mb-3" : "mt-3"}`}
      >
        {award.subtitle}
      </motion.p>

      {/* Heartbreak Kid detailed view — scrollable list of each team's close losses */}
      {isHeartbreakDetailed && award.closeLossMatchups ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-2 w-full max-w-md max-h-[55vh] overflow-y-auto space-y-2 pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${accentColor}30 transparent`,
          }}
        >
          {teams.map((t, ti) => {
            const matchups = award.closeLossMatchups![t.teamId] || [];
            const logo = teamLogoMap[t.teamId];
            return (
              <motion.div
                key={t.teamId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.95 + ti * 0.08 }}
                className="glass rounded-xl px-4 py-3"
              >
                {/* Team header */}
                <div className="flex items-center gap-2.5 mb-2">
                  {logo ? (
                    <img
                      src={getTeamLogoUrl(logo)}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border"
                      style={{ borderColor: `${accentColor}40` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border"
                      style={{ borderColor: `${accentColor}40`, background: `${accentColor}15` }}
                    >
                      <span className="font-display text-white/50 text-sm">{t.teamName.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-display text-base leading-tight"
                      style={{ color: accentColor }}
                    >
                      {t.teamName}
                    </p>
                    <p className="font-stat text-[10px] text-white/30 tracking-wider">
                      {matchups.length} CLOSE LOSS{matchups.length !== 1 ? "ES" : ""}
                    </p>
                  </div>
                </div>
                {/* Matchup list */}
                <div className="space-y-1">
                  {matchups.map((mu, mi) => (
                    <div key={mi} className="flex items-center text-[11px] font-stat gap-2 px-1">
                      <span className="text-white/20 w-10 shrink-0 tracking-wider">WK {mu.week}</span>
                      <span className="text-red-400/80">{mu.score.toFixed(1)}</span>
                      <span className="text-white/15">-</span>
                      <span className="text-white/40">{mu.oppScore.toFixed(1)}</span>
                      <span className="text-red-400/50 text-[9px] shrink-0">(-{(mu.oppScore - mu.score).toFixed(1)})</span>
                      <span className="text-white/15 text-[10px]">vs</span>
                      <span className="text-white/25 text-[10px] truncate">{mu.oppName}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : isNailBiterDetailed && award.closeGameMatchups ? (
        /* Nail Biter King — winner's close games + runners-up */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-4 w-full max-w-md max-h-[55vh] overflow-y-auto pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${accentColor}30 transparent`,
          }}
        >
          {/* Winner card with matchup details */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95 }}
            className="glass rounded-xl px-4 py-3 mb-3"
          >
            <div className="flex items-center gap-2.5 mb-2">
              {(() => {
                const logo = teamLogoMap[award.teamId];
                return logo ? (
                  <img
                    src={getTeamLogoUrl(logo)}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border-2"
                    style={{ borderColor: `${accentColor}50`, boxShadow: `0 0 15px ${accentColor}20` }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: `${accentColor}50`, background: `${accentColor}15` }}
                  >
                    <span className="font-display text-white/50 text-base">{award.teamName.charAt(0)}</span>
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-tight" style={{ color: accentColor }}>
                  {award.teamName}
                </p>
                <p className="font-stat text-[10px] text-white/30 tracking-wider">
                  {award.closeGameMatchups.length} CLOSE GAME{award.closeGameMatchups.length !== 1 ? "S" : ""}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              {award.closeGameMatchups.map((mu, mi) => (
                <div key={mi} className="flex items-center text-[11px] font-stat gap-2 px-1">
                  <span className="text-white/20 w-10 shrink-0 tracking-wider">WK {mu.week}</span>
                  <span className={mu.won ? "text-green-400/80" : "text-red-400/80"}>{mu.score.toFixed(1)}</span>
                  <span className="text-white/15">-</span>
                  <span className="text-white/40">{mu.oppScore.toFixed(1)}</span>
                  <span className={`text-[9px] font-bold tracking-wider ${mu.won ? "text-green-400/50" : "text-red-400/50"}`}>
                    {mu.won ? "W" : "L"}
                  </span>
                  <span className="text-white/25 text-[10px] truncate">{mu.oppName}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Runners-up */}
          {award.runnersUp && award.runnersUp.length > 0 && (
            <RunnersUpList
              accentColor={accentColor}
              delay={1.1}
              items={award.runnersUp.map((r) => ({
                label: r.teamName,
                value: r.detail,
                avatarUrl: teamLogoMap[r.teamId] ? getTeamLogoUrl(teamLogoMap[r.teamId]) : undefined,
              }))}
            />
          )}
        </motion.div>
      ) : (
        <>
          {/* Default team name(s) layout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`mt-8 ${isTied ? "flex flex-wrap gap-3 justify-center" : ""}`}
          >
            {teams.map((t) => (
              <div key={t.teamId} className="glass rounded-xl px-6 py-4 text-center">
                <p
                  className={`font-display ${isTied ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}
                  style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}
                >
                  {t.teamName}
                </p>
                {!isTied && (
                  <>
                    <p className="mt-2 font-stat text-white/50 text-sm tracking-wider">
                      {award.detail}
                    </p>
                    {award.enrichedDetail && (
                      <p className="mt-1 font-stat text-white/30 text-xs tracking-wider">
                        {award.enrichedDetail}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
            {isTied && (
              <p className="w-full mt-2 font-stat text-white/50 text-sm tracking-wider text-center">
                {award.detail} each
              </p>
            )}
          </motion.div>

          {award.runnersUp && award.runnersUp.length > 0 && (
            <RunnersUpList
              accentColor={accentColor}
              delay={1.1}
              items={award.runnersUp.map((r) => ({
                label: r.teamName,
                value: r.detail,
                avatarUrl: teamLogoMap[r.teamId] ? getTeamLogoUrl(teamLogoMap[r.teamId]) : undefined,
              }))}
            />
          )}
        </>
      )}
    </SlideLayout>
  );
}
