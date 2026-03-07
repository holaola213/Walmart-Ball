import {
  ESPNLeagueResponse,
  ESPNTeam,
  ESPNMatchup,
  WrappedData,
  StandingEntry,
  PlayerHighlight,
  WeeklyRecord,
  MatchupHighlight,
  ConsistencyRecord,
  TradeSummary,
  Superlative,
  TeamWrappedData,
  RivalRecord,
  RivalryHighlight,
  CategoryLeader,
  TeamAward,
} from "./types";
import { POSITION_MAP } from "./constants";
import { standardDeviation } from "./utils";

export function processWrappedData(raw: ESPNLeagueResponse): WrappedData {
  const teamMap: Record<number, string> = {};
  const teamAbbrevMap: Record<number, string> = {};
  const teamLogoMap: Record<number, string> = {};
  for (const team of raw.teams) {
    teamMap[team.id] = team.name || team.abbrev;
    teamAbbrevMap[team.id] = team.abbrev;
    if (team.logo) teamLogoMap[team.id] = team.logo;
  }

  const seasonId = raw.seasonId;

  const standings = computeStandings(raw.teams, teamMap);
  const champion = standings[0];

  const completedMatchups = (raw.schedule || []).filter(
    (m) => m.winner !== "UNDECIDED" && m.away && !m.playoffTierType
  );

  const teamWeeklyScores = computeTeamWeeklyScores(completedMatchups);
  const topBestWeeks = findTopWeeks(teamWeeklyScores, teamMap, "best", 5);
  const bestWeek = topBestWeeks[0] || { teamName: "", teamId: 0, week: 0, score: 0 };
  const bestWeekRunnersUp = topBestWeeks.slice(1);
  const topWorstWeeks = findTopWeeks(teamWeeklyScores, teamMap, "worst", 5);
  const worstWeek = topWorstWeeks[0] || { teamName: "", teamId: 0, week: 0, score: 0 };
  const worstWeekRunnersUp = topWorstWeeks.slice(1);
  const biggestBlowout = findBiggestBlowout(completedMatchups, teamMap);
  const closestMatchup = findClosestMatchup(completedMatchups, teamMap);
  const {
    mostConsistent, mostConsistentRunnersUp,
    boomOrBust, boomOrBustRunnersUp,
  } = computeConsistency(teamWeeklyScores, teamMap);
  const tradeSummary = computeTradeSummary(raw, teamMap);
  const topPlayers = findTopPlayers(raw.teams, teamMap, seasonId);
  const mvpPlayer = topPlayers[0] || { playerName: "N/A", playerId: 0, teamName: "", teamId: 0, totalPoints: 0, acquisitionType: "", position: "" };
  const mvpPlayerRunnersUp = topPlayers.slice(1);
  const topWaiverPlayers = findTopPlayers(raw.teams, teamMap, seasonId, "ADD");
  const waiverMvp = topWaiverPlayers[0] || { playerName: "N/A", playerId: 0, teamName: "", teamId: 0, totalPoints: 0, acquisitionType: "ADD", position: "" };
  const waiverMvpRunnersUp = topWaiverPlayers.slice(1);

  const scoringType = raw.settings?.scoringSettings?.scoringType || "H2H_POINTS";
  const categoryLeaders = scoringType.includes("CATEGORY")
    ? computeCategoryLeaders(completedMatchups, teamMap)
    : null;

  const superlatives = computeSuperlatives(
    raw.teams,
    teamWeeklyScores,
    completedMatchups,
    teamMap
  );

  const rivalry = computeRivalry(completedMatchups, teamMap);

  const teamData: Record<number, TeamWrappedData> = {};
  for (const team of raw.teams) {
    teamData[team.id] = computeTeamData(
      team,
      completedMatchups,
      teamMap,
      teamAbbrevMap,
      seasonId
    );
  }

  const teamAwards = computeTeamAwards(champion, superlatives, standings, teamData);

  return {
    leagueName: raw.settings?.name || "Fantasy Basketball League",
    seasonYear: raw.seasonId,
    scoringType,
    totalMatchupPeriods:
      raw.settings?.scheduleSettings?.matchupPeriodCount || 0,
    standings,
    champion,
    mvpPlayer,
    mvpPlayerRunnersUp,
    bestWeek,
    bestWeekRunnersUp,
    worstWeek,
    worstWeekRunnersUp,
    biggestBlowout,
    closestMatchup,
    mostConsistent,
    mostConsistentRunnersUp,
    boomOrBust,
    boomOrBustRunnersUp,
    tradeSummary,
    waiverMvp,
    waiverMvpRunnersUp,
    categoryLeaders,
    superlatives,
    rivalry,
    teamAwards,
    teamMap,
    teamLogoMap,
    teamData,
  };
}

function computeStandings(
  teams: ESPNTeam[],
  teamMap: Record<number, string>
): StandingEntry[] {
  return [...teams]
    .sort((a, b) => {
      // Sort by wins desc, then by points for desc
      const wDiff = b.record.overall.wins - a.record.overall.wins;
      if (wDiff !== 0) return wDiff;
      return b.record.overall.pointsFor - a.record.overall.pointsFor;
    })
    .map((team, index) => ({
      teamId: team.id,
      teamName: teamMap[team.id],
      abbrev: team.abbrev,
      logo: team.logo,
      wins: team.record.overall.wins,
      losses: team.record.overall.losses,
      ties: team.record.overall.ties,
      pointsFor: team.record.overall.pointsFor || team.points || 0,
      rank: index + 1,
    }));
}

function computeTeamWeeklyScores(
  matchups: ESPNMatchup[]
): Map<number, Map<number, number>> {
  const scores = new Map<number, Map<number, number>>();

  for (const m of matchups) {
    if (m.home) {
      if (!scores.has(m.home.teamId)) scores.set(m.home.teamId, new Map());
      scores.get(m.home.teamId)!.set(m.matchupPeriodId, m.home.totalPoints);
    }
    if (m.away) {
      if (!scores.has(m.away.teamId)) scores.set(m.away.teamId, new Map());
      scores.get(m.away.teamId)!.set(m.matchupPeriodId, m.away.totalPoints);
    }
  }

  return scores;
}

function findTopWeeks(
  scores: Map<number, Map<number, number>>,
  teamMap: Record<number, string>,
  order: "best" | "worst",
  count: number = 5
): WeeklyRecord[] {
  const all: WeeklyRecord[] = [];
  for (const [teamId, weeks] of scores) {
    for (const [week, score] of weeks) {
      if (score > 0) {
        all.push({ teamName: teamMap[teamId], teamId, week, score });
      }
    }
  }
  if (order === "best") {
    all.sort((a, b) => b.score - a.score);
  } else {
    all.sort((a, b) => a.score - b.score);
  }
  return all.slice(0, count);
}

