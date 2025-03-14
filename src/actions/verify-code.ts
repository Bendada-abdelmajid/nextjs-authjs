'use server';
import { prisma } from "@/lib/prisma";


export async function verifyEmail(email: string, code: string) {
  if (!email || !code) {
    return { error: "Email and code are required"};
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

  // Mark email as verified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  // Delete the token after verification
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });

  return { success: "Email verified successfully!" };
}
