"use client";

import { useState, useEffect } from "react";
import { processWrappedData } from "@/lib/data-processor";
import { WrappedData } from "@/lib/types";
import { LEAGUE_ID, SEASON_YEAR } from "@/lib/constants";

export type FetchStatus = "idle" | "loading" | "processing" | "success" | "error";

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
      setProgress(70);

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
      };

      // Process
      setStatus("processing");
      setProgress(90);
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
