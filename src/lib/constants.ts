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

export const PALETTE = {
  background: "#05070b",
  primary: "#8B9DFF",
  cyan: "#72D5FF",
  green: "#5ECF9B",
  orange: "#F0A35E",
  red: "#F28B82",
  gold: "#E9C46A",
};

export const SLIDE_COLORS: Record<string, string> = {
  welcome: "#66E4FF",
  standings: "#59BEFF",
  champion: "#FFD166",
  mvp: "#FF8F5E",
  bestWeek: "#42F5B5",
  worstWeek: "#FF6D8A",
  blowout: "#4FA7FF",
  closest: "#49F2D2",
  consistent: "#7F93FF",
  boomBust: "#FF78D8",
  trades: "#45E9FF",
  waiverMvp: "#8CFF72",
  categories: "#C77DFF",
  superlatives: "#D46BFF",
  rivalry: "#FF5FC2",
  winnersBracket: "#3FFFC0",
  consolationBracket: "#6FAEFF",
  outro: "#7BE8FF",
  personalRecap: "#66E4FF",
  personalBest: "#42F5B5",
  personalMvp: "#FF8F5E",
  personalRivals: "#4FA7FF",
  personalPickup: "#8CFF72",
};

export const SUPERLATIVE_COLORS: string[] = [
  "#66E4FF",
  "#C77DFF",
  "#FF78D8",
  "#4FA7FF",
  "#45E9FF",
  "#42F5B5",
  "#8CFF72",
  "#FF8F5E",
  "#FF6D8A",
  "#FFD166",
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
