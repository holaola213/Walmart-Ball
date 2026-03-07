import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith("https://mystique-api.fantasy.espn.com/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const espnS2 = process.env.ESPN_S2 || "";
  const swid = process.env.SWID || "";
  const cookieParts: string[] = [];
  if (espnS2) cookieParts.push(`espn_s2=${espnS2}`);
  if (swid) cookieParts.push(`SWID=${swid}`);

  try {
    const response = await fetch(url, {
      headers: cookieParts.length > 0 ? { Cookie: cookieParts.join("; ") } : {},
      cache: "force-cache",
    });

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
