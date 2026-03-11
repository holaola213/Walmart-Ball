"use client";

import { motion } from "framer-motion";

interface Props {
  error: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: Props) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center grain app-screen safe-screen-padding"
      style={{
        background: `
          radial-gradient(ellipse at 50% 40%, rgba(239, 68, 68, 0.06) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#EF4444" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M22 22L42 42M42 22L22 42" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
      <h2 className="font-display text-3xl text-white tracking-wide">SOMETHING WENT WRONG</h2>
      <p className="text-white/40 text-center max-w-md text-sm">{error}</p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRetry}
        className="mt-4 px-8 py-3 glass hover:bg-white/[0.1] text-white rounded-full transition-colors font-medium text-sm tracking-wider"
      >
        Try Again
      </motion.button>
    </div>
  );
}
