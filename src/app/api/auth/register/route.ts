// import { NextRequest, NextResponse } from "next/server"
// import { hash } from "bcryptjs"
// import { prisma } from "../../../../lib/prisma"

// export async function POST(req: NextRequest) {
//   try {
//     const { name, email, password } = await req.json()
    
//     // Validate fields
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       )
//     }
    
//     // Check if email already exists
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     })
    
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email already exists" },
//         { status: 400 }
//       )
//     }
    
//     // Hash password
//     const hashedPassword = await hash(password, 12)
    
//     // Create user with Prisma
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     })
    
//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         userId: user.id,
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("Registration error:", error)
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { sendVerification } from "@/actions/send-verification";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
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

    await sendVerification(email)

    return NextResponse.json(
      {
        message: "User registered successfully. Verification code sent!",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
