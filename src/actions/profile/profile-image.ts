"use server";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: file,
      ContentType: "image/jpeg", // Ensure correct content type
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return fileName;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload image to S3.");
  }
}
export async function deleteFileFromS3(imageUrl: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "User not authenticated." };
      }
    // Extract the filename from the S3 URL
    const fileName = imageUrl.split("/").pop();
    if (!fileName) throw new Error("Invalid file URL.");

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    await prisma.user.update({
        where: { id: session.user.id },
        data: { image: null },
      });
    await unstable_update({ ...session.user, image:"delete" });

  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error("Failed to delete image from S3.");
  }
}
export const uploadProfileImage = async (file: File) => {
  try {
    const session = await auth(); // Get current authenticated user
    if (!session?.user?.id) {
      return { error: "User not authenticated." };
    }
    if (!file) {
      return { error: "File is required." };
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Invalid file type. Only JPG and PNG are allowed." };
    }
    if (file.size > 3 * 1024 * 1024) {
      return { error: "File size exceeds 3MB limit." };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // const uniqueFileName = `${session.user?.id}`;

    // Upload to S3
    const fileName = await uploadFileToS3(buffer, session.user?.id);
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    // Update user in Prisma
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });
  
       
    await unstable_update({ ...session.user, image:imageUrl });
    return { success: true, file: imageUrl };

  } catch (error) {
    console.error("Upload error:", error);
    return { error: "An error occurred while uploading the file." };
  }
};