function findBiggestBlowout(
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>
): MatchupHighlight {
  let biggest: MatchupHighlight = {
    week: 0,
    winnerName: "",
    loserName: "",
    winnerId: 0,
    loserId: 0,
    winnerScore: 0,
    loserScore: 0,
    margin: 0,
  };

  for (const m of matchups) {
    if (!m.away) continue;
    const margin = Math.abs(m.home.totalPoints - m.away.totalPoints);
    if (margin > biggest.margin) {
      const homeWon = m.winner === "HOME";
      biggest = {
        week: m.matchupPeriodId,
        winnerName: teamMap[homeWon ? m.home.teamId : m.away.teamId],
        loserName: teamMap[homeWon ? m.away.teamId : m.home.teamId],
        winnerId: homeWon ? m.home.teamId : m.away.teamId,
        loserId: homeWon ? m.away.teamId : m.home.teamId,
        winnerScore: homeWon ? m.home.totalPoints : m.away.totalPoints,
        loserScore: homeWon ? m.away.totalPoints : m.home.totalPoints,
        margin,
      };
    }
  }

  return biggest;
}

function findClosestMatchup(
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>
): MatchupHighlight {
  let closest: MatchupHighlight = {
    week: 0,
    winnerName: "",
    loserName: "",
    winnerId: 0,
    loserId: 0,
    winnerScore: 0,
    loserScore: 0,
    margin: Infinity,
  };

  for (const m of matchups) {
    if (!m.away) continue;
    const margin = Math.abs(m.home.totalPoints - m.away.totalPoints);
    if (margin > 0 && margin < closest.margin) {
      const homeWon = m.winner === "HOME";
      closest = {
        week: m.matchupPeriodId,
        winnerName: teamMap[homeWon ? m.home.teamId : m.away.teamId],
        loserName: teamMap[homeWon ? m.away.teamId : m.home.teamId],
        winnerId: homeWon ? m.home.teamId : m.away.teamId,
        loserId: homeWon ? m.away.teamId : m.home.teamId,
        winnerScore: homeWon ? m.home.totalPoints : m.away.totalPoints,
        loserScore: homeWon ? m.away.totalPoints : m.home.totalPoints,
        margin,
      };
    }
  }

  if (closest.margin === Infinity) closest.margin = 0;

  return closest;
}

function computeConsistency(
  scores: Map<number, Map<number, number>>,
  teamMap: Record<number, string>
): {
  mostConsistent: ConsistencyRecord;
  mostConsistentRunnersUp: ConsistencyRecord[];
  boomOrBust: ConsistencyRecord;
  boomOrBustRunnersUp: ConsistencyRecord[];
} {
  const all: ConsistencyRecord[] = [];
  for (const [teamId, weeks] of scores) {
    const weeklyScores = [...weeks.values()];
    if (weeklyScores.length === 0) continue;
    const sd = standardDeviation(weeklyScores);
    const avg = weeklyScores.reduce((s, v) => s + v, 0) / weeklyScores.length;
    all.push({ teamName: teamMap[teamId], teamId, standardDeviation: sd, averageScore: avg, weeklyScores });
  }

  const byConsistent = [...all].sort((a, b) => a.standardDeviation - b.standardDeviation);
  const byVolatile = [...all].sort((a, b) => b.standardDeviation - a.standardDeviation);

  const fallback: ConsistencyRecord = { teamName: "", teamId: 0, standardDeviation: 0, averageScore: 0, weeklyScores: [] };

  return {
    mostConsistent: byConsistent[0] || fallback,
    mostConsistentRunnersUp: byConsistent.slice(1, 5),
    boomOrBust: byVolatile[0] || fallback,
    boomOrBustRunnersUp: byVolatile.slice(1, 5),
  };
}

