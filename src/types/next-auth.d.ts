// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    emailVerified?: Date | null;
    hasPassowred?:boolean;
  }
  interface Session {
    user: {
      id: string;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }
}