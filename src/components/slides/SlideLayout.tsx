"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { slideTransition, slideVariants } from "@/lib/motion";

type Pattern =
  | "grid"
  | "orbs"
  | "orbs-soft"
  | "orbs-ring"
  | "beams"
  | "beams-soft"
  | "wash"
  | "contour";

interface Props {
  children: ReactNode;
  accentColor: string;
  direction: number;
  mood?: "quiet" | "hero";
  pattern?: Pattern;
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getPatternStyles(
  accentColor: string,
  mood: "quiet" | "hero",
  pattern: Pattern
) {
  const hero = mood === "hero";
  const accentFog = withAlpha(accentColor, hero ? 0.2 : 0.11);
  const accentCore = withAlpha(accentColor, hero ? 0.24 : 0.14);
  const accentLine = withAlpha(accentColor, hero ? 0.12 : 0.07);
  const cyanGlow = hero ? "rgba(94, 214, 255, 0.14)" : "rgba(94, 214, 255, 0.08)";
  const violetGlow = hero ? "rgba(132, 121, 255, 0.1)" : "rgba(132, 121, 255, 0.06)";

  const baseBackground = `
    radial-gradient(42% 48% at 16% 14%, ${accentFog} 0%, transparent 70%),
    radial-gradient(30% 36% at 82% 18%, ${violetGlow} 0%, transparent 74%),
    radial-gradient(28% 30% at 50% 90%, ${withAlpha(accentColor, hero ? 0.06 : 0.035)} 0%, transparent 78%),
    linear-gradient(165deg, #08111e 0%, #050912 40%, #03050a 100%)
  `;

  const sharedStage = `
    radial-gradient(24% 30% at 34% 48%, ${accentCore} 0%, transparent 76%),
    radial-gradient(20% 26% at 72% 58%, ${cyanGlow} 0%, transparent 78%)
  `;

  const vignette = `
    radial-gradient(circle at 50% 50%, transparent 54%, rgba(1, 3, 8, 0.42) 100%)
  `;

  switch (pattern) {
    case "beams":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          linear-gradient(90deg, transparent 0%, ${withAlpha(accentColor, 0.06)} 24%, transparent 48%, ${withAlpha(
            accentColor,
            0.045
          )} 72%, transparent 100%)
        `,
        texture: {
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, ${accentLine} 12%, transparent 28%),
            linear-gradient(90deg, transparent 22%, ${withAlpha("#7dd3fc", 0.045)} 44%, transparent 64%),
            linear-gradient(90deg, transparent 56%, ${withAlpha(accentColor, 0.04)} 76%, transparent 92%)
          `,
          backgroundSize: "100% 100%, 68% 100%, 84% 100%",
          backgroundPosition: "center, left center, right center",
          maskImage: "radial-gradient(circle at center, black 32%, transparent 84%)",
        },
        veil: vignette,
      };
    case "beams-soft":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          linear-gradient(90deg, transparent 0%, ${withAlpha(accentColor, 0.045)} 30%, transparent 58%, ${withAlpha(
            "#7dd3fc",
            0.03
          )} 82%, transparent 100%)
        `,
        texture: {
          backgroundImage: `
            linear-gradient(90deg, transparent 10%, ${withAlpha(accentColor, 0.035)} 24%, transparent 40%),
            linear-gradient(90deg, transparent 42%, ${withAlpha("#7dd3fc", 0.028)} 56%, transparent 72%),
            linear-gradient(90deg, transparent 68%, ${withAlpha("#ffffff", 0.018)} 80%, transparent 92%)
          `,
          backgroundSize: "100% 100%, 88% 100%, 72% 100%",
          backgroundPosition: "center, center, center",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 84%)",
        },
        veil: vignette,
      };
    case "wash":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          linear-gradient(125deg, transparent 0%, ${withAlpha(accentColor, 0.045)} 28%, transparent 54%),
          linear-gradient(320deg, transparent 18%, ${withAlpha("#7dd3fc", 0.028)} 46%, transparent 68%)
        `,
        texture: {
          backgroundImage: `
            linear-gradient(125deg, transparent 0%, ${withAlpha("#ffffff", 0.018)} 26%, transparent 48%),
            linear-gradient(320deg, transparent 18%, ${withAlpha(accentColor, 0.024)} 44%, transparent 66%)
          `,
          backgroundSize: "100% 100%",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 84%)",
        },
        veil: vignette,
      };
    case "orbs":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          radial-gradient(15% 15% at 28% 30%, ${withAlpha(accentColor, 0.08)} 0%, transparent 72%),
          radial-gradient(20% 20% at 62% 36%, ${withAlpha("#9ae6b4", 0.07)} 0%, transparent 74%),
          radial-gradient(16% 16% at 76% 68%, ${withAlpha("#93c5fd", 0.07)} 0%, transparent 76%)
        `,
        texture: {
          backgroundImage: `
            radial-gradient(circle at 24% 28%, ${withAlpha("#ffffff", 0.035)} 0%, transparent 8%),
            radial-gradient(circle at 68% 34%, ${withAlpha(accentColor, 0.05)} 0%, transparent 12%),
            radial-gradient(circle at 76% 72%, ${withAlpha("#7dd3fc", 0.04)} 0%, transparent 10%),
            radial-gradient(circle at 38% 72%, ${withAlpha("#ffffff", 0.025)} 0%, transparent 9%)
          `,
          backgroundSize: "100% 100%",
          maskImage: "radial-gradient(circle at center, black 36%, transparent 86%)",
        },
        veil: vignette,
      };
    case "orbs-soft":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          radial-gradient(22% 22% at 22% 34%, ${withAlpha(accentColor, 0.06)} 0%, transparent 72%),
          radial-gradient(24% 24% at 74% 30%, ${withAlpha("#93c5fd", 0.055)} 0%, transparent 74%),
          radial-gradient(20% 20% at 54% 74%, ${withAlpha("#ffffff", 0.035)} 0%, transparent 76%)
        `,
        texture: {
          backgroundImage: `
            radial-gradient(circle at 22% 34%, ${withAlpha("#ffffff", 0.026)} 0%, transparent 9%),
            radial-gradient(circle at 72% 28%, ${withAlpha(accentColor, 0.038)} 0%, transparent 12%),
            radial-gradient(circle at 54% 72%, ${withAlpha("#7dd3fc", 0.03)} 0%, transparent 10%)
          `,
          backgroundSize: "100% 100%",
          maskImage: "radial-gradient(circle at center, black 36%, transparent 86%)",
        },
        veil: vignette,
      };
    case "orbs-ring":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          radial-gradient(34% 34% at 50% 44%, ${withAlpha(accentColor, 0.05)} 0%, transparent 72%),
          radial-gradient(18% 18% at 32% 70%, ${withAlpha("#93c5fd", 0.045)} 0%, transparent 74%)
        `,
        texture: {
          backgroundImage: `
            radial-gradient(circle at 50% 44%, transparent 0 22%, ${withAlpha(accentColor, 0.05)} 22.5%, transparent 24%),
            radial-gradient(circle at 50% 44%, transparent 0 34%, ${withAlpha("#7dd3fc", 0.03)} 34.5%, transparent 36%),
            radial-gradient(circle at 32% 70%, ${withAlpha("#ffffff", 0.024)} 0%, transparent 9%)
          `,
          backgroundSize: "100% 100%",
          maskImage: "radial-gradient(circle at center, black 34%, transparent 84%)",
        },
        veil: vignette,
      };
    case "contour":
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          radial-gradient(42% 48% at 52% 54%, ${withAlpha(accentColor, 0.045)} 0%, transparent 72%)
        `,
        texture: {
          backgroundImage: `
            repeating-radial-gradient(circle at 50% 52%, transparent 0 26px, ${accentLine} 26px 27px),
            repeating-radial-gradient(circle at 50% 52%, transparent 0 58px, ${withAlpha("#7dd3fc", 0.03)} 58px 59px)
          `,
          backgroundSize: "100% 100%",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 82%)",
        },
        veil: vignette,
      };
    case "grid":
    default:
      return {
        baseBackground,
        stage: `
          ${sharedStage},
          radial-gradient(38% 42% at 50% 56%, ${withAlpha(accentColor, 0.04)} 0%, transparent 76%)
        `,
        texture: {
          backgroundImage:
            "linear-gradient(rgba(180, 219, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 219, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "160px 160px",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 84%)",
        },
        veil: vignette,
      };
  }
}

export function SlideLayout({
  children,
  accentColor,
  direction,
  mood = "quiet",
  pattern = "grid",
}: Props) {
  const styles = getPatternStyles(accentColor, mood, pattern);

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="absolute inset-y-0 inset-x-0 md:-inset-x-[8%] grain overflow-hidden"
      style={{ background: styles.baseBackground }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: styles.stage }}
        animate={{
          scale: [1, 1.015, 1],
          x: ["-0.5%", "0.5%", "-0.5%"],
          y: ["-0.35%", "0.35%", "-0.35%"],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={styles.texture}
        animate={{ opacity: [0.18, 0.24, 0.18] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: styles.veil }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col items-center justify-center slide-scroll-region"
        style={{
          paddingTop: "max(2rem, calc(env(safe-area-inset-top, 0px) + 1rem))",
          paddingRight: "max(1.25rem, calc(env(safe-area-inset-right, 0px) + 1rem))",
          paddingBottom: "max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))",
          paddingLeft: "max(1.25rem, calc(env(safe-area-inset-left, 0px) + 1rem))",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
