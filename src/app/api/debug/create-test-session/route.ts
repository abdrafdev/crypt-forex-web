import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Creating test session for user:", userId);

    // Create a test session
    const sessionToken = Math.random().toString(36).substring(2, 15);
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await SessionManager.createSessionWithRequest(
      userId,
      sessionToken,
      sessionExpires,
      req
    );

    return NextResponse.json({
      success: true,
      message: "Test session created successfully",
      sessionToken,
    });
  } catch (error) {
    console.error("Create test session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to create a test session",
    example: { userId: "user_id_here" },
  });
}
