"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function StatNumber({
  value,
  decimals = 1,
  duration = 1500,
  delay = 300,
  className = "",
  prefix = "",
  suffix = "",
}: Props) {
  const animated = useAnimatedNumber(value, duration, delay);

  return (
    <span className={className}>
      {prefix}
      {animated.toFixed(decimals)}
      {suffix}
    </span>
  );
}
