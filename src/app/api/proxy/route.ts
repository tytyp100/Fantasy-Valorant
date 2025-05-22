import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url"); // Get the external API URL from query params

  if (!url) {
    return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Return the response from the external API
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}