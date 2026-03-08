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
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select, [role='button']")) return;

    const clickedRightSide = e.clientX >= window.innerWidth / 2;

    if (clickedRightSide) {
      if (isLast) {
        onBack();
      } else {
        goNext();
      }
    } else {
      if (currentIndex === 0) {
        onBack();
      } else {
        goPrev();
      }
    }
  };

  const CurrentSlide = PERSONAL_SLIDES[currentIndex].component;

  return (
    <div
      className="fixed inset-0 bg-[#05070b] overflow-hidden select-none"
      onClick={handleClick}
    >
      <ProgressBar
        current={currentIndex}
        total={PERSONAL_SLIDES.length}
      />

      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <CurrentSlide
          key={PERSONAL_SLIDES[currentIndex].id}
          team={team}
          direction={direction}
        />
      </AnimatePresence>
    </div>
  );
}
