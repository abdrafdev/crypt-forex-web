import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

console.log("Simple NextAuth initialization starting...");

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && user.email) {
          // Check if user exists
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user
            const username =
              user.email.split("@")[0] +
              "_" +
              Math.random().toString(36).substr(2, 4);

            existingUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                firstName: (profile as any)?.given_name || "",
                lastName: (profile as any)?.family_name || "",
                avatar: user.image || "",
                username: username,
                password: "", // Google users don't need a password
                emailVerified: new Date(),
              },
            });
            console.log("Created new user:", existingUser);
          } else {
            // Update existing user with latest Google info
            existingUser = await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name || existingUser.name,
                firstName:
                  (profile as any)?.given_name || existingUser.firstName,
                lastName:
                  (profile as any)?.family_name || existingUser.lastName,
                avatar: user.image || existingUser.avatar,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            });
            console.log("Updated existing user:", existingUser);
          }

          // Store user ID in the user object for later use
          user.id = existingUser.id;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect callback:", { url, baseUrl });

      // Always redirect to dashboard after successful login
      if (url.includes("/callback") || url.includes("/signin")) {
        return `${baseUrl}/dashboard`;
      }

      // If URL is relative, resolve it against the base URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // If URL is the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account && user) {
        // Get user data from database
        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              emailVerified: true,
              isActive: true,
              kycStatus: true,
            },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.avatar = dbUser.avatar;
            token.emailVerified = dbUser.emailVerified;
            token.isActive = dbUser.isActive;
            token.kycStatus = dbUser.kycStatus;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = (token.avatar as string) || session.user.image;
        session.user.emailVerified = token.emailVerified as Date;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
