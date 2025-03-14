"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const updateEmail = async (email: string) => {
    const session = await auth()
    const userId = session?.user?.id
    if(!userId){
        return { error: "User not found" };
    }
    if (!email) {
        return { error: "Please enter email" };
    }
    await prisma.user.update({
        data: { email },
        where: { id: userId },
    });
    return { success: "Email updated successfully!" };
}