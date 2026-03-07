// ─── Raw ESPN API Response Types ───

export interface ESPNLeagueResponse {
  id: number;
  seasonId: number;
  scoringPeriodId: number;
  segmentId: number;
  settings: ESPNSettings;
  teams: ESPNTeam[];
  schedule: ESPNMatchup[];
  transactions?: ESPNTransaction[];
  members?: ESPNMember[];
  status: {
    currentMatchupPeriod: number;
    finalScoringPeriod: number;
    isActive: boolean;
    latestScoringPeriod: number;
  };
}

export interface ESPNSettings {
  name: string;
  scoringSettings: {
    scoringType: string; // "H2H_POINTS" | "H2H_CATEGORY" | "TOTAL_POINTS"
  };
  scheduleSettings: {
    matchupPeriodCount: number;
  };
}

export interface ESPNTeam {
  id: number;
  name: string;
  abbrev: string;
  logo?: string;
  record: {
    overall: {
      wins: number;
      losses: number;
      ties: number;
      pointsFor: number;
      pointsAgainst: number;
      percentage: number;
    };
  };
  transactionCounter: {
    acquisitions: number;
    drops: number;
    trades: number;
    moveToActive: number;
    moveToIR: number;
  };
  playoffSeed: number;
  rankCalculatedFinal: number;
  points: number;
  roster?: {
    entries: ESPNRosterEntry[];
  };
}

export interface ESPNRosterEntry {
  playerId: number;
  acquisitionDate: number;
  acquisitionType: "DRAFT" | "ADD" | "TRADE";
  lineupSlotId: number;
  playerPoolEntry: {
    id: number;
    player: {
      fullName: string;
      defaultPositionId: number;
      proTeamId: number;
      injuryStatus?: string;
      stats: ESPNPlayerStat[];
    };
    ratings?: Record<string, { totalRating: number }>;
  };
}

export interface ESPNPlayerStat {
  id: string;
  seasonId: number;
  stats: Record<string, number>;
  appliedTotal: number;
  appliedAverage: number;
  statSourceId: number; // 0 = actual, 1 = projected
  statSplitTypeId: number; // 0 = season total
  externalId?: string;
}

export interface ESPNMatchup {
  id: number;
  matchupPeriodId: number;
  playoffTierType?: string;
  winner: "HOME" | "AWAY" | "UNDECIDED";
  home: {
    teamId: number;
    totalPoints: number;
    pointsByScoringPeriod?: Record<string, number>;
    rosterForMatchupPeriod?: { entries: ESPNRosterEntry[] };
    cumulativeScore?: {
      wins: number;
      losses: number;
      ties: number;
      scoreByStat?: Record<string, { score: number; result: string }>;
    };
  };
  away?: {
    teamId: number;
    totalPoints: number;
    pointsByScoringPeriod?: Record<string, number>;
    rosterForMatchupPeriod?: { entries: ESPNRosterEntry[] };
    cumulativeScore?: {
      wins: number;
      losses: number;
      ties: number;
      scoreByStat?: Record<string, { score: number; result: string }>;
    };
  };
}

export interface ESPNTransaction {
  id: string;
  type: string;
  executionType: string;
  items: {
    playerId: number;
    fromTeamId: number;
    toTeamId: number;
    type: string;
  }[];
  teamId: number;
  bidAmount?: number;
  processDate: number;
  scoringPeriodId: number;
  status: string;
}

export interface ESPNMember {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
}

export interface TeamAward {
  teamId: number;
  teamName: string;
  title: string;
  detail: string;
}

// ─── Computed Wrapped Data Types ───

export interface WrappedData {
  leagueName: string;
  seasonYear: number;
  scoringType: string;
  totalMatchupPeriods: number;
  standings: StandingEntry[];
  champion: StandingEntry;
  mvpPlayer: PlayerHighlight;
  mvpPlayerRunnersUp: PlayerHighlight[];
  bestWeek: WeeklyRecord;
  bestWeekRunnersUp: WeeklyRecord[];
  worstWeek: WeeklyRecord;
  worstWeekRunnersUp: WeeklyRecord[];
  biggestBlowout: MatchupHighlight;
  closestMatchup: MatchupHighlight;
  mostConsistent: ConsistencyRecord;
  mostConsistentRunnersUp: ConsistencyRecord[];
  boomOrBust: ConsistencyRecord;
  boomOrBustRunnersUp: ConsistencyRecord[];
  tradeSummary: TradeSummary;
  waiverMvp: PlayerHighlight;
  waiverMvpRunnersUp: PlayerHighlight[];
  categoryLeaders: CategoryLeader[] | null;
  superlatives: Superlative[];
  rivalry: RivalryHighlight | null;
  teamAwards: TeamAward[];
  teamMap: Record<number, string>;
  teamLogoMap: Record<number, string>;
  teamData: Record<number, TeamWrappedData>;
}

export interface StandingEntry {
  teamId: number;
  teamName: string;
  abbrev: string;
  logo?: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  rank: number;
}

export interface PlayerHighlight {
  playerName: string;
  playerId: number;
  teamName: string;
  teamId: number;
  totalPoints: number;
  acquisitionType: string;
  position: string;
}

export interface WeeklyRecord {
  teamName: string;
  teamId: number;
  week: number;
  score: number;
}

export interface MatchupHighlight {
  week: number;
  winnerName: string;
  loserName: string;
  winnerId: number;
  loserId: number;
  winnerScore: number;
  loserScore: number;
  margin: number;
}

export interface ConsistencyRecord {
  teamName: string;
  teamId: number;
  standardDeviation: number;
  averageScore: number;
  weeklyScores: number[];
}

export interface TradeSummary {
  totalTrades: number;
  mostActiveTrader: { teamName: string; teamId: number; tradeCount: number };
  tradeDetails: { teamName: string; teamId: number; count: number }[];
}

export interface CategoryLeader {
  category: string;
  teamName: string;
  teamId: number;
  value: number;
}

export interface Superlative {
  title: string;
  subtitle: string;
  teamName: string;
  teamId: number;
  detail: string;
  enrichedDetail?: string;
  tiedTeams?: { teamName: string; teamId: number }[];
  runnersUp?: { teamName: string; teamId: number; detail: string }[];
  closeLossMatchups?: Record<number, { week: number; score: number; oppScore: number; oppName: string }[]>;
  closeGameMatchups?: { week: number; score: number; oppScore: number; oppName: string; won: boolean }[];
}

export interface RivalryHighlight {
  team1Name: string;
  team1Id: number;
  team2Name: string;
  team2Id: number;
  team1Wins: number;
  team2Wins: number;
  ties: number;
  totalGames: number;
  avgMargin: number;
  matchups: { week: number; team1Score: number; team2Score: number }[];
}

// ─── Per-Team Wrapped Data ───

export interface TeamWrappedData {
  teamId: number;
  teamName: string;
  abbrev: string;
  logo?: string;
  record: { wins: number; losses: number; ties: number };
  rank: number;
  pointsFor: number;
  bestWeek: WeeklyRecord;
  worstWeek: WeeklyRecord;
  mvpPlayer: PlayerHighlight | null;
  bestPickup: PlayerHighlight | null;
  weeklyScores: number[];
  totalTransactions: number;
  rivals: RivalRecord[];
}

export interface RivalRecord {
  opponentName: string;
  opponentId: number;
  wins: number;
  losses: number;
  ties: number;
}
