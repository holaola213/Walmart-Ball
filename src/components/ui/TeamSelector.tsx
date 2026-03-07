"use client";

import { motion } from "framer-motion";
import { WrappedData } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/constants";

interface Props {
  data: WrappedData;
  onSelectTeam: (teamId: number) => void;
  onBack: () => void;
}

export function TeamSelector({ data, onSelectTeam, onBack }: Props) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-6 grain"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl text-white mb-2 text-center tracking-wide"
      >
        SEE YOUR PERSONAL STATS
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/30 mb-8 text-center text-xs font-stat tracking-widest"
      >
        SELECT YOUR TEAM
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-w-2xl w-full">
        {data.standings.map((team, i) => (
          <motion.button
            key={team.teamId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTeam(team.teamId)}
            className="glass hover:bg-white/[0.1] hover:border-white/20 rounded-xl p-4 text-left transition-all group flex items-center gap-3"
          >
            {data.teamLogoMap[team.teamId] && (
              <img
                src={getTeamLogoUrl(data.teamLogoMap[team.teamId])}
                alt=""
                className="w-10 h-10 rounded-full object-cover bg-white/10 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight break-words group-hover:text-violet-400 transition-colors">
                {team.teamName}
              </p>
              <p className="text-white/25 text-xs font-stat mt-0.5">
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
        className="mt-8 text-white/25 hover:text-white/50 text-xs font-stat tracking-widest transition-colors"
      >
        BACK TO LEAGUE WRAPPED
      </motion.button>
    </div>
  );
}
