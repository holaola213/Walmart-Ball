"use client";

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Continuous progress line */}
      <div className="h-[2px] w-full bg-white/[0.12]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
            boxShadow: "0 0 14px rgba(255, 255, 255, 0.28)",
          }}
        />
      </div>
      {/* Slide counter */}
      <div className="absolute top-3 right-4 type-meta text-white/56">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
