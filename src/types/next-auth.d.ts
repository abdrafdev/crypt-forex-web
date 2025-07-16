import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      firstName?: string | null;
      lastName?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    isActive?: boolean;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    emailVerified?: Date | null;
  }
}
