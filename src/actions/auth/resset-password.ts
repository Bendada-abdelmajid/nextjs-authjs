"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendVerification } from "../send-verification";
import { cookies } from "next/headers";

export const sendCodeForPasswordReset = async () => {
   const email = (await cookies()).get("login_email")?.value;
   if (!email) {
     return { error: "Please enter email" };
   }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "No account found with this email. Please check and try again." };
  }

  if (!user.password) {
    return { error: "This account does not have a password. Try logging in with a provider." };
  }

  await sendVerification(email);

  return { success: "Reset password code sent successfully!" };
};

export const resetPassword = async ({
  password,
  confirmPassword,
  email,
}: {
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  if (!email) {
    return { error: "Email is required" };
  }

  if (!password || !confirmPassword) {
    return { error: "Missing required fields" };
  }

  if (password !== confirmPassword) {
    return { error: "New password and confirmation do not match" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "No account found with this email. Please check and try again." };
  }

  if (!user.password) {
    return { error: "This account does not have a password. Try logging in with a provider." };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "Password reset successfully!" };
};
