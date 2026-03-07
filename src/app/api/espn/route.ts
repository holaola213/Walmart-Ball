import { NextRequest, NextResponse } from "next/server";

const ESPN_BASE =
  "https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const leagueId = searchParams.get("leagueId");
  const year = searchParams.get("year");
  const views = searchParams.get("views");

  if (!leagueId || !year) {
    return NextResponse.json(
      { error: "Missing leagueId or year" },
      { status: 400 }
    );
  }

  const url = `${ESPN_BASE}/${year}/segments/0/leagues/${leagueId}`;
  const params = new URLSearchParams();

  if (views) {
    views.split(",").forEach((v) => params.append("view", v.trim()));
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
