"use client";

import { motion } from "framer-motion";

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
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="mt-5 max-w-sm w-full"
    >
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.12 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ background: `${accentColor}06` }}
          >
            <span
              className="font-stat text-[10px] font-bold tracking-wider shrink-0 w-7 text-center"
              style={{ color: `${accentColor}50` }}
            >
              {["2ND", "3RD", "4TH", "5TH"][i] || `${i + 2}TH`}
            </span>

            {item.avatarUrl && (
              <img
                src={item.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover bg-white/10 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-white/35 text-xs font-medium leading-tight">
                {item.label}
              </p>
              {item.sublabel && (
                <p className="text-white/20 text-[10px] leading-tight">
                  {item.sublabel}
                </p>
              )}
              <p
                className="font-stat text-[10px] leading-tight mt-0.5"
                style={{ color: `${accentColor}60` }}
              >
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
