import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

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
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.hasPassowred = user.hasPassowred;
        token.phone = user.phone;
      }
      if (trigger === "update" && session?.image) {
        token.picture = session.image == "delete" ? null : session.image;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (trigger === "update" && session?.phone) {
        token.phone = session.phone;
      }
      if (trigger === "update" && session?.email) {
        token.email = session.email;
      }

      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.emailVerified = token.emailVerified as Date | null;
      session.user.hasPassowred = token.hasPassowred;
      session.user.provider = token.provider;
      session.user.phone = token.phone;

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
