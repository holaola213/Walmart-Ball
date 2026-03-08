"use client";

import { useState, useEffect } from "react";
import { useWrappedData } from "@/hooks/useWrappedData";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { SlideContainer } from "@/components/slides/SlideContainer";
import { TeamSelector } from "@/components/ui/TeamSelector";
import { PersonalSlideContainer } from "@/components/slides/personal/PersonalSlideContainer";
import { motion } from "framer-motion";

const PLAYOFF_END_DATE = new Date("2026-03-29T00:00:00");
const SEASON_PASSWORD = "shermanishot";

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

type AppView = "landing" | "loading" | "slides" | "teamSelect" | "personal";

export default function Home() {
  const { data, status, error, progress, fetchData } = useWrappedData();
  const [view, setView] = useState<AppView>("landing");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const countdown = useCountdown(PLAYOFF_END_DATE);

  const handlePasswordSubmit = () => {
    if (password === SEASON_PASSWORD) {
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError(false);
      handleStart();
    } else {
      setPasswordError(true);
    }
  };

  const handleStart = () => {
    setView("loading");
    fetchData();
  };

  const effectiveView: AppView =
    view === "loading" && status === "success" && data ? "slides" : view;

  if (effectiveView === "loading" && status === "error") {
    return (
      <ErrorScreen
        error={error || "Something went wrong"}
        onRetry={handleStart}
      />
    );
  }

  if (effectiveView === "loading") {
    return <LoadingScreen progress={progress} status={status} />;
  }

  if (effectiveView === "slides" && data) {
    return (
      <SlideContainer data={data} onFinished={() => setView("teamSelect")} onHome={() => setView("landing")} />
    );
  }

  if (effectiveView === "teamSelect" && data) {
    return (
      <TeamSelector
        data={data}
        onSelectTeam={(teamId) => {
          setSelectedTeamId(teamId);
          setView("personal");
        }}
        onBack={() => setView("slides")}
      />
    );
  }

  if (effectiveView === "personal" && data && selectedTeamId !== null) {
    const teamData = data.teamData[selectedTeamId];
    if (teamData) {
      return (
        <PersonalSlideContainer
          team={teamData}
          onBack={() => setView("teamSelect")}
        />
      );
    }
  }

  // Landing page
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-8 grain"
      style={{
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(139, 157, 255, 0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `,
      }}
    >
      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="type-kicker text-white/35 mb-6"
        >
          Fantasy Basketball
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="type-title-xl text-white mb-4 title-balance"
          style={{
            textShadow: "0 0 80px rgba(139, 157, 255, 0.3)",
          }}
        >
          WRAPPED
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-[1px] w-48 mx-auto mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(139, 157, 255, 0.55), transparent)",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[#8B9DFF]/70 text-[15px] leading-[1.35] mb-14 copy-pretty"
        >
          Your season, recapped.
        </motion.p>

        {/* Season selector cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex gap-4 w-full max-w-md"
        >
          {/* Regular Season — Active */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPasswordModal(true)}
            className="flex-1 relative group rounded-2xl p-5 pt-6 text-center overflow-hidden cursor-pointer transition-all"
            style={{
              background: "rgba(139, 157, 255, 0.08)",
              border: "1px solid rgba(139, 157, 255, 0.25)",
              boxShadow: "0 0 40px rgba(139, 157, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Glow pulse behind card */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(139, 157, 255, 0.15), transparent 70%)",
              }}
            />

            {/* Ready indicator dot */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72D5FF] animate-pulse" />
              <span className="type-meta text-[#72D5FF]/80">
                Ready
              </span>
            </div>

            {/* Basketball icon */}
            <div className="relative mx-auto mb-3 w-10 h-10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#8B9DFF]">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <p className="relative type-title-md text-white mb-1">
              Regular Season
            </p>
            <p className="relative type-meta text-white/35">
              VIEW WRAPPED
            </p>
          </motion.button>

          {/* Playoffs — Locked */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15 }}
            className="flex-1 relative rounded-2xl p-5 pt-6 text-center overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {/* Locked indicator */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white/20">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="type-meta text-white/20">
                Locked
              </span>
            </div>

            {/* Trophy icon — dimmed */}
            <div className="relative mx-auto mb-3 w-10 h-10 flex items-center justify-center opacity-20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M8 2H16V10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10V2Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4H5C4 4 3 5 3 7C3 9 4.5 10 5 10H8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 4H19C20 4 21 5 21 7C21 9 19.5 10 19 10H16" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 14V16H14V14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 16H17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <p className="type-title-md text-white/15 mb-2">
              Playoffs
            </p>

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <p className="font-stat text-sm text-white/25 leading-none">{countdown.days}</p>
                <p className="type-meta text-white/10">Day</p>
              </div>
              <span className="text-white/10 text-[10px] font-stat -mt-2">:</span>
              <div className="text-center">
                <p className="font-stat text-sm text-white/25 leading-none">{countdown.hours}</p>
                <p className="type-meta text-white/10">Hr</p>
              </div>
              <span className="text-white/10 text-[10px] font-stat -mt-2">:</span>
              <div className="text-center">
                <p className="font-stat text-sm text-white/25 leading-none">{countdown.minutes}</p>
                <p className="type-meta text-white/10">Min</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Password Modal */}
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => {
            setShowPasswordModal(false);
            setPassword("");
            setPasswordError(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative rounded-2xl p-6 w-full max-w-xs text-center"
            style={{
              background: "rgba(20, 20, 30, 0.95)",
              border: "1px solid rgba(139, 157, 255, 0.2)",
              boxShadow: "0 0 60px rgba(139, 157, 255, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="type-meta text-[#8B9DFF]/60 mb-4">
              Enter Password
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePasswordSubmit();
              }}
              autoFocus
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl text-white text-sm font-stat tracking-wider text-center outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: passwordError
                  ? "1px solid rgba(239, 68, 68, 0.5)"
                  : "1px solid rgba(139, 157, 255, 0.2)",
                boxShadow: passwordError
                  ? "0 0 15px rgba(239, 68, 68, 0.1)"
                  : "none",
              }}
            />

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-red-400/80 text-[11px] font-stat tracking-wider"
              >
                Wrong password
              </motion.p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setPasswordError(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-white/30 type-meta hover:text-white/50 transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 py-2.5 rounded-xl text-white type-meta hover:opacity-80 transition-opacity"
                style={{
                  background: "rgba(139, 157, 255, 0.3)",
                  border: "1px solid rgba(139, 157, 255, 0.4)",
                  boxShadow: "0 0 20px rgba(139, 157, 255, 0.15)",
                }}
              >
                Enter
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
