import type { Transition, Variants } from "framer-motion";

export const MOTION = {
  intro: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  },
  reveal: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  },
  hero: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 210, damping: 24 } satisfies Transition,
  },
};

export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "6%" : "-6%",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-6%" : "6%",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  }),
};

export const slideTransition: Transition = {
  duration: 0.56,
  ease: [0.22, 1, 0.36, 1],
};
