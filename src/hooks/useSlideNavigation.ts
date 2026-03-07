"use client";

import { useState, useEffect, useCallback } from "react";

export function useSlideNavigation(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < totalSlides - 1) {
        setDirection(1);
        return prev + 1;
      }
      return prev;
    });
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        setDirection(-1);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
      }
    },
    [currentIndex, totalSlides]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setDirection(1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  return {
    currentIndex,
    direction,
    goNext,
    goPrev,
    goTo,
    reset,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalSlides - 1,
  };
}
