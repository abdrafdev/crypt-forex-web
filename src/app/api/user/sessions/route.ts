import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    console.log("Sessions API called");

    // Get authorization header
    const authHeader = req.headers.get("authorization");
    console.log("Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization token provided");
      return NextResponse.json(
        { success: false, message: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log("Token extracted:", token.substring(0, 20) + "...");

    const payload = verifyToken(token);
    console.log("Token verification result:", payload ? "Valid" : "Invalid");

    if (!payload || !payload.userId) {
      console.log("Invalid token payload");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    console.log("Getting sessions for user:", payload.userId);

    // Get user sessions
    const sessions = await SessionManager.getUserSessions(payload.userId);
    console.log("Sessions found:", sessions.length);

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        id: session.id,
        deviceInfo: session.deviceInfo,
        location: session.location || "Unknown",
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
        isCurrentSession: false, // You could implement current session detection
      })),
      totalSessions: sessions.length,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Find the session and verify it belongs to the user
    const session = await SessionManager.getUserSessions(payload.userId);
    const targetSession = session.find((s) => s.id === sessionId);

    if (!targetSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found or doesn't belong to user",
        },
        { status: 404 }
      );
    }

    // Deactivate the session
    await SessionManager.deleteSession(targetSession.sessionToken);

    return NextResponse.json({
      success: true,
      message: "Session terminated successfully",
    });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
