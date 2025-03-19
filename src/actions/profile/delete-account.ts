"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteFileFromS3 } from "./profile-image";

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
  // 1. Delete related accounts
  await prisma.account.deleteMany({
    where: { userId: userId },
  });

  // 2. Delete profile image (if exists)
  const profileImage = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${userId}`;
  await deleteFileFromS3(profileImage);

  // 3. Finally, delete the user
  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: "Account deleted successfully!" };
};