function computeTradeSummary(
  raw: ESPNLeagueResponse,
  teamMap: Record<number, string>
): TradeSummary {
  const tradeCountMap = new Map<number, number>();

  // Count trades from team transactionCounter
  for (const team of raw.teams) {
    tradeCountMap.set(team.id, team.transactionCounter?.trades || 0);
  }

  const totalTrades = [...tradeCountMap.values()].reduce((s, v) => s + v, 0) / 2; // each trade counts for 2 teams

  const tradeDetails = [...tradeCountMap.entries()]
    .map(([teamId, count]) => ({
      teamName: teamMap[teamId],
      teamId,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const top = tradeDetails[0] || { teamName: "N/A", teamId: 0, count: 0 };

  return {
    totalTrades: Math.round(totalTrades),
    mostActiveTrader: {
      teamName: top.teamName,
      teamId: top.teamId,
      tradeCount: top.count,
    },
    tradeDetails,
  };
}

function findTopPlayers(
  teams: ESPNTeam[],
  teamMap: Record<number, string>,
  seasonId: number,
  filter?: "ADD",
  count: number = 5
): PlayerHighlight[] {
  const all: PlayerHighlight[] = [];
  for (const team of teams) {
    if (!team.roster?.entries) continue;
    for (const entry of team.roster.entries) {
      if (filter && entry.acquisitionType !== filter) continue;
      const player = entry.playerPoolEntry?.player;
      if (!player) continue;

      const seasonStat = player.stats?.find(
        (s) => s.statSourceId === 0 && s.statSplitTypeId === 0 && s.seasonId === seasonId
      );
      const total = seasonStat?.appliedTotal || 0;
      if (total > 0) {
        all.push({
          playerName: player.fullName,
          playerId: entry.playerId,
          teamName: teamMap[team.id],
          teamId: team.id,
          totalPoints: total,
          acquisitionType: entry.acquisitionType,
          position: POSITION_MAP[player.defaultPositionId] || "UTIL",
        });
      }
    }
  }
  all.sort((a, b) => b.totalPoints - a.totalPoints);
  return all.slice(0, count);
}

function computeCategoryLeaders(
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>
): CategoryLeader[] {
  // For H2H categories, look at cumulative category wins across matchups
  const teamCatWins = new Map<number, number>();

  for (const m of matchups) {
    if (m.home.cumulativeScore) {
      const wins = m.home.cumulativeScore.wins || 0;
      teamCatWins.set(
        m.home.teamId,
        (teamCatWins.get(m.home.teamId) || 0) + wins
      );
    }
    if (m.away?.cumulativeScore) {
      const wins = m.away.cumulativeScore.wins || 0;
      teamCatWins.set(
        m.away.teamId,
        (teamCatWins.get(m.away.teamId) || 0) + wins
      );
    }
  }

  const sorted = [...teamCatWins.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 5).map(([teamId, wins]) => ({
    category: "Category Wins",
    teamName: teamMap[teamId],
    teamId,
    value: wins,
  }));
}

function computeRivalry(
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>
): RivalryHighlight | null {
  // Build per-pair data
  const pairMap = new Map<
    string,
    {
      team1Id: number;
      team2Id: number;
      team1Wins: number;
      team2Wins: number;
      ties: number;
      margins: number[];
      matchups: { week: number; team1Score: number; team2Score: number }[];
    }
  >();

  for (const m of matchups) {
    if (!m.away) continue;
    const id1 = Math.min(m.home.teamId, m.away.teamId);
    const id2 = Math.max(m.home.teamId, m.away.teamId);
    const key = `${id1}-${id2}`;

    if (!pairMap.has(key)) {
      pairMap.set(key, {
        team1Id: id1,
        team2Id: id2,
        team1Wins: 0,
        team2Wins: 0,
        ties: 0,
        margins: [],
        matchups: [],
      });
    }
    const pair = pairMap.get(key)!;
    const margin = Math.abs(m.home.totalPoints - m.away.totalPoints);
    pair.margins.push(margin);

    const t1Score = m.home.teamId === id1 ? m.home.totalPoints : m.away.totalPoints;
    const t2Score = m.home.teamId === id2 ? m.home.totalPoints : m.away.totalPoints;
    pair.matchups.push({ week: m.matchupPeriodId, team1Score: t1Score, team2Score: t2Score });

    if (margin === 0) {
      pair.ties++;
    } else {
      const winnerId = m.winner === "HOME" ? m.home.teamId : m.away.teamId;
      if (winnerId === id1) pair.team1Wins++;
      else pair.team2Wins++;
    }
  }

  // Score each pair: prefer closest record, then smallest avg margin, then most games
  let bestPair: { team1Id: number; team2Id: number; team1Wins: number; team2Wins: number; ties: number; margins: number[]; matchups: { week: number; team1Score: number; team2Score: number }[] } | null = null;
  let bestScore = Infinity;

  for (const [, pair] of pairMap) {
    const totalGames = pair.team1Wins + pair.team2Wins + pair.ties;
    if (totalGames < 2) continue; // Need at least 2 meetings for a rivalry

    const recordDiff = Math.abs(pair.team1Wins - pair.team2Wins);
    const avgMargin = pair.margins.reduce((s, v) => s + v, 0) / pair.margins.length;
    // Lower score = better rivalry (closer record, tighter games)
    const score = recordDiff * 100 + avgMargin - totalGames * 5;

    if (score < bestScore) {
      bestScore = score;
      bestPair = pair;
    }
  }

  if (!bestPair) return null;

  const totalGames = bestPair.team1Wins + bestPair.team2Wins + bestPair.ties;
  const avgMargin = bestPair.margins.reduce((s, v) => s + v, 0) / bestPair.margins.length;

  return {
    team1Name: teamMap[bestPair.team1Id],
    team1Id: bestPair.team1Id,
    team2Name: teamMap[bestPair.team2Id],
    team2Id: bestPair.team2Id,
    team1Wins: bestPair.team1Wins,
    team2Wins: bestPair.team2Wins,
    ties: bestPair.ties,
    totalGames,
    avgMargin,
    matchups: bestPair.matchups.sort((a, b) => a.week - b.week),
  };
}

function computeSuperlatives(
  teams: ESPNTeam[],
  weeklyScores: Map<number, Map<number, number>>,
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>
): Superlative[] {
  const superlatives: Superlative[] = [];

  // ── Pre-compute helpers ──

  // Group matchups by week
  const weekGroups = new Map<number, ESPNMatchup[]>();
  for (const m of matchups) {
    if (!weekGroups.has(m.matchupPeriodId)) {
      weekGroups.set(m.matchupPeriodId, []);
    }
    weekGroups.get(m.matchupPeriodId)!.push(m);
  }

  const sortedWeeks = [...weekGroups.keys()].sort((a, b) => a - b);
  const midpoint = Math.ceil(sortedWeeks.length / 2);
  const firstHalfWeeks = new Set(sortedWeeks.slice(0, midpoint));
  const secondHalfWeeks = new Set(sortedWeeks.slice(midpoint));

  // Build per-team matchup results in week order
  const teamMatchupResults = new Map<
    number,
    { week: number; won: boolean; score: number; opponentScore: number; margin: number }[]
  >();
  for (const m of matchups) {
    if (!m.away) continue;
    const homeWon = m.winner === "HOME";
    if (!teamMatchupResults.has(m.home.teamId))
      teamMatchupResults.set(m.home.teamId, []);
    teamMatchupResults.get(m.home.teamId)!.push({
      week: m.matchupPeriodId,
      won: homeWon,
      score: m.home.totalPoints,
      opponentScore: m.away.totalPoints,
      margin: m.home.totalPoints - m.away.totalPoints,
    });
    if (!teamMatchupResults.has(m.away.teamId))
      teamMatchupResults.set(m.away.teamId, []);
    teamMatchupResults.get(m.away.teamId)!.push({
      week: m.matchupPeriodId,
      won: !homeWon,
      score: m.away.totalPoints,
      opponentScore: m.home.totalPoints,
      margin: m.away.totalPoints - m.home.totalPoints,
    });
  }
  for (const [, results] of teamMatchupResults) {
    results.sort((a, b) => a.week - b.week);
  }

  // Weekly medians (reused for Lucky Winner + Streaky Scorer)
  const weeklyMedians = new Map<number, number>();
  for (const [week, weekMatchups] of weekGroups) {
    const allScores: number[] = [];
    for (const m of weekMatchups) {
      allScores.push(m.home.totalPoints);
      if (m.away) allScores.push(m.away.totalPoints);
    }
    allScores.sort((a, b) => a - b);
    const median =
      allScores.length % 2 === 0
        ? (allScores[allScores.length / 2 - 1] + allScores[allScores.length / 2]) / 2
        : allScores[Math.floor(allScores.length / 2)];
    weeklyMedians.set(week, median);
  }

  // ── 1. Most Active GM ──
  const transactionCounts = teams.map((t) => ({
    teamId: t.id,
    total: t.transactionCounter?.acquisitions || 0,
  }));
  transactionCounts.sort((a, b) => b.total - a.total);
  const mostActive = transactionCounts[0];
  if (mostActive) {
    superlatives.push({
      title: "Most Active GM",
      subtitle: "Never stops tinkering with their roster",
      teamName: teamMap[mostActive.teamId],
      teamId: mostActive.teamId,
      detail: `${mostActive.total} moves`,
      runnersUp: transactionCounts.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId, detail: `${t.total} moves`,
      })),
    });
  }

  // ── 2. Couch Potato GM ──
  const reversedTx = [...transactionCounts].reverse();
  const leastActive = reversedTx[0];
  if (leastActive && reversedTx.length > 1) {
    superlatives.push({
      title: "Couch Potato GM",
      subtitle: "Set it and forget it all season",
      teamName: teamMap[leastActive.teamId],
      teamId: leastActive.teamId,
      detail: `${leastActive.total} moves`,
      runnersUp: reversedTx.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId, detail: `${t.total} moves`,
      })),
    });
  }

  // ── 3. Heartbreak Kid ──
  const closeLosses = new Map<number, number>();
  const closeLossDetails = new Map<number, { week: number; score: number; oppScore: number; oppName: string }[]>();
  for (const m of matchups) {
    if (!m.away) continue;
    const margin = Math.abs(m.home.totalPoints - m.away.totalPoints);
    if (margin <= 10 && margin > 0) {
      const loserId = m.winner === "HOME" ? m.away.teamId : m.home.teamId;
      const winnerId = m.winner === "HOME" ? m.home.teamId : m.away.teamId;
      const loserScore = m.winner === "HOME" ? m.away.totalPoints : m.home.totalPoints;
      const winnerScore = m.winner === "HOME" ? m.home.totalPoints : m.away.totalPoints;
      closeLosses.set(loserId, (closeLosses.get(loserId) || 0) + 1);
      if (!closeLossDetails.has(loserId)) closeLossDetails.set(loserId, []);
      closeLossDetails.get(loserId)!.push({
        week: m.matchupPeriodId,
        score: loserScore,
        oppScore: winnerScore,
        oppName: teamMap[winnerId],
      });
    }
  }
  const heartbreakEntries = [...closeLosses.entries()].sort((a, b) => b[1] - a[1]);
  if (heartbreakEntries.length > 0) {
    const topCount = heartbreakEntries[0][1];
    const tied = heartbreakEntries.filter(([, c]) => c === topCount);
    const [teamId, count] = tied[0];
    superlatives.push({
      title: "Heartbreak Kid",
      subtitle: "Most losses decided by 10 points or fewer",
      teamName: teamMap[teamId],
      teamId,
      detail: `${count} close loss${count !== 1 ? "es" : ""}`,
      tiedTeams: tied.length > 1
        ? tied.map(([tid]) => ({ teamName: teamMap[tid], teamId: tid }))
        : undefined,
      closeLossMatchups: Object.fromEntries(
        tied.map(([tid]) => [tid, closeLossDetails.get(tid) || []])
      ),
    });
  }

  // ── 4. Lucky Winner ──
  const luckyWins = new Map<number, number>();
  const luckyScores = new Map<number, { score: number; median: number }[]>();
  for (const [, weekMatchups] of weekGroups) {
    const median = weeklyMedians.get(weekMatchups[0]?.matchupPeriodId) || 0;
    for (const m of weekMatchups) {
      if (!m.away) continue;
      if (m.winner === "HOME" && m.home.totalPoints < median) {
        luckyWins.set(m.home.teamId, (luckyWins.get(m.home.teamId) || 0) + 1);
        if (!luckyScores.has(m.home.teamId)) luckyScores.set(m.home.teamId, []);
        luckyScores.get(m.home.teamId)!.push({ score: m.home.totalPoints, median });
      } else if (m.winner === "AWAY" && m.away.totalPoints < median) {
        luckyWins.set(m.away.teamId, (luckyWins.get(m.away.teamId) || 0) + 1);
        if (!luckyScores.has(m.away.teamId)) luckyScores.set(m.away.teamId, []);
        luckyScores.get(m.away.teamId)!.push({ score: m.away.totalPoints, median });
      }
    }
  }
  const luckyEntries = [...luckyWins.entries()].sort((a, b) => b[1] - a[1]);
  if (luckyEntries.length > 0) {
    const [teamId, count] = luckyEntries[0];
    const winnerScores = luckyScores.get(teamId) || [];
    const avgScore = winnerScores.length > 0
      ? winnerScores.reduce((s, w) => s + w.score, 0) / winnerScores.length
      : 0;
    const avgMedian = winnerScores.length > 0
      ? winnerScores.reduce((s, w) => s + w.median, 0) / winnerScores.length
      : 0;
    superlatives.push({
      title: "Lucky Winner",
      subtitle: "Most wins while scoring below the league median",
      teamName: teamMap[teamId],
      teamId,
      detail: `${count} lucky wins`,
      enrichedDetail: `Avg ${avgScore.toFixed(1)} pts vs ${avgMedian.toFixed(1)} median`,
      runnersUp: luckyEntries.slice(1, 5).map(([tid, c]) => ({
        teamName: teamMap[tid], teamId: tid, detail: `${c} lucky wins`,
      })),
    });
  }

  // ── 5. Scoring Machine ──
  const pointsTeams = [...teams].sort(
    (a, b) =>
      (b.record.overall.pointsFor || b.points || 0) -
      (a.record.overall.pointsFor || a.points || 0)
  );
  if (pointsTeams.length > 0) {
    const top = pointsTeams[0];
    const pts = top.record.overall.pointsFor || top.points || 0;
    superlatives.push({
      title: "Scoring Machine",
      subtitle: "Led the league in total fantasy points",
      teamName: teamMap[top.id],
      teamId: top.id,
      detail: `${pts.toFixed(1)} total pts`,
      runnersUp: pointsTeams.slice(1, 5).map((t) => ({
        teamName: teamMap[t.id], teamId: t.id,
        detail: `${(t.record.overall.pointsFor || t.points || 0).toFixed(1)} total pts`,
      })),
    });
  }

  // ── 7. Punching Bag ──
  const paSorted = [...teams].sort(
    (a, b) => (b.record.overall.pointsAgainst || 0) - (a.record.overall.pointsAgainst || 0)
  );
  if (paSorted.length > 0) {
    const top = paSorted[0];
    const pa = top.record.overall.pointsAgainst || 0;
    superlatives.push({
      title: "Punching Bag",
      subtitle: "Had the most total points scored against them",
      teamName: teamMap[top.id],
      teamId: top.id,
      detail: `${pa.toFixed(1)} pts against`,
      runnersUp: paSorted.slice(1, 5).map((t) => ({
        teamName: teamMap[t.id], teamId: t.id,
        detail: `${(t.record.overall.pointsAgainst || 0).toFixed(1)} pts against`,
      })),
    });
  }

  // ── 8. Easy Street ──
  if (paSorted.length > 1) {
    const bottom = paSorted[paSorted.length - 1];
    const pa = bottom.record.overall.pointsAgainst || 0;
    superlatives.push({
      title: "Easy Street",
      subtitle: "Had the fewest total points scored against them",
      teamName: teamMap[bottom.id],
      teamId: bottom.id,
      detail: `${pa.toFixed(1)} pts against`,
    });
  }

  // ── 9. Overachiever & 10. Underachiever ──
  const pfRanked = [...teams].sort(
    (a, b) =>
      (b.record.overall.pointsFor || b.points || 0) -
      (a.record.overall.pointsFor || a.points || 0)
  );
  const winsRanked = [...teams].sort(
    (a, b) => b.record.overall.wins - a.record.overall.wins
  );
  const pfRankMap = new Map<number, number>();
  const winsRankMap = new Map<number, number>();
  pfRanked.forEach((t, i) => pfRankMap.set(t.id, i + 1));
  winsRanked.forEach((t, i) => winsRankMap.set(t.id, i + 1));

  let bestOverachieve = { teamId: 0, gap: -Infinity, pfRank: 0, winsRank: 0 };
  let worstUnderachieve = { teamId: 0, gap: Infinity, pfRank: 0, winsRank: 0 };
  for (const t of teams) {
    const pfRank = pfRankMap.get(t.id) || 0;
    const winsRank = winsRankMap.get(t.id) || 0;
    const gap = pfRank - winsRank; // positive = overachiever (ranked lower in PF but higher in wins)
    if (gap > bestOverachieve.gap) {
      bestOverachieve = { teamId: t.id, gap, pfRank, winsRank };
    }
    if (gap < worstUnderachieve.gap) {
      worstUnderachieve = { teamId: t.id, gap, pfRank, winsRank };
    }
  }
  if (bestOverachieve.teamId && bestOverachieve.gap > 0) {
    superlatives.push({
      title: "Overachiever",
      subtitle: "Won more than their scoring suggested they should",
      teamName: teamMap[bestOverachieve.teamId],
      teamId: bestOverachieve.teamId,
      detail: `#${bestOverachieve.pfRank} in pts, #${bestOverachieve.winsRank} in wins`,
    });
  }
  if (worstUnderachieve.teamId && worstUnderachieve.gap < 0) {
    superlatives.push({
      title: "Underachiever",
      subtitle: "Scored a lot but didn't have the wins to show for it",
      teamName: teamMap[worstUnderachieve.teamId],
      teamId: worstUnderachieve.teamId,
      detail: `#${worstUnderachieve.pfRank} in pts, #${worstUnderachieve.winsRank} in wins`,
    });
  }

  // ── 11. Hot Streak ──
  const winStreaks: { teamId: number; streak: number; avgScore: number }[] = [];
  for (const [teamId, results] of teamMatchupResults) {
    let current = 0;
    let max = 0;
    let currentScores: number[] = [];
    let bestScores: number[] = [];
    for (const r of results) {
      if (r.won) {
        current++;
        currentScores.push(r.score);
        if (current > max) {
          max = current;
          bestScores = [...currentScores];
        }
      } else {
        current = 0;
        currentScores = [];
      }
    }
    if (max > 0) {
      const avg = bestScores.reduce((s, v) => s + v, 0) / bestScores.length;
      winStreaks.push({ teamId, streak: max, avgScore: avg });
    }
  }
  winStreaks.sort((a, b) => b.streak - a.streak);
  if (winStreaks.length > 0) {
    superlatives.push({
      title: "Hot Streak",
      subtitle: "Longest consecutive winning streak of the season",
      teamName: teamMap[winStreaks[0].teamId],
      teamId: winStreaks[0].teamId,
      detail: `${winStreaks[0].streak} wins in a row · avg ${winStreaks[0].avgScore.toFixed(1)} pts`,
      runnersUp: winStreaks.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `${t.streak} wins in a row · avg ${t.avgScore.toFixed(1)} pts`,
      })),
    });
  }

  // ── 12. Cold Streak ──
  const lossStreaks: { teamId: number; streak: number; avgScore: number }[] = [];
  for (const [teamId, results] of teamMatchupResults) {
    let current = 0;
    let max = 0;
    let currentScores: number[] = [];
    let bestScores: number[] = [];
    for (const r of results) {
      if (!r.won) {
        current++;
        currentScores.push(r.score);
        if (current > max) {
          max = current;
          bestScores = [...currentScores];
        }
      } else {
        current = 0;
        currentScores = [];
      }
    }
    if (max > 0) {
      const avg = bestScores.reduce((s, v) => s + v, 0) / bestScores.length;
      lossStreaks.push({ teamId, streak: max, avgScore: avg });
    }
  }
  lossStreaks.sort((a, b) => b.streak - a.streak);
  if (lossStreaks.length > 0) {
    superlatives.push({
      title: "Cold Streak",
      subtitle: "Longest consecutive losing streak of the season",
      teamName: teamMap[lossStreaks[0].teamId],
      teamId: lossStreaks[0].teamId,
      detail: `${lossStreaks[0].streak} losses in a row · avg ${lossStreaks[0].avgScore.toFixed(1)} pts`,
      runnersUp: lossStreaks.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `${t.streak} losses in a row · avg ${t.avgScore.toFixed(1)} pts`,
      })),
    });
  }

  // ── 13. Blowout Artist ──
  const blowoutData: { teamId: number; count: number; biggestMargin: number }[] = [];
  for (const [teamId, results] of teamMatchupResults) {
    let count = 0;
    let biggest = 0;
    for (const r of results) {
      if (r.won && r.margin > 100) {
        count++;
        biggest = Math.max(biggest, r.margin);
      }
    }
    if (count > 0) blowoutData.push({ teamId, count, biggestMargin: biggest });
  }
  blowoutData.sort((a, b) => b.count - a.count || b.biggestMargin - a.biggestMargin);
  if (blowoutData.length > 0) {
    const top = blowoutData[0];
    superlatives.push({
      title: "Blowout Artist",
      subtitle: "Loves to run up the score \u2014 most wins by 100+",
      teamName: teamMap[top.teamId],
      teamId: top.teamId,
      detail: `${top.count} blowout wins · biggest +${top.biggestMargin.toFixed(1)}`,
      runnersUp: blowoutData.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `${t.count} wins · +${t.biggestMargin.toFixed(1)} max`,
      })),
    });
  }

  // ── 14. Nail Biter King ──
  const closeGameData: { teamId: number; count: number; avgMargin: number }[] = [];
  for (const [teamId, results] of teamMatchupResults) {
    let count = 0;
    let totalMargin = 0;
    for (const r of results) {
      if (Math.abs(r.margin) < 20) {
        count++;
        totalMargin += Math.abs(r.margin);
      }
    }
    if (count > 0) closeGameData.push({ teamId, count, avgMargin: totalMargin / count });
  }
  closeGameData.sort((a, b) => b.count - a.count || a.avgMargin - b.avgMargin);
  if (closeGameData.length > 0) {
    const top = closeGameData[0];
    // Build matchup details for the winner using original matchups
    const nailBiterMatchups: { week: number; score: number; oppScore: number; oppName: string; won: boolean }[] = [];
    for (const m of matchups) {
      if (!m.away) continue;
      const margin = Math.abs(m.home.totalPoints - m.away.totalPoints);
      if (margin >= 20) continue;
      if (m.home.teamId === top.teamId) {
        nailBiterMatchups.push({
          week: m.matchupPeriodId,
          score: m.home.totalPoints,
          oppScore: m.away.totalPoints,
          oppName: teamMap[m.away.teamId],
          won: m.winner === "HOME",
        });
      } else if (m.away.teamId === top.teamId) {
        nailBiterMatchups.push({
          week: m.matchupPeriodId,
          score: m.away.totalPoints,
          oppScore: m.home.totalPoints,
          oppName: teamMap[m.home.teamId],
          won: m.winner === "AWAY",
        });
      }
    }
    nailBiterMatchups.sort((a, b) => a.week - b.week);
    superlatives.push({
      title: "Nail Biter King",
      subtitle: "Most games decided by fewer than 20 points",
      teamName: teamMap[top.teamId],
      teamId: top.teamId,
      detail: `${top.count} close games · avg margin ${top.avgMargin.toFixed(1)} pts`,
      closeGameMatchups: nailBiterMatchups,
      runnersUp: closeGameData.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `${t.count} games · ${t.avgMargin.toFixed(1)} avg`,
      })),
    });
  }

  // ── First/second half records (used for 15, 16, 20) ──
  const teamHalfRecords = new Map<
    number,
    { firstWins: number; firstLosses: number; secondWins: number; secondLosses: number }
  >();
  for (const [teamId, results] of teamMatchupResults) {
    let fw = 0,
      fl = 0,
      sw = 0,
      sl = 0;
    for (const r of results) {
      if (firstHalfWeeks.has(r.week)) {
        if (r.won) fw++;
        else fl++;
      } else if (secondHalfWeeks.has(r.week)) {
        if (r.won) sw++;
        else sl++;
      }
    }
    teamHalfRecords.set(teamId, {
      firstWins: fw,
      firstLosses: fl,
      secondWins: sw,
      secondLosses: sl,
    });
  }

  // ── 15. Slow Starter ──
  let slowStarter = {
    teamId: 0,
    firstWinPct: Infinity,
    firstW: 0,
    firstL: 0,
    secondW: 0,
    secondL: 0,
  };
  for (const [teamId, rec] of teamHalfRecords) {
    const firstTotal = rec.firstWins + rec.firstLosses;
    const secondTotal = rec.secondWins + rec.secondLosses;
    if (firstTotal === 0 || secondTotal === 0) continue;
    const firstPct = rec.firstWins / firstTotal;
    const secondPct = rec.secondWins / secondTotal;
    if (secondPct > firstPct && firstPct < slowStarter.firstWinPct) {
      slowStarter = {
        teamId,
        firstWinPct: firstPct,
        firstW: rec.firstWins,
        firstL: rec.firstLosses,
        secondW: rec.secondWins,
        secondL: rec.secondLosses,
      };
    }
  }
  if (slowStarter.teamId) {
    superlatives.push({
      title: "Slow Starter",
      subtitle: "Had the worst first-half record but turned it around",
      teamName: teamMap[slowStarter.teamId],
      teamId: slowStarter.teamId,
      detail: `1st: ${slowStarter.firstW}-${slowStarter.firstL}, 2nd: ${slowStarter.secondW}-${slowStarter.secondL}`,
    });
  }

  // ── 16. Second Half Surge ──
  let bestSurge = { teamId: 0, improvement: -Infinity };
  for (const [teamId, rec] of teamHalfRecords) {
    const firstTotal = rec.firstWins + rec.firstLosses;
    const secondTotal = rec.secondWins + rec.secondLosses;
    if (firstTotal === 0 || secondTotal === 0) continue;
    const firstPct = rec.firstWins / firstTotal;
    const secondPct = rec.secondWins / secondTotal;
    const improvement = secondPct - firstPct;
    if (improvement > bestSurge.improvement) {
      bestSurge = { teamId, improvement };
    }
  }
  if (bestSurge.teamId && bestSurge.improvement > 0) {
    superlatives.push({
      title: "Second Half Surge",
      subtitle: "Biggest win-rate jump from first half to second half",
      teamName: teamMap[bestSurge.teamId],
      teamId: bestSurge.teamId,
      detail: `+${Math.round(bestSurge.improvement * 100)}% win rate`,
    });
  }

  // ── 17. Rollercoaster ──
  let biggestSwing = { teamId: 0, avgSwing: 0 };
  for (const [teamId, weeks] of weeklyScores) {
    const scores = [...weeks.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, s]) => s);
    if (scores.length < 2) continue;
    let totalSwing = 0;
    for (let i = 1; i < scores.length; i++) {
      totalSwing += Math.abs(scores[i] - scores[i - 1]);
    }
    const avg = totalSwing / (scores.length - 1);
    if (avg > biggestSwing.avgSwing) {
      biggestSwing = { teamId, avgSwing: avg };
    }
  }
  if (biggestSwing.teamId) {
    superlatives.push({
      title: "Rollercoaster",
      subtitle: "Biggest average score swing from week to week",
      teamName: teamMap[biggestSwing.teamId],
      teamId: biggestSwing.teamId,
      detail: `\u00B1${biggestSwing.avgSwing.toFixed(1)} pts avg swing`,
    });
  }

  // ── 18. Trade Dealer ──
  const tradeCounts = teams
    .map((t) => ({
      teamId: t.id,
      trades: t.transactionCounter?.trades || 0,
    }))
    .sort((a, b) => b.trades - a.trades);
  if (tradeCounts.length > 0 && tradeCounts[0].trades > 0) {
    superlatives.push({
      title: "Trade Dealer",
      subtitle: "Most trades made all season",
      teamName: teamMap[tradeCounts[0].teamId],
      teamId: tradeCounts[0].teamId,
      detail: `${tradeCounts[0].trades} trades`,
      runnersUp: tradeCounts.slice(1, 5).filter((t) => t.trades > 0).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId, detail: `${t.trades} trades`,
      })),
    });
  }

  // ── 19. Injury Ward ──
  const irCounts = teams
    .map((t) => ({
      teamId: t.id,
      ir: t.transactionCounter?.moveToIR || 0,
    }))
    .sort((a, b) => b.ir - a.ir);
  if (irCounts.length > 0 && irCounts[0].ir > 0) {
    superlatives.push({
      title: "Injury Ward",
      subtitle: "Most moves to the injured reserve",
      teamName: teamMap[irCounts[0].teamId],
      teamId: irCounts[0].teamId,
      detail: `${irCounts[0].ir} IR moves`,
      runnersUp: irCounts.slice(1, 5).filter((t) => t.ir > 0).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId, detail: `${t.ir} IR moves`,
      })),
    });
  }

  // ── 20. First Half Hero ──
  let bestFirstHalf = { teamId: 0, wins: 0, losses: 0, winPct: -1 };
  for (const [teamId, rec] of teamHalfRecords) {
    const total = rec.firstWins + rec.firstLosses;
    if (total === 0) continue;
    const pct = rec.firstWins / total;
    if (
      pct > bestFirstHalf.winPct ||
      (pct === bestFirstHalf.winPct && rec.firstWins > bestFirstHalf.wins)
    ) {
      bestFirstHalf = {
        teamId,
        wins: rec.firstWins,
        losses: rec.firstLosses,
        winPct: pct,
      };
    }
  }
  if (bestFirstHalf.teamId) {
    superlatives.push({
      title: "First Half Hero",
      subtitle: "Best record through the first half of the season",
      teamName: teamMap[bestFirstHalf.teamId],
      teamId: bestFirstHalf.teamId,
      detail: `${bestFirstHalf.wins}-${bestFirstHalf.losses} record`,
    });
  }

  // ── 21. Weekly Warrior ──
  const weeklyHighData = new Map<number, { count: number; bestScore: number }>();
  for (const [, weekMatchups] of weekGroups) {
    let highScore = -Infinity;
    let highTeamId = 0;
    for (const m of weekMatchups) {
      if (m.home.totalPoints > highScore) {
        highScore = m.home.totalPoints;
        highTeamId = m.home.teamId;
      }
      if (m.away && m.away.totalPoints > highScore) {
        highScore = m.away.totalPoints;
        highTeamId = m.away.teamId;
      }
    }
    if (highTeamId) {
      const prev = weeklyHighData.get(highTeamId) || { count: 0, bestScore: 0 };
      prev.count++;
      prev.bestScore = Math.max(prev.bestScore, highScore);
      weeklyHighData.set(highTeamId, prev);
    }
  }
  const highEntries = [...weeklyHighData.entries()].sort((a, b) => b[1].count - a[1].count || b[1].bestScore - a[1].bestScore);
  if (highEntries.length > 0) {
    const [teamId, { count, bestScore }] = highEntries[0];
    superlatives.push({
      title: "Weekly Warrior",
      subtitle: "Most times posting the league's highest score in a week",
      teamName: teamMap[teamId],
      teamId,
      detail: `${count} weekly highs · best: ${bestScore.toFixed(1)} pts`,
      runnersUp: highEntries.slice(1, 5).map(([tid, d]) => ({
        teamName: teamMap[tid], teamId: tid,
        detail: `${d.count} weekly highs · best: ${d.bestScore.toFixed(1)} pts`,
      })),
    });
  }

  // ── 22. Bottom Feeder ──
  const weeklyLowData = new Map<number, { count: number; worstScore: number }>();
  for (const [, weekMatchups] of weekGroups) {
    let lowScore = Infinity;
    let lowTeamId = 0;
    for (const m of weekMatchups) {
      if (m.home.totalPoints < lowScore) {
        lowScore = m.home.totalPoints;
        lowTeamId = m.home.teamId;
      }
      if (m.away && m.away.totalPoints < lowScore) {
        lowScore = m.away.totalPoints;
        lowTeamId = m.away.teamId;
      }
    }
    if (lowTeamId) {
      const prev = weeklyLowData.get(lowTeamId) || { count: 0, worstScore: Infinity };
      prev.count++;
      prev.worstScore = Math.min(prev.worstScore, lowScore);
      weeklyLowData.set(lowTeamId, prev);
    }
  }
  const lowEntries = [...weeklyLowData.entries()].sort((a, b) => b[1].count - a[1].count || a[1].worstScore - b[1].worstScore);
  if (lowEntries.length > 0) {
    const [teamId, { count, worstScore }] = lowEntries[0];
    superlatives.push({
      title: "Bottom Feeder",
      subtitle: "Most times posting the league's lowest score in a week",
      teamName: teamMap[teamId],
      teamId,
      detail: `${count} weekly lows · worst: ${worstScore.toFixed(1)} pts`,
      runnersUp: lowEntries.slice(1, 5).map(([tid, d]) => ({
        teamName: teamMap[tid], teamId: tid,
        detail: `${d.count} weekly lows · worst: ${d.worstScore.toFixed(1)} pts`,
      })),
    });
  }

  // ── 23. Streaky Scorer ──
  const streakyCounts = new Map<number, number>();
  for (const [teamId, weeks] of weeklyScores) {
    const sortedEntries = [...weeks.entries()].sort((a, b) => a[0] - b[0]);
    let alternations = 0;
    let prevAbove: boolean | null = null;
    for (const [week, score] of sortedEntries) {
      const median = weeklyMedians.get(week) || 0;
      const above = score >= median;
      if (prevAbove !== null && above !== prevAbove) {
        alternations++;
      }
      prevAbove = above;
    }
    streakyCounts.set(teamId, alternations);
  }
  const streakyEntries = [...streakyCounts.entries()].sort((a, b) => b[1] - a[1]);
  if (streakyEntries.length > 0) {
    const [teamId, count] = streakyEntries[0];
    superlatives.push({
      title: "Streaky Scorer",
      subtitle: "Most weeks alternating between top-half and bottom-half scores",
      teamName: teamMap[teamId],
      teamId,
      detail: `${count} alternations`,
      runnersUp: streakyEntries.slice(1, 5).map(([tid, c]) => ({
        teamName: teamMap[tid], teamId: tid, detail: `${c} alternations`,
      })),
    });
  }

  // ── 24. Strength of Schedule ──
  const sosData: { teamId: number; avgOpponent: number }[] = [];
  for (const [teamId, results] of teamMatchupResults) {
    if (results.length === 0) continue;
    const totalOpp = results.reduce((s, r) => s + r.opponentScore, 0);
    sosData.push({ teamId, avgOpponent: totalOpp / results.length });
  }
  sosData.sort((a, b) => b.avgOpponent - a.avgOpponent);
  if (sosData.length > 0) {
    const top = sosData[0];
    superlatives.push({
      title: "Strength of Schedule",
      subtitle: "Faced the toughest opponents all season",
      teamName: teamMap[top.teamId],
      teamId: top.teamId,
      detail: `avg opponent: ${top.avgOpponent.toFixed(1)} pts/wk`,
      runnersUp: sosData.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `avg opponent: ${t.avgOpponent.toFixed(1)} pts/wk`,
      })),
    });
  }

  // ── 25. Draft Day MVP ──
  const draftProduction: { teamId: number; totalPts: number; playerCount: number }[] = [];
  for (const team of teams) {
    if (!team.roster?.entries) continue;
    let total = 0;
    let count = 0;
    for (const entry of team.roster.entries) {
      if (entry.acquisitionType !== "DRAFT") continue;
      const player = entry.playerPoolEntry?.player;
      if (!player) continue;
      const seasonStat = player.stats?.find(
        (s) => s.statSourceId === 0 && s.statSplitTypeId === 0
      );
      total += seasonStat?.appliedTotal || 0;
      count++;
    }
    if (count > 0) draftProduction.push({ teamId: team.id, totalPts: total, playerCount: count });
  }
  draftProduction.sort((a, b) => b.totalPts - a.totalPts);
  if (draftProduction.length > 0) {
    const top = draftProduction[0];
    superlatives.push({
      title: "Draft Day MVP",
      subtitle: "Their draft picks produced the most fantasy points",
      teamName: teamMap[top.teamId],
      teamId: top.teamId,
      detail: `${top.totalPts.toFixed(1)} pts from ${top.playerCount} drafted players`,
      runnersUp: draftProduction.slice(1, 5).map((t) => ({
        teamName: teamMap[t.teamId], teamId: t.teamId,
        detail: `${t.totalPts.toFixed(1)} pts from ${t.playerCount} drafted players`,
      })),
    });
  }

  return superlatives;
}

