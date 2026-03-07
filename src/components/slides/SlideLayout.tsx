"use client";

import { motion, Variants } from "framer-motion";

interface Props {
  children: React.ReactNode;
  accentColor: string;
  direction: number;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function SlideLayout({ children, accentColor, direction }: Props) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 grain"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, ${accentColor}18 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, ${accentColor}10 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${accentColor}08 0%, transparent 70%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accentColor}30, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}40, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}
