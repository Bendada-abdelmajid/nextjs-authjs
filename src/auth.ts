import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";
export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        data: {
          emailVerified: new Date(),
        },
        where: {
          id: user.id,
        },
      });
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.hasPassowred = user.hasPassowred;
      }
      if (trigger === "update" && session?.image) {
        console.log("hi");
        console.log(token);
        token.picture = null;
      }
      return token;
    },
    async session({ session, token, trigger, newSession, user }) {
      session.user.id = token.id as string;
      session.user.emailVerified = token.emailVerified as Date | null;
      session.user.hasPassowred = token.hasPassowred;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
