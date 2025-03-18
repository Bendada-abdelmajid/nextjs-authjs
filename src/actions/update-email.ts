"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const updateEmail = async (email: string, code: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "User not found" };
  }
  if (!email) {
    return { error: "Email are required" };
  }
  if (!code) {
    return { error: "code are required" };
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });

  if (
    !verificationToken ||
    verificationToken.token !== code ||
    verificationToken.expires < new Date()
  ) {
    return { error: "Invalid or expired verification code" };
  }
  await prisma.user.update({
    data: { email },
    where: { id: userId },
  });

  // Delete the token after verification
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });

  return { success: "Email updated successfully!" };
};
