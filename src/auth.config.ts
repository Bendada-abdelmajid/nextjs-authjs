import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
// import { sendVerification } from "./app/actions/send-verfication";
import { compare } from "bcryptjs";
import Google from "next-auth/providers/google";
import Linkedin from "next-auth/providers/linkedin";

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      
    }),
    Linkedin({allowDangerousEmailAccountLinking: true }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const email = credentials.email as string;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user || !user.password) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }
        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }
        console.log("user ahmade",user)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          hasPassowred: user.password ? true : false,
          phone:user.phoneNumber||""
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
