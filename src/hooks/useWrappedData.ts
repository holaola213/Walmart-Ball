"use client";

import { useState } from "react";
import { processWrappedData } from "@/lib/data-processor";
import { ESPNMatchup, ESPNTeam, WrappedData } from "@/lib/types";
import { LEAGUE_ID, SEASON_YEAR } from "@/lib/constants";

export type FetchStatus = "idle" | "loading" | "processing" | "success" | "error";

function getHistoricalScoringPeriods(matchups: ESPNMatchup[], latestScoringPeriod: number): number[] {
  const periods = new Set<number>();

  for (const matchup of matchups) {
    if (!matchup.away || matchup.playoffTierType) continue;

    for (const side of [matchup.home, matchup.away]) {
      for (const value of Object.keys(side?.pointsByScoringPeriod || {})) {
        const scoringPeriod = Number(value);
        if (
          Number.isFinite(scoringPeriod) &&
          scoringPeriod > 0 &&
          scoringPeriod <= latestScoringPeriod
        ) {
          periods.add(scoringPeriod);
        }
      }
    }
  }

  return [...periods].sort((a, b) => a - b);
}

async function fetchHistoricalRosters(
  base: string,
  scoringPeriods: number[],
  onProgress: (completed: number, total: number) => void
): Promise<Record<number, ESPNTeam[]>> {
  const historicalRostersByScoringPeriod: Record<number, ESPNTeam[]> = {};
  const chunkSize = 12;

  for (let start = 0; start < scoringPeriods.length; start += chunkSize) {
    const chunk = scoringPeriods.slice(start, start + chunkSize);
    const results = await Promise.all(
      chunk.map(async (scoringPeriodId) => {
        const response = await fetch(
          `${base}&views=mRoster&scoringPeriodId=${scoringPeriodId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch roster snapshot for scoring period ${scoringPeriodId}`);
        }

        const data = await response.json();
        return { scoringPeriodId, teams: (data.teams || []) as ESPNTeam[] };
      })
    );

    for (const result of results) {
      historicalRostersByScoringPeriod[result.scoringPeriodId] = result.teams;
    }

    onProgress(Math.min(start + chunk.length, scoringPeriods.length), scoringPeriods.length);
  }

  return historicalRostersByScoringPeriod;
}

export function useWrappedData() {
  const [data, setData] = useState<WrappedData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fetchData = async () => {
    if (!LEAGUE_ID) {
      setError("League ID not configured. Set NEXT_PUBLIC_LEAGUE_ID in .env.local");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setProgress(0);
    setError(null);

    try {
      const base = `/api/espn?leagueId=${LEAGUE_ID}&year=${SEASON_YEAR}`;

      // Fetch 1: Teams, Settings, Standings
      setProgress(10);
      const res1 = await fetch(`${base}&views=mTeam,mSettings,mStandings,mRoster`);
      if (!res1.ok) {
        const err = await res1.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `ESPN returned ${res1.status}`);
      }
      const leagueBase = await res1.json();
      setProgress(40);

      // Fetch 2: Matchups
      const res2 = await fetch(`${base}&views=mMatchup`);
      if (!res2.ok) throw new Error("Failed to fetch matchup data");
      const matchupData = await res2.json();
      setProgress(55);

      const historicalScoringPeriods = getHistoricalScoringPeriods(
        matchupData.schedule || [],
        matchupData.status?.latestScoringPeriod ||
          leagueBase.status?.latestScoringPeriod ||
          0
      );

      const historicalRostersByScoringPeriod =
        historicalScoringPeriods.length > 0
          ? await fetchHistoricalRosters(
              base,
              historicalScoringPeriods,
              (completed, total) => {
                const ratio = total === 0 ? 1 : completed / total;
                setProgress(55 + ratio * 25);
              }
            )
          : {};
      setProgress(80);

      // Fetch 3: Transactions
      const res3 = await fetch(`${base}&views=mTransactions2`);
      // Transactions may not be available for all leagues, so we don't throw
      const transactionData = res3.ok
        ? await res3.json()
        : { transactions: [] };
      setProgress(85);

      // Merge responses
      const merged = {
        ...leagueBase,
        schedule: matchupData.schedule || leagueBase.schedule || [],
        transactions: transactionData.transactions || [],
        historicalRostersByScoringPeriod,
      };

      // Process
      setStatus("processing");
      setProgress(92);
      const wrapped = processWrappedData(merged);
      setProgress(100);

      setData(wrapped);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return { data, status, error, progress, fetchData };
}
