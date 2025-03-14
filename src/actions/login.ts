"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendVerification } from "./send-verification";
import { AuthError } from "next-auth";

export const checkEmail = async (email: string ) => {
  if (!email) {
    return { error: "Please enter email" };
  }
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      error: "No account found with this email. Please check and try again.",
    };
  }
  return {success:true}
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    return { error: "Please enter email and password" };
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user || !user.password) {
    return { error: "Invalid Email" };
  }
  if (!user.emailVerified) {
    await sendVerification(email);
    return { error: "EmailNotVerified" };
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    console.log("Login error:", error);
    if (error instanceof AuthError)
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Password" };
        default:
          return { error: "Something went wrong" };
      }
    throw error;
  }
};
