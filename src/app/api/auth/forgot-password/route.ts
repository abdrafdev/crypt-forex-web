import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Get email from request body
    const { email } = await req.json();

    console.log("EMAIL : " + email)

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // Import Prisma and email utilities
    const { prisma } = await import("@/lib/prisma");
    const { sendPasswordResetEmail } = await import("@/lib/email");
    const { validateEmail } = await import("@/lib/auth");

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    // For security reasons, don't reveal if the email exists or not
    // Always return success even if the email doesn't exist
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If your email is registered, you will receive a password reset link",
        },
        { status: 200 }
      );
    }

    // Delete any existing password reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email.toLowerCase().trim(),
      },
    });

    // Generate password reset token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    console.log("TOKEN : " + token)

    // Store password reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase().trim(),
        token,
        expires,
      },
    });

    console.log("NEAR TO SENDING MAIL")
    // Send password reset email
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await sendPasswordResetEmail(email.toLowerCase().trim(), token, baseUrl);

    return NextResponse.json(
      {
        success: true,
        message: "If your email is registered, you will receive a password reset link",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error requesting password reset:", error);

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