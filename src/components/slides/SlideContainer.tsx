"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WrappedData } from "@/lib/types";

import { WelcomeSlide } from "./WelcomeSlide";
import { StandingsSlide } from "./StandingsSlide";
import { ChampionSlide } from "./ChampionSlide";
import { MvpPlayerSlide } from "./MvpPlayerSlide";
import { BestWeekSlide } from "./BestWeekSlide";
import { WorstWeekSlide } from "./WorstWeekSlide";
import { BiggestBlowoutSlide } from "./BiggestBlowoutSlide";
import { ClosestMatchupSlide } from "./ClosestMatchupSlide";
import { MostConsistentSlide } from "./MostConsistentSlide";
import { BoomOrBustSlide } from "./BoomOrBustSlide";
import { TradeSummarySlide } from "./TradeSummarySlide";
import { WaiverMvpSlide } from "./WaiverMvpSlide";
import { CategoryLeadersSlide } from "./CategoryLeadersSlide";
import { SuperlativeSlide } from "./SuperlativeSlide";
import { RivalrySlide } from "./RivalrySlide";
import { OutroSlide } from "./OutroSlide";
import { WinnersBracketSlide } from "./WinnersBracketSlide";
import { ConsolationBracketSlide } from "./ConsolationBracketSlide";

export interface SlideProps {
  data: WrappedData;
  direction: number;
}

type SlideEntry =
  | { type: "component"; component: React.ComponentType<SlideProps>; id: string }
  | { type: "superlative"; index: number; id: string };

const STATIC_SLIDES_BEFORE: SlideEntry[] = [
  { type: "component", component: WelcomeSlide, id: "welcome" },
  { type: "component", component: StandingsSlide, id: "standings" },
  { type: "component", component: ChampionSlide, id: "champion" },
  { type: "component", component: MvpPlayerSlide, id: "mvp" },
  { type: "component", component: BestWeekSlide, id: "bestWeek" },
  { type: "component", component: WorstWeekSlide, id: "worstWeek" },
  { type: "component", component: BiggestBlowoutSlide, id: "blowout" },
  { type: "component", component: ClosestMatchupSlide, id: "closest" },
  { type: "component", component: MostConsistentSlide, id: "consistent" },
  { type: "component", component: BoomOrBustSlide, id: "boomBust" },
  { type: "component", component: TradeSummarySlide, id: "trades" },
  { type: "component", component: WaiverMvpSlide, id: "waiverMvp" },
];

const CATEGORIES_SLIDE: SlideEntry = {
  type: "component",
  component: CategoryLeadersSlide,
  id: "categories",
};

const OUTRO_SLIDE: SlideEntry = {
  type: "component",
  component: OutroSlide,
  id: "outro",
};

interface Props {
  data: WrappedData;
  onFinished: () => void;
  onHome?: () => void;
}

export function SlideContainer({ data, onFinished, onHome }: Props) {
  const slides = useMemo(() => {
    const result: SlideEntry[] = [...STATIC_SLIDES_BEFORE];

    // Add rivalry slide if applicable
    if (data.rivalry) {
      result.push({ type: "component", component: RivalrySlide, id: "rivalry" });
    }

    // Add category leaders slide if applicable
    if (data.categoryLeaders !== null) {
      result.push(CATEGORIES_SLIDE);
    }

    // Add individual superlative slides
    data.superlatives.forEach((_, i) => {
      result.push({
        type: "superlative",
        index: i,
        id: `superlative-${i}`,
      });
    });

    // Add playoff bracket slides
    result.push({ type: "component", component: WinnersBracketSlide, id: "winnersBracket" });
    result.push({ type: "component", component: ConsolationBracketSlide, id: "consolationBracket" });

    result.push(OUTRO_SLIDE);
    return result;
  }, [data]);

  const { currentIndex, direction, goNext, goPrev, isLast } =
    useSlideNavigation(slides.length);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    if (isLast) {
      onFinished();
    } else {
      goNext();
    }
  };

  const currentSlide = slides[currentIndex];

  const renderSlide = () => {
    if (currentSlide.type === "superlative") {
      return (
        <SuperlativeSlide
          key={currentSlide.id}
          award={data.superlatives[currentSlide.index]}
          index={currentSlide.index}
          teamLogoMap={data.teamLogoMap}
          direction={direction}
        />
      );
    } else {
      const Component = currentSlide.component;
      return (
        <Component
          key={currentSlide.id}
          data={data}
          direction={direction}
        />
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#050505] overflow-hidden select-none"
      onClick={handleClick}
    >
      <ProgressBar current={currentIndex} total={slides.length} />

      {/* Home button */}
      {onHome && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHome();
          }}
          className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-full glass text-white/20 hover:text-white/60 hover:bg-white/[0.08] transition-all"
          aria-label="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 8.5V16H8.5V12H11.5V16H15V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {renderSlide()}
      </AnimatePresence>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass text-white/30 hover:text-white/70 hover:bg-white/[0.1] transition-all"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isLast) {
            onFinished();
          } else {
            goNext();
          }
        }}
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass text-white/30 hover:text-white/70 hover:bg-white/[0.1] transition-all"
        aria-label={isLast ? "See personal stats" : "Next slide"}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
