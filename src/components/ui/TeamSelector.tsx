"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WrappedData } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/constants";

interface Props {
  data: WrappedData;
  onSelectTeam: (teamId: number) => void;
  onBack: () => void;
}

export function TeamSelector({ data, onSelectTeam, onBack }: Props) {
  const [failedLogos, setFailedLogos] = useState<Record<number, boolean>>({});

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-6 grain"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(139, 157, 255, 0.12) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="type-title-md text-white mb-2 text-center tracking-[0.04em] title-balance measure-medium"
      >
        SEE YOUR PERSONAL STATS
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-white/30 mb-10 text-center"
      >
        SELECT YOUR TEAM
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {data.standings.map((team, i) => (
          <motion.button
            key={team.teamId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.035, duration: 0.35 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTeam(team.teamId)}
            className="rounded-2xl px-4 py-4 text-left transition-all group flex items-center gap-3 min-h-[108px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] hover:border-white/18 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]"
          >
            <div className="w-11 h-11 rounded-full bg-white/8 shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
              {data.teamLogoMap[team.teamId] && !failedLogos[team.teamId] ? (
                <img
                  src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover"
                  onError={() => {
                    setFailedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                  }}
                />
              ) : (
                <span className="font-display text-sm text-white/55 leading-none">
                  {team.teamName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-[15px] leading-[1.22] break-words group-hover:text-[#8B9DFF] transition-colors copy-pretty">
                {team.teamName}
              </p>
              <div className="w-8 h-px bg-white/10 my-2" />
              <p className="text-white/40 text-[12px] font-stat mt-0.5 tracking-[0.08em]">
                {team.wins}-{team.losses}
                {team.ties > 0 ? `-${team.ties}` : ""}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onBack}
        className="mt-10 text-white/25 hover:text-white/50 type-kicker transition-colors"
      >
        BACK TO LEAGUE WRAPPED
      </motion.button>
    </div>
  );
}
