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
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.hasPassowred = user.hasPassowred;
        token.phone = user.phone;
      }
      if (trigger === "update" && session?.image) {
        token.picture = session.image == "delete" ? null : session.image ;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (trigger === "update" && session?.phone) {
        token.phone = session.phone;
      }
 
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token, trigger, newSession }) {
      session.user.id = token.id as string;
      session.user.emailVerified = token.emailVerified as Date | null;
      session.user.hasPassowred = token.hasPassowred;
      session.user.provider = token.provider;
      session.user.phone = token.phone;
      // if (trigger === "update" && newSession?.image) {
      //   session.user.picture = newSession.image == "delete" ? null : newSession.image ;
      // }
      // if (trigger === "update" && newSession?.name) {
      //   session.user.name = newSession.name;
      // }
      // if (trigger === "update" && newSession?.phone) {
      //   session.user.phone = newSession.phone;
      // }
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
