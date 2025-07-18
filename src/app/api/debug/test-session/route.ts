import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🧪 Testing session creation for user:", userId);

    // Test session creation with current request
    const sessionToken = randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await SessionManager.createSessionWithRequest(
      userId,
      sessionToken,
      sessionExpires,
      req
    );

    return NextResponse.json({
      success: true,
      message: "Test session created successfully",
      sessionToken: sessionToken.substring(0, 8) + "...",
    });
  } catch (error) {
    console.error("Test session creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Test session creation endpoint. Use POST with { userId: 'user-id' }",
    },
    { status: 200 }
  );
}
