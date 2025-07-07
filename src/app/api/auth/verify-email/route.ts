import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get token from query parameters
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token is required",
        },
        { status: 400 }
      );
    }

    // Import Prisma
    const { prisma } = await import("@/lib/prisma");

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification token",
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          token,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Verification token has expired",
        },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    // Redirect to login page with success message
    return NextResponse.redirect(
      new URL(`/login?verified=true`, req.nextUrl.origin)
    );
  } catch (error: any) {
    console.error("Error verifying email:", error);

    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error.message}`,
        debug: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}