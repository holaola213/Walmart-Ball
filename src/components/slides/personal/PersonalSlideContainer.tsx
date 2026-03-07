"use client";

import { AnimatePresence } from "framer-motion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TeamWrappedData } from "@/lib/types";
import { PersonalRecapSlide } from "./PersonalRecapSlide";
import { PersonalBestWeekSlide } from "./PersonalBestWeekSlide";
import { PersonalMvpSlide } from "./PersonalMvpSlide";
import { PersonalRivalsSlide } from "./PersonalRivalsSlide";
import { PersonalPickupSlide } from "./PersonalPickupSlide";

interface PersonalSlideProps {
  team: TeamWrappedData;
  direction: number;
}

type PersonalSlideComponent = React.ComponentType<PersonalSlideProps>;

const PERSONAL_SLIDES: { component: PersonalSlideComponent; id: string }[] = [
  { component: PersonalRecapSlide, id: "recap" },
  { component: PersonalBestWeekSlide, id: "bestWeek" },
  { component: PersonalMvpSlide, id: "mvp" },
  { component: PersonalRivalsSlide, id: "rivals" },
  { component: PersonalPickupSlide, id: "pickup" },
];

interface Props {
  team: TeamWrappedData;
  onBack: () => void;
}

export function PersonalSlideContainer({ team, onBack }: Props) {
  const { currentIndex, direction, goNext, goPrev, isLast } =
    useSlideNavigation(PERSONAL_SLIDES.length);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    if (isLast) {
      onBack();
    } else {
      goNext();
    }
  };

  const CurrentSlide = PERSONAL_SLIDES[currentIndex].component;

  return (
    <div
      className="fixed inset-0 bg-[#050505] overflow-hidden select-none"
      onClick={handleClick}
    >
      <ProgressBar
        current={currentIndex}
        total={PERSONAL_SLIDES.length}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <CurrentSlide
          key={PERSONAL_SLIDES[currentIndex].id}
          team={team}
          direction={direction}
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (currentIndex === 0) {
            onBack();
          } else {
            goPrev();
          }
        }}
        className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass text-white/30 hover:text-white/70 hover:bg-white/[0.1] transition-all"
        aria-label={currentIndex === 0 ? "Back to team select" : "Previous slide"}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isLast) {
            onBack();
          } else {
            goNext();
          }
        }}
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass text-white/30 hover:text-white/70 hover:bg-white/[0.1] transition-all"
        aria-label={isLast ? "Back to team select" : "Next slide"}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
