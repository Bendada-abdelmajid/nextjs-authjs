"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/schemas";

import { z } from "zod";
type RegisterInput = z.infer<typeof profileSchema>;
export const updateProfile = async (formData: RegisterInput) => {
  try {
    const parsedData = profileSchema.safeParse(formData);
    if (!parsedData.success) {
      return {
        error: parsedData.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { name, phone } = parsedData.data;
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { error: "User not authenticated." };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { name, phoneNumber: phone },
    });
    
    
    return { success: "User updated with success" };
  } catch (err) {
    return { error: (err as Error).message || "Somting wenth wrong" };
  }
};
