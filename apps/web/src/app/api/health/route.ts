import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "8thGuard",
    timestamp: new Date().toISOString()
  });
}
