"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PALETTE } from "@/lib/constants";
import { WrappedData } from "@/lib/types";

import { WelcomeSlide } from "./WelcomeSlide";
import { StandingsSlide } from "./StandingsSlide";
import { ChampionSlide } from "./ChampionSlide";
import { MvpPlayerSlide } from "./MvpPlayerSlide";
import { BestWeekSlide } from "./BestWeekSlide";
import { WorstWeekSlide } from "./WorstWeekSlide";
import { WorstFantasyGameSlide } from "./WorstFantasyGameSlide";
import { BiggestBlowoutSlide } from "./BiggestBlowoutSlide";
import { ClosestMatchupSlide } from "./ClosestMatchupSlide";
import { MostConsistentSlide } from "./MostConsistentSlide";
import { BoomOrBustSlide } from "./BoomOrBustSlide";
import { TradeSummarySlide } from "./TradeSummarySlide";
import { UnfairTradesIntroSlide } from "./UnfairTradesIntroSlide";
import { UnfairTradeSlide } from "./UnfairTradeSlide";
import { FairTradesIntroSlide } from "./FairTradesIntroSlide";
import { FairTradeSlide } from "./FairTradeSlide";
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
  onSelectTeam?: (teamId: number) => void;
}

type SlideEntry =
  | { type: "component"; component: React.ComponentType<SlideProps>; id: string }
  | { type: "unfairTrade"; index: number; rank: number; id: string }
  | { type: "fairTrade"; index: number; rank: number; id: string }
  | { type: "superlative"; index: number; id: string };

const STATIC_SLIDES_BEFORE: SlideEntry[] = [
  { type: "component", component: WelcomeSlide, id: "welcome" },
  { type: "component", component: StandingsSlide, id: "standings" },
  { type: "component", component: ChampionSlide, id: "champion" },
  { type: "component", component: MvpPlayerSlide, id: "mvp" },
  { type: "component", component: BestWeekSlide, id: "bestWeek" },
  { type: "component", component: WorstWeekSlide, id: "worstWeek" },
  { type: "component", component: WorstFantasyGameSlide, id: "worstGame" },
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
  initialSlideId?: string;
  onSelectTeam: (teamId: number) => void;
  onHome?: () => void;
}

export function SlideContainer({ data, initialSlideId, onSelectTeam, onHome }: Props) {
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

    if (data.unfairTrades.length > 0) {
      result.push({
        type: "component",
        component: UnfairTradesIntroSlide,
        id: "unfair-trades-intro",
      });

      data.unfairTrades
        .map((_, i) => data.unfairTrades.length - 1 - i)
        .forEach((tradeIndex) => {
          result.push({
            type: "unfairTrade",
            index: tradeIndex,
            rank: tradeIndex + 1,
            id: `unfair-trade-${tradeIndex}`,
          });
        });
    }

    if (data.fairTrades.length > 0) {
      result.push({
        type: "component",
        component: FairTradesIntroSlide,
        id: "fair-trades-intro",
      });

      data.fairTrades
        .map((_, i) => data.fairTrades.length - 1 - i)
        .forEach((tradeIndex) => {
          result.push({
            type: "fairTrade",
            index: tradeIndex,
            rank: tradeIndex + 1,
            id: `fair-trade-${tradeIndex}`,
          });
        });
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

  const initialIndex = useMemo(() => {
    if (!initialSlideId) return 0;
    const match = slides.findIndex((slide) => slide.id === initialSlideId);
    return match >= 0 ? match : 0;
  }, [initialSlideId, slides]);

  const { currentIndex, direction, goNext, goPrev, isLast } =
    useSlideNavigation(slides.length, initialIndex);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select, [role='button']")) return;

    const clickedRightSide = e.clientX >= window.innerWidth / 2;

    if (clickedRightSide) {
      if (!isLast) {
        goNext();
      }
    } else {
      if (currentIndex > 0) {
        goPrev();
      }
    }
  };

  const currentSlide = slides[currentIndex];

  const renderSlide = () => {
    if (currentSlide.type === "unfairTrade") {
      return (
        <UnfairTradeSlide
          key={currentSlide.id}
          data={data}
          trade={data.unfairTrades[currentSlide.index]}
          rank={currentSlide.rank}
          direction={direction}
        />
      );
    }

    if (currentSlide.type === "fairTrade") {
      return (
        <FairTradeSlide
          key={currentSlide.id}
          data={data}
          trade={data.fairTrades[currentSlide.index]}
          rank={currentSlide.rank}
          direction={direction}
        />
      );
    }

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
          onSelectTeam={onSelectTeam}
        />
      );
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none app-screen touch-manipulation"
      style={{ background: PALETTE.background }}
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
          className="screen-action fixed z-50 inline-flex h-9 items-center gap-2 rounded-full glass px-2.5 text-white/68 transition-all hover:bg-white/[0.12] hover:text-white sm:h-10 sm:px-3"
          aria-label="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L10 3L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 8.5V16H8.5V12H11.5V16H15V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="type-meta text-current">Home</span>
        </button>
      )}

      <AnimatePresence mode="sync" initial={false} custom={direction}>
        {renderSlide()}
      </AnimatePresence>
    </div>
  );
}
