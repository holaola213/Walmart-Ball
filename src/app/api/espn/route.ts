import { NextRequest, NextResponse } from "next/server";

const ESPN_BASE =
  "https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons";
const COMMUNICATION_VIEW = "kona_league_communication";
const ACTIVITY_FILTER_TYPE = "ACTIVITY_TRANSACTIONS";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const leagueId = searchParams.get("leagueId");
  const year = searchParams.get("year");
  const views = searchParams.get("views");
  const scoringPeriodId = searchParams.get("scoringPeriodId");
  const resource = searchParams.get("resource");
  const activityLimit = Number(searchParams.get("activityLimit") || "1000");
  const activityMessageTypeIds = (searchParams.get("activityMessageTypeIds") || "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));

  if (!leagueId || !year) {
    return NextResponse.json(
      { error: "Missing leagueId or year" },
      { status: 400 }
    );
  }

  const isCommunicationRequest = resource === "communication";
  const url = isCommunicationRequest
    ? `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}/communication/`
    : `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}`;
  const params = new URLSearchParams();

  if (isCommunicationRequest) {
    params.set("view", COMMUNICATION_VIEW);
  } else {
    if (views) {
      views.split(",").forEach((v) => params.append("view", v.trim()));
    }
    if (scoringPeriodId) {
      params.set("scoringPeriodId", scoringPeriodId);
    }
  }

  // Read auth cookies from server-side env vars (private league support)
  const espnS2 = process.env.ESPN_S2 || "";
  const swid = process.env.SWID || "";
  const cookieParts: string[] = [];
  if (espnS2 && espnS2 !== "your_espn_s2_cookie_here") {
    cookieParts.push(`espn_s2=${espnS2}`);
  }
  if (swid && swid !== "your_swid_cookie_here") {
    cookieParts.push(`SWID=${swid}`);
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (cookieParts.length > 0) {
      headers["Cookie"] = cookieParts.join("; ");
    }
    if (isCommunicationRequest) {
      headers["X-Fantasy-Source"] = "kona";
      headers["X-Fantasy-Platform"] = "espn-fantasy-web";
      headers["X-Fantasy-Filter"] = JSON.stringify({
        topics: {
          filterType: { value: [ACTIVITY_FILTER_TYPE] },
          limit: activityLimit,
          limitPerMessageSet: { value: activityLimit },
          sortMessageDate: { sortPriority: 1, sortAsc: false },
          ...(activityMessageTypeIds.length > 0
            ? { filterIncludeMessageTypeIds: { value: activityMessageTypeIds } }
            : {}),
        },
      });
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const status = response.status;
      let message = "Failed to fetch from ESPN";
      if (status === 401) message = "League is private. Authentication required.";
      if (status === 404) message = "League not found. Check your League ID and season year.";
      return NextResponse.json({ error: message }, { status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to ESPN. Please try again." },
      { status: 502 }
    );
  }
}
