// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyPassword, validateEmail } from "@/lib/auth";
// import { signToken } from "@/lib/jwt";
//
// interface LoginRequest {
//   email: string;
//   password: string;
// }
//
// interface LoginResponse {
//   success: boolean;
//   message: string;
//   user?: {
//     id: string;
//     email: string;
//     username: string;
//     name: string | null;
//   };
//   token?: string;
//   errors?: string[];
// }
//
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;
//
//     // Input validation
//     const errors: string[] = [];
//
//     if (!email || !password) {
//       errors.push("Email and password are required");
//     }
//
//     if (email && !validateEmail(email)) {
//       errors.push("Invalid email format");
//     }
//
//     if (errors.length > 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors,
//         } as LoginResponse,
//         { status: 400 }
//       );
//     }
//
//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: {
//         email: email.toLowerCase().trim(),
//       },
//       select: {
//         id: true,
//         email: true,
//         username: true,
//         name: true,
//         password: true,
//         isActive: true,
//       },
//     });
//
//     if (!user || !user.isActive) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }
//
//     // Verify password
//     const isValidPassword = await verifyPassword(password, user.password);
//
//     if (!isValidPassword) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }
//
//     // Generate JWT token using utility
//     const token = signToken({
//       userId: user.id,
//       email: user.email,
//       username: user.username,
//     });
//
//     // Return success response
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user.id,
//           email: user.email,
//           username: user.username,
//           name: user.name,
//         },
//         token,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
//
// export async function GET() {
//   return NextResponse.json(
//     { message: "Login API is running. Use POST method." },
//     { status: 200 }
//   );
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, validateEmail } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    firstName?: string | null;
    lastName?: string | null;
    emailVerified?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
  token?: string;
  errors?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Input validation
    const errors: string[] = [];

    if (!email || !password) {
      errors.push("Email and password are required");
    }

    if (email && !validateEmail(email)) {
      errors.push("Invalid email format");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        firstName: true,
        lastName: true,
        password: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token using utility
    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Login API is running. Use POST method." },
    { status: 200 }
  );
}
