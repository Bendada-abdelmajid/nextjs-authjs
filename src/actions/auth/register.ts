"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerification } from "@/actions/send-verification";
import { z } from "zod";
import { signUpFormSchema } from "@/lib/schemas";
import { cookies } from "next/headers";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

type RegisterInput = z.infer<typeof signUpFormSchema>;

type RegisterResponse = {
  error?: string;
  success?: string;
};

export async function registerUser(
  formData: RegisterInput
): Promise<RegisterResponse> {
  try {
    const parsedData = signUpFormSchema.safeParse(formData);
    if (!parsedData.success) {
      return {
        error: parsedData.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { name, email, password } = parsedData.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email already exists" };
    }

    const cookieStore = await cookies();
    cookieStore.set("login_password", password, {
      httpOnly: true,
      maxAge: 300,
    });
    cookieStore.set("login_email", email, { httpOnly: true, maxAge: 300 });
    cookieStore.set("login_name", name, { httpOnly: true, maxAge: 300 });
    await sendVerification(email);

    return {
      success: "User registered successfully. Verification code sent!",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong" };
  }
}

export async function verifyEmail(code: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get("login_email")?.value;
  const name = cookieStore.get("login_name")?.value;
  const password = cookieStore.get("login_password")?.value;

  if (!email || !password || !name || !code) {
    return { error: "Missing required data for verification." };
  }

  const verificationToken = await prisma.verificationToken.findFirst({
    where: { identifier: email},
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

  // Hash password
  const hashedPassword = await hash(password, 12);

  // Create user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  cookieStore.delete("login_password");
  cookieStore.delete("login_email");
  cookieStore.delete("login_name");

  // Delete the token after verification
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });
  await signIn("credentials", { email, password, redirect:false });
  return { success: "user signIn with success"}

}
