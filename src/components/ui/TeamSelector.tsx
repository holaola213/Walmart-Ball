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
  const [loadedLogos, setLoadedLogos] = useState<Record<number, boolean>>({});

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
      <h2 className="type-title-md text-white mb-2 text-center tracking-[0.04em] title-balance measure-medium">
        SEE YOUR PERSONAL STATS
      </h2>
      <p className="type-kicker text-white/30 mb-10 text-center">
        SELECT YOUR TEAM
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {data.standings.map((team) => (
          <motion.button
            key={team.teamId}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTeam(team.teamId)}
            className="rounded-2xl px-4 py-4 text-left transition-all group flex items-center gap-3 min-h-[108px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] hover:border-white/18 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]"
          >
            <div className="relative w-11 h-11 rounded-full bg-white/8 shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
              <span
                className={`absolute inset-0 flex items-center justify-center font-display text-sm text-white/55 leading-none transition-opacity duration-200 ${
                  loadedLogos[team.teamId] && !failedLogos[team.teamId] ? "opacity-0" : "opacity-100"
                }`}
              >
                {team.teamName.charAt(0).toUpperCase()}
              </span>

              {data.teamLogoMap[team.teamId] && !failedLogos[team.teamId] ? (
                <img
                  src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
                  alt=""
                  className={`absolute inset-0 w-11 h-11 rounded-full object-cover transition-opacity duration-200 ${
                    loadedLogos[team.teamId] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => {
                    setLoadedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                  }}
                  onError={() => {
                    setFailedLogos((prev) => ({ ...prev, [team.teamId]: true }));
                  }}
                />
              ) : null}
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

      <button
        onClick={onBack}
        className="mt-10 text-white/25 hover:text-white/50 type-kicker transition-colors"
      >
        BACK TO LEAGUE WRAPPED
      </button>
    </div>
  );
}
