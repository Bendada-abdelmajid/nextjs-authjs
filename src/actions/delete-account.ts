"use server";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export const deleteAccount = async (command: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "User not found" };
  }
  if (!command) {
    return { error: `Please enter "Delete account"` };
  }
  if (command !== "Delete account") {
    return { error: "Incorrect command" };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

 

  return { success: "Account deleted successfully!" };
};
