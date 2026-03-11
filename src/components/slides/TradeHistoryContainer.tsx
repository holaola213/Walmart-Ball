"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PALETTE, SLIDE_COLORS } from "@/lib/constants";
import { WrappedData } from "@/lib/types";
import { SlideLayout } from "./SlideLayout";
import { TradeHistorySlide } from "./TradeHistorySlide";

interface Props {
  data: WrappedData;
  onHome?: () => void;
}

function EmptyTradesSlide({ direction }: { direction: number }) {
  return (
    <SlideLayout accentColor={SLIDE_COLORS.trades} direction={direction} pattern="grid">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker mb-5"
        style={{ color: `${SLIDE_COLORS.trades}C4` }}
      >
        Trade History
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="type-title-md text-white text-center mb-4"
      >
        No trades logged
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.46 }}
        className="text-white/45 text-center max-w-lg"
      >
        ESPN did not return any completed league trades for this season.
      </motion.p>
    </SlideLayout>
  );
}

export function TradeHistoryContainer({ data, onHome }: Props) {
  const totalSlides = Math.max(data.allTradesChronological.length, 1);
  const { currentIndex, direction, goNext, goPrev, isLast } =
    useSlideNavigation(totalSlides);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select, [role='button']")) return;

    const clickedRightSide = e.clientX >= window.innerWidth / 2;

    if (clickedRightSide) {
      if (!isLast) {
        goNext();
      }
    } else if (currentIndex > 0) {
      goPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none app-screen touch-manipulation"
      style={{ background: PALETTE.background }}
      onClick={handleClick}
    >
      <ProgressBar current={currentIndex} total={totalSlides} />

      {onHome && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHome();
          }}
          className="screen-action fixed z-50 inline-flex h-9 items-center gap-2 rounded-full glass px-2.5 text-white/68 transition-all hover:bg-white/[0.12] hover:text-white sm:h-10 sm:px-3"
          aria-label="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 8.5V16H8.5V12H11.5V16H15V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="type-meta text-current">Home</span>
        </button>
      )}

      <AnimatePresence mode="sync" initial={false} custom={direction}>
        {data.allTradesChronological.length > 0 ? (
          <TradeHistorySlide
            key={data.allTradesChronological[currentIndex].tradeId}
            data={data}
            trade={data.allTradesChronological[currentIndex]}
            index={currentIndex}
            total={data.allTradesChronological.length}
            direction={direction}
          />
        ) : (
          <EmptyTradesSlide key="empty-trades" direction={direction} />
        )}
      </AnimatePresence>
    </div>
  );
}
