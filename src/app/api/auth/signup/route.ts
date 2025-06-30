import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Signup API called");

    // Test basic functionality first
    const body = await req.json();
    console.log("📝 Request body:", body);

    // Test imports one by one
    console.log("🔄 Testing Prisma import...");
    const { prisma } = await import("@/lib/prisma");
    console.log("✅ Prisma imported successfully");

    console.log("🔄 Testing auth utilities import...");
    const { hashPassword, validateEmail, validatePassword, validateUsername } =
      await import("@/lib/auth");
    console.log("✅ Auth utilities imported successfully");

    const { email, username, password, name } = body;

    // Input validation
    const errors: string[] = [];

    if (!email || !username || !password) {
      errors.push("Email, username, and password are required");
    }

    if (email && !validateEmail(email)) {
      errors.push("Invalid email format");
    }

    if (username) {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        errors.push(usernameValidation.message!);
      }
    }

    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        errors.push(passwordValidation.message!);
      }
    }

    if (errors.length > 0) {
      console.log("❌ Validation errors:", errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    console.log("🔄 Testing database connection...");

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() },
        ],
      },
    });

    console.log(
      "✅ Database query successful, existing user:",
      existingUser ? "found" : "not found"
    );

    if (existingUser) {
      const conflictField =
        existingUser.email === email.toLowerCase().trim()
          ? "email"
          : "username";
      return NextResponse.json(
        {
          success: false,
          message: `A user with this ${conflictField} already exists`,
        },
        { status: 409 }
      );
    }

    console.log("🔄 Hashing password...");
    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log("✅ Password hashed successfully");

    console.log("🔄 Creating user in database...");
    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        name: name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
      },
    });

    console.log("✅ User created successfully:", newUser.id);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Welcome to CryptoForex.",
        user: {
          ...newUser,
          createdAt: newUser.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("💥 Detailed error in signup API:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
      name: error.name,
    });

    // Handle Prisma unique constraint errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email or username already exists",
        },
        { status: 409 }
      );
    }

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

export async function GET() {
  return NextResponse.json(
    { message: "Signup API is running. Use POST method." },
    { status: 200 }
  );
}
