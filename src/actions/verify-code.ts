'use server';
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";


export async function verifyEmail( code: string) {
    const email = (await cookies()).get("login_email")?.value;
  
    if (!email) {
      return { error: "Please enter email" };
    }
  if (!code) {
    return { error: "Email and code are required"};
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