function computeTeamData(
  team: ESPNTeam,
  matchups: ESPNMatchup[],
  teamMap: Record<number, string>,
  teamAbbrevMap: Record<number, string>,
  seasonId: number
): TeamWrappedData {
  // Get weekly scores for this team
  const weeklyScores: number[] = [];
  const weeklyScoreMap = new Map<number, number>();

  for (const m of matchups) {
    if (m.home.teamId === team.id) {
      weeklyScores.push(m.home.totalPoints);
      weeklyScoreMap.set(m.matchupPeriodId, m.home.totalPoints);
    } else if (m.away?.teamId === team.id) {
      weeklyScores.push(m.away.totalPoints);
      weeklyScoreMap.set(m.matchupPeriodId, m.away.totalPoints);
    }
  }

  // Best and worst week
  let bestWeek: WeeklyRecord = {
    teamName: teamMap[team.id],
    teamId: team.id,
    week: 0,
    score: 0,
  };
  let worstWeek: WeeklyRecord = {
    teamName: teamMap[team.id],
    teamId: team.id,
    week: 0,
    score: Infinity,
  };

  for (const [week, score] of weeklyScoreMap) {
    if (score > bestWeek.score) {
      bestWeek = { teamName: teamMap[team.id], teamId: team.id, week, score };
    }
    if (score > 0 && score < worstWeek.score) {
      worstWeek = { teamName: teamMap[team.id], teamId: team.id, week, score };
    }
  }
  if (worstWeek.score === Infinity) worstWeek.score = 0;

  // Team MVP and best pickup
  let mvpPlayer: PlayerHighlight | null = null;
  let bestPickup: PlayerHighlight | null = null;

  if (team.roster?.entries) {
    for (const entry of team.roster.entries) {
      const player = entry.playerPoolEntry?.player;
      if (!player) continue;

      const seasonStat = player.stats?.find(
        (s) => s.statSourceId === 0 && s.statSplitTypeId === 0 && s.seasonId === seasonId
      );
      const total = seasonStat?.appliedTotal || 0;

      const highlight: PlayerHighlight = {
        playerName: player.fullName,
        playerId: entry.playerId,
        teamName: teamMap[team.id],
        teamId: team.id,
        totalPoints: total,
        acquisitionType: entry.acquisitionType,
        position: POSITION_MAP[player.defaultPositionId] || "UTIL",
      };

      if (!mvpPlayer || total > mvpPlayer.totalPoints) {
        mvpPlayer = highlight;
      }

      if (entry.acquisitionType === "ADD") {
        if (!bestPickup || total > bestPickup.totalPoints) {
          bestPickup = highlight;
        }
      }
    }
  }

  // H2H rivals
  const rivalsMap = new Map<
    number,
    { wins: number; losses: number; ties: number }
  >();
  for (const m of matchups) {
    if (!m.away) continue;
    let opponentId: number | null = null;
    let didWin = false;
    let didTie = false;

    if (m.home.teamId === team.id) {
      opponentId = m.away.teamId;
      didWin = m.winner === "HOME";
      didTie = m.home.totalPoints === m.away.totalPoints;
    } else if (m.away.teamId === team.id) {
      opponentId = m.home.teamId;
      didWin = m.winner === "AWAY";
      didTie = m.home.totalPoints === m.away.totalPoints;
    }

    if (opponentId !== null) {
      const existing = rivalsMap.get(opponentId) || {
        wins: 0,
        losses: 0,
        ties: 0,
      };
      if (didTie) existing.ties++;
      else if (didWin) existing.wins++;
      else existing.losses++;
      rivalsMap.set(opponentId, existing);
    }
  }

  const rivals: RivalRecord[] = [...rivalsMap.entries()].map(
    ([oppId, record]) => ({
      opponentName: teamMap[oppId],
      opponentId: oppId,
      ...record,
    })
  );

  // Standings rank
  const allTeamsSorted = [...Object.keys(teamMap)]
    .map(Number)
    .sort((a, b) => a - b);

  return {
    teamId: team.id,
    teamName: teamMap[team.id],
    abbrev: teamAbbrevMap[team.id] || team.abbrev,
    logo: team.logo,
    record: {
      wins: team.record.overall.wins,
      losses: team.record.overall.losses,
      ties: team.record.overall.ties,
    },
    rank: team.playoffSeed || team.rankCalculatedFinal || 0,
    pointsFor: team.record.overall.pointsFor || team.points || 0,
    bestWeek,
    worstWeek,
    mvpPlayer,
    bestPickup,
    weeklyScores,
    totalTransactions:
      team.transactionCounter?.acquisitions || 0,
    rivals,
  };
}

