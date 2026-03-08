"use client";

import { motion } from "framer-motion";
import { slideTransition, slideVariants } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  accentColor: string;
  direction: number;
  mood?: "quiet" | "hero";
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SlideLayout({ children, accentColor, direction, mood = "quiet" }: Props) {
  const accentFog = withAlpha(accentColor, mood === "hero" ? 0.28 : 0.18);
  const accentCore = withAlpha(accentColor, mood === "hero" ? 0.5 : 0.34);
  const cyanGlow = mood === "hero" ? "rgba(70, 233, 255, 0.26)" : "rgba(70, 233, 255, 0.18)";
  const magentaGlow = mood === "hero" ? "rgba(212, 107, 255, 0.24)" : "rgba(212, 107, 255, 0.16)";

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 grain"
      style={{
        background: `
          radial-gradient(58% 64% at 18% -8%, ${accentFog} 0%, transparent 62%),
          radial-gradient(46% 52% at 86% -14%, ${magentaGlow} 0%, transparent 66%),
          linear-gradient(165deg, #0a1220 0%, #070c16 36%, #04070f 100%)
        `,
      }}
    >
      <motion.div
        className="absolute -left-[20%] -top-[30%] w-[65vw] h-[65vw] rounded-full blur-[90px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentCore} 0%, transparent 68%)` }}
        animate={{
          x: ["-6%", "8%", "-6%"],
          y: ["-4%", "6%", "-4%"],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[26%] -bottom-[36%] w-[62vw] h-[62vw] rounded-full blur-[100px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${cyanGlow} 0%, transparent 72%)` }}
        animate={{
          x: ["4%", "-8%", "4%"],
          y: ["4%", "-6%", "4%"],
          scale: [1.06, 1, 1.06],
        }}
        transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px opacity-45 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${withAlpha(accentColor, 0.72)}, transparent)`,
        }}
      />

      <div
        className="absolute top-0 left-0 w-36 h-36 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(accentColor, 0.44)}, transparent 72%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-56 h-56 opacity-[0.16] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${withAlpha(accentColor, 0.34)}, transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180, 219, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 219, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "140px 140px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 58%, rgba(1, 3, 8, 0.46) 100%)",
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
