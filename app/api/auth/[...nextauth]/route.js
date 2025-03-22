// In your [...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/libs/next-auth";

const handler = NextAuth({
  ...authOptions,
  pages: {
    error: '/signin',
    verifyRequest: '/signin',
  },
  callbacks: {
    ...authOptions.callbacks, // Keep any existing callbacks from authOptions
    async session({ session, token, user }) {
      if (session?.user) {
        // Use token-based session management
        session.user.variantId = token.variantId;
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // Add user data to the token when signing in
        token.variantId = user.variantId;
        token.id = user.id;
      }
      return token;
    }
  },
});

export { handler as GET, handler as POST };