// ─── Team Awards (Yearbook) ───

const SUPERLATIVE_PRIORITY = [
  // Tier 1: Impressive
  "Scoring Machine", "Hot Streak", "Weekly Warrior", "Blowout Artist", "Draft Day MVP",
  // Tier 2: Positive
  "Most Active GM", "Trade Dealer", "Second Half Surge", "First Half Hero", "Overachiever", "Nail Biter King",
  // Tier 3: Neutral
  "Strength of Schedule", "Streaky Scorer", "Rollercoaster", "Lucky Winner", "Slow Starter", "Couch Potato GM",
  // Tier 4: Roasty
  "Easy Street", "Injury Ward", "Heartbreak Kid", "Punching Bag", "Underachiever", "Cold Streak", "Bottom Feeder",
];

function computeTeamAwards(
  champion: StandingEntry,
  superlatives: Superlative[],
  standings: StandingEntry[],
  teamData: Record<number, TeamWrappedData>,
): TeamAward[] {
  const awards = new Map<number, TeamAward>();
  const usedTitles = new Set<string>();

  // 1. #1 Seed gets their award
  awards.set(champion.teamId, {
    teamId: champion.teamId,
    teamName: champion.teamName,
    title: "#1 Seed",
    detail: `${champion.wins}-${champion.losses}${champion.ties > 0 ? `-${champion.ties}` : ""} record`,
  });
  usedTitles.add("#1 Seed");

  // 2. Build superlative lookup: title → Superlative
  const supByTitle = new Map<string, Superlative>();
  for (const s of superlatives) {
    supByTitle.set(s.title, s);
  }

  // 3. Assign superlatives by priority order
  for (const title of SUPERLATIVE_PRIORITY) {
    const sup = supByTitle.get(title);
    if (!sup) continue;
    if (usedTitles.has(title)) continue;

    // Get the primary team (handle tied teams)
    const teams = sup.tiedTeams || [{ teamName: sup.teamName, teamId: sup.teamId }];
    for (const team of teams) {
      if (!awards.has(team.teamId) && !usedTitles.has(title)) {
        awards.set(team.teamId, {
          teamId: team.teamId,
          teamName: team.teamName,
          title: sup.title,
          detail: sup.detail,
        });
        usedTitles.add(title);
        break; // Only assign each title once
      }
    }
  }

  // 4. Fallback for teams with no award
  for (const standing of standings) {
    if (awards.has(standing.teamId)) continue;

    const td = teamData[standing.teamId];
    let title = "Season Veteran";
    let detail = `${standing.wins}-${standing.losses} record`;

    if (td) {
      // Try to find something unique about them
      if (td.bestWeek && td.bestWeek.score > 0) {
        title = "Peak Performer";
        detail = `${td.bestWeek.score.toFixed(1)} pts in Week ${td.bestWeek.week}`;
      } else if (td.totalTransactions > 0) {
        title = "Roster Tinkerer";
        detail = `${td.totalTransactions} moves`;
      }
    }

    // Check for runner-up in superlatives
    for (const sup of superlatives) {
      if (!sup.runnersUp) continue;
      const runnerIdx = sup.runnersUp.findIndex(r => r.teamId === standing.teamId);
      if (runnerIdx === 0) {
        // They were 2nd in this superlative
        title = `Almost ${sup.title}`;
        detail = sup.runnersUp[runnerIdx].detail;
        break;
      }
    }

    awards.set(standing.teamId, {
      teamId: standing.teamId,
      teamName: standing.teamName,
      title,
      detail,
    });
  }

  // Return in standings order
  return standings.map(s => awards.get(s.teamId)!).filter(Boolean);
}
