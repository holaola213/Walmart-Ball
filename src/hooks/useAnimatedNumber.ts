"use client";

import { useState, useEffect, useRef } from "react";

export function useAnimatedNumber(
  target: number,
  duration: number = 1500,
  delay: number = 300
) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay]);

  return current;
}
