import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";

export async function POST() {
  try {
    await SessionManager.cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      message: "Expired sessions cleaned up successfully",
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Session cleanup endpoint. Use POST to trigger cleanup." },
    { status: 200 }
  );
}
