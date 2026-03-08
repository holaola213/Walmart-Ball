"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatNumbersInText } from "@/lib/utils";

export interface RunnerUpItem {
  label: string;
  sublabel?: string;
  value: string;
  avatarUrl?: string;
}

interface Props {
  items: RunnerUpItem[];
  accentColor: string;
  delay?: number;
}

export function RunnersUpList({ items, accentColor, delay = 1.0 }: Props) {
  const [failedAvatars, setFailedAvatars] = useState<Record<number, boolean>>({});

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="mt-5 max-w-md w-full"
    >
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              background: `linear-gradient(90deg, ${accentColor}18, rgba(7, 12, 20, 0.78))`,
              border: `1px solid ${accentColor}33`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <span
              className="font-stat text-[11px] font-bold tracking-wider shrink-0 w-8 text-center"
              style={{ color: `${accentColor}A6` }}
            >
              {["2ND", "3RD", "4TH", "5TH"][i] || `${i + 2}TH`}
            </span>

            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white/10 border border-white/15 overflow-hidden">
              {item.avatarUrl && !failedAvatars[i] ? (
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  onError={() => {
                    setFailedAvatars((prev) => ({ ...prev, [i]: true }));
                  }}
                />
              ) : (
                <span className="font-display text-[12px] leading-none" style={{ color: `${accentColor}D9` }}>
                  {(item.label || "?").trim().charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white/92 text-sm font-medium leading-tight">
                {item.label}
              </p>
              {item.sublabel && (
                <p className="text-white/74 text-[11px] leading-tight">
                  {item.sublabel}
                </p>
              )}
              <p
                className="font-stat text-[11px] leading-tight mt-0.5"
                style={{ color: `${accentColor}E0` }}
              >
                {formatNumbersInText(item.value)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
