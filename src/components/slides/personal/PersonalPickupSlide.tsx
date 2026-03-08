"use client";

import { motion } from "framer-motion";
import { SlideLayout } from "../SlideLayout";
import { SLIDE_COLORS, getPlayerHeadshotUrl } from "@/lib/constants";
import { StatNumber } from "@/components/ui/StatNumber";
import { TeamWrappedData } from "@/lib/types";

interface Props {
  team: TeamWrappedData;
  direction: number;
}

export function PersonalPickupSlide({ team, direction }: Props) {
  const pickup = team.bestPickup;

  if (!pickup) {
    return (
      <SlideLayout
        accentColor={SLIDE_COLORS.personalPickup}
        direction={direction}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="type-kicker text-[#9ACC7B]/80 mb-6"
        >
          Best Pickup
        </motion.p>
        <p className="text-white/40 text-center text-sm">
          No waiver pickups found on your roster. All drafted or traded!
        </p>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout
      accentColor={SLIDE_COLORS.personalPickup}
      direction={direction}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="type-kicker text-[#9ACC7B]/80 mb-6"
      >
        Your Best Pickup
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ boxShadow: "0 0 40px rgba(154, 204, 123, 0.12)" }}
      >
        <div className="inline-block px-4 py-1.5 rounded-full glass text-[#9ACC7B] type-meta mb-4">
          FREE AGENT
        </div>
        {pickup.playerId > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{ background: "#9ACC7B" }} />
              <img
                src={getPlayerHeadshotUrl(pickup.playerId)}
                alt={pickup.playerName}
                className="relative w-24 h-24 rounded-full object-cover bg-white/10 border"
                style={{ borderColor: "rgba(154, 204, 123, 0.35)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}
        <div className="type-meta text-[#9ACC7B]/80 mb-2">
          {pickup.position}
        </div>
        <h3 className="type-title-md text-white mb-4 title-balance measure-medium mx-auto">
          {pickup.playerName}
        </h3>
        <div className="type-number-lg font-bold text-[#9ACC7B]" style={{ textShadow: "0 0 30px rgba(154, 204, 123, 0.3)" }}>
          <StatNumber value={pickup.totalPoints} decimals={1} />
        </div>
        <p className="type-meta text-white/25 mt-2">Total fantasy points</p>
      </motion.div>
    </SlideLayout>
  );
}
