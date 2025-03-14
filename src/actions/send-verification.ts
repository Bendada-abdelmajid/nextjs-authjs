"use server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
export const sendVerification = async (
  email: string,
  saveIt: boolean = true
) => {
  // Generate a 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  if (saveIt) {
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15-minute expiration
    const oldVerfication = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
      },
    });
    if (oldVerfication) {
      await prisma.verificationToken.delete({
        where: {
          id: oldVerfication.id,
        },
      });
    }
    // Store verification code in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationCode,
        expires,
      },
    });
  }
  // Send email with the verification code
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
  });
  return verificationCode;
};
