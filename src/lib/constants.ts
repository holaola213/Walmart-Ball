export const STATS_MAP: Record<string, string> = {
  "0": "PTS",
  "1": "BLK",
  "2": "STL",
  "3": "AST",
  "6": "REB",
  "11": "TO",
  "13": "FGM",
  "14": "FGA",
  "15": "FTM",
  "16": "FTA",
  "17": "3PTM",
  "18": "3PTA",
  "19": "FG%",
  "20": "FT%",
};

export const NINE_CAT = [
  "PTS",
  "REB",
  "AST",
  "STL",
  "BLK",
  "3PTM",
  "FG%",
  "FT%",
  "TO",
];

export const POSITION_MAP: Record<number, string> = {
  1: "PG",
  2: "SG",
  3: "SF",
  4: "PF",
  5: "C",
};

export const SLIDE_COLORS: Record<string, string> = {
  welcome: "#8B5CF6",
  standings: "#F59E0B",
  champion: "#EAB308",
  mvp: "#F97316",
  bestWeek: "#22C55E",
  worstWeek: "#EF4444",
  blowout: "#3B82F6",
  closest: "#14B8A6",
  consistent: "#6366F1",
  boomBust: "#EC4899",
  trades: "#06B6D4",
  waiverMvp: "#84CC16",
  categories: "#A855F7",
  superlatives: "#F472B6",
  rivalry: "#F472B6",
  winnersBracket: "#10B981",
  consolationBracket: "#6366F1",
  outro: "#8B5CF6",
  personalRecap: "#8B5CF6",
  personalBest: "#22C55E",
  personalMvp: "#F97316",
  personalRivals: "#3B82F6",
  personalPickup: "#84CC16",
};

export const SUPERLATIVE_COLORS: string[] = [
  "#F472B6", // pink
  "#8B5CF6", // violet
  "#F59E0B", // amber
  "#22C55E", // green
  "#3B82F6", // blue
  "#EF4444", // red
  "#06B6D4", // cyan
  "#EC4899", // magenta
  "#A855F7", // purple
  "#14B8A6", // teal
  "#F97316", // orange
  "#84CC16", // lime
  "#6366F1", // indigo
  "#EAB308", // yellow
  "#E11D48", // rose
  "#0EA5E9", // sky
  "#10B981", // emerald
  "#D946EF", // fuchsia
  "#78716C", // stone
  "#FB923C", // orange light
  "#4ADE80", // green light
  "#818CF8", // indigo light
  "#F87171", // red light
  "#34D399", // emerald light (SOS)
  "#C084FC", // purple light (Draft Day MVP)
];

export const LEAGUE_ID =
  process.env.NEXT_PUBLIC_LEAGUE_ID || "";
export const SEASON_YEAR =
  process.env.NEXT_PUBLIC_SEASON_YEAR || "2025";

export function getPlayerHeadshotUrl(playerId: number): string {
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${playerId}.png&w=96&h=70&cb=1`;
}

export function getTeamLogoUrl(espnLogoUrl: string): string {
  return `/api/espn-image?url=${encodeURIComponent(espnLogoUrl)}`;
}
