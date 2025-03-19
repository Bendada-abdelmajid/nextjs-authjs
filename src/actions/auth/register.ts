"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerification } from "@/actions/send-verification";
import { z } from "zod";
import { signUpFormSchema } from "@/lib/schemas";
import { cookies } from "next/headers";

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

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const cookieStore = await cookies();
    cookieStore.set("login_password", password, {
      httpOnly: true,
      maxAge: 300,
    });
    cookieStore.set("login_email", email, { httpOnly: true, maxAge: 300 });
    await sendVerification(email);

    return {
      
      success: "User registered successfully. Verification code sent!",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong" };
  }
}
