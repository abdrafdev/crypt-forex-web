import { JWTPayload } from "@/types/jwt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
    issuer: "cryptoforex-app",
    audience: "cryptoforex-users",
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "cryptoforex-app",
      audience: "cryptoforex-users",
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function refreshToken(oldToken: string): string | null {
  const payload = verifyToken(oldToken);
  if (!payload) return null;

  // Create new token with fresh expiration
  const { iat, exp, ...freshPayload } = payload;
  return signToken(freshPayload);
}
export type { JWTPayload };

