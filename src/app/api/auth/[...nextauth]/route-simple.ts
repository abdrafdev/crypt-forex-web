import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

console.log("Simple NextAuth initialization starting...");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
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

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub!;
        session.user.username = session.user.email?.split("@")[0] || "";
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
