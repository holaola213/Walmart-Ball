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
      className="mt-7 max-w-[44rem] w-full"
    >
      <div className="divide-y divide-white/8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.12 }}
            className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-4 px-2 py-4"
          >
            <span
              className="font-stat text-[10px] font-bold tracking-[0.18em] shrink-0 min-w-[2.9rem] text-center px-2.5 py-1.5 rounded-full"
              style={{
                color: `${accentColor}D8`,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${accentColor}24`,
              }}
            >
              {["2ND", "3RD", "4TH", "5TH"][i] || `${i + 2}TH`}
            </span>

            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white/8 border border-white/10 overflow-hidden">
              {item.avatarUrl && !failedAvatars[i] ? (
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                  onError={() => {
                    setFailedAvatars((prev) => ({ ...prev, [i]: true }));
                  }}
                />
              ) : (
                <span className="font-display text-[12px] leading-none text-white/55">
                  {(item.label || "?").trim().charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white/94 text-[15px] font-medium leading-tight copy-pretty">
                {item.label}
              </p>
              {item.sublabel && (
                <p className="text-white/58 text-[11px] leading-tight mt-0.5">
                  {item.sublabel}
                </p>
              )}
              <p
                className="font-stat text-[11px] leading-tight mt-1 tracking-[0.08em]"
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
