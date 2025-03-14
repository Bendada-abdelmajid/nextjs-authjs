import { prisma } from "@/lib/prisma";
import { signIn } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code }:{ email:string, code:string} = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required" },
      { status: 400 }
    );
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });

  if (
    !verificationToken ||
    verificationToken.token !== code ||
    verificationToken.expires < new Date()
  ) {
    return NextResponse.json(
      { error: "Invalid or expired verification code" },
      { status: 400 }
    );
  }

  // Mark email as verified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  // Delete the token after verification
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: code } } });



  return NextResponse.json({ message: "Email verified successfully!" });
}
