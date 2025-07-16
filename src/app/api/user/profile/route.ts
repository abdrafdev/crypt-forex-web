import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

async function getProfile(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    let user;

    if (email) {
      // Fetch user by email (for NextAuth integration)
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          firstName: true,
          lastName: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Fetch user by ID from auth token
      const userId = req.user!.userId;
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          firstName: true,
          lastName: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Handle requests with or without authentication
async function handleProfileRequest(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (email) {
    // For email-based requests (NextAuth), don't require authentication
    return getProfile(req as AuthenticatedRequest);
  } else {
    // For token-based requests, require authentication
    return withAuth(getProfile)(req as AuthenticatedRequest);
  }
}

export const GET = handleProfileRequest;
