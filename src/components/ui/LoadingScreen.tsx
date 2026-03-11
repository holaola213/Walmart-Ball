"use client";

import { motion } from "framer-motion";

interface Props {
  progress: number;
  status: string;
}

const statusMessages: Record<string, string> = {
  loading: "Fetching your league data...",
  processing: "Crunching the numbers...",
};

export function LoadingScreen({ progress, status }: Props) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center grain app-screen safe-screen-padding"
      style={{
        background: `
          radial-gradient(ellipse at 50% 40%, rgba(114, 213, 255, 0.12) 0%, transparent 60%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      {/* Bouncing basketball */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#F28A2E" stroke="#8F4516" strokeWidth="2" />
          <path d="M32 2C32 2 32 62 32 62" stroke="#8F4516" strokeWidth="1.5" />
          <path d="M2 32C2 32 62 32 62 32" stroke="#8F4516" strokeWidth="1.5" />
          <path d="M8 12C20 20 44 20 56 12" stroke="#8F4516" strokeWidth="1.5" fill="none" />
          <path d="M8 52C20 44 44 44 56 52" stroke="#8F4516" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>

      {/* Status text */}
      <motion.p
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/55 text-[15px] leading-[1.35] copy-pretty measure-medium text-center"
      >
        {statusMessages[status] || "Loading..."}
      </motion.p>

      {/* Progress bar */}
      <div className="w-64 relative">
        <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              background: "linear-gradient(90deg, #72D5FF, #8B9DFF)",
              boxShadow: "0 0 16px rgba(114, 213, 255, 0.35)",
            }}
          />
        </div>
        <p className="text-white/25 type-meta text-right mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
