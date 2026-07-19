import { NextResponse } from "next/server";

export async function GET(request: Request) {

  console.log("========== CALLBACK GET ==========");

  console.log(request.url);

  return NextResponse.json({
    method: "GET",
    url: request.url
  });

}

export async function POST(request: Request) {

  console.log("========== CALLBACK POST ==========");

  const text = await request.text();

  console.log(text);

  return NextResponse.json({
    success: true
  });

}