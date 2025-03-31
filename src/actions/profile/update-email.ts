"use server";

import { auth, unstable_update } from "@/auth";
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


  if (!verificationToken) {
    return { error: "Verification token is missing" };
  }
  
  if (verificationToken.token !== code) {
    return { error: "Invalid verification code" };
  }
  
  if (verificationToken.expires < new Date()) {
    return { error: "Verification code has expired" };
  }
  
  await prisma.user.update({
    data: { email },
    where: { id: userId },
  });

  // Delete the token after verification
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });
  await unstable_update({ ...session.user, email});

  return { success: "Email updated successfully!" };
};
