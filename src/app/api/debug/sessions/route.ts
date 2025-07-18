import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all sessions with user info for debugging
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      totalSessions: sessions.length,
      sessions: sessions.map((session) => ({
        id: session.id,
        userId: session.userId,
        userEmail: session.user.email,
        deviceInfo: session.deviceInfo,
        location: session.location,
        ipAddress: session.ipAddress,
        isActive: session.isActive,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
        expires: session.expires,
      })),
    });
  } catch (error) {
    console.error("Debug sessions error:", error);
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
