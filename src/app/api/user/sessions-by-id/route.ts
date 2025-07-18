import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("Sessions-by-id API called");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      console.log("No userId provided");
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Getting sessions for user:", userId);

    // Get user sessions
    const sessions = await SessionManager.getUserSessions(userId);
    console.log("Sessions found:", sessions.length);

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session) => ({
        id: session.id,
        deviceInfo: session.deviceInfo || "Unknown Device",
        location: session.location || "Unknown Location",
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
    const userId = searchParams.get("userId");

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, message: "Session ID and User ID are required" },
        { status: 400 }
      );
    }

    console.log("Terminating session:", sessionId, "for user:", userId);

    // Verify that the session belongs to the user
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the session
    await SessionManager.deleteSession(session.sessionToken);

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
