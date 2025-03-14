import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendVerification } from "@/actions/send-verification"; // Fixed typo
import { AuthError } from "next-auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Please enter email and password" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return Response.json({ error: "Invalid Email" }, { status: 400 });
  }

  if (!user.emailVerified) {
    await sendVerification(email);
    return Response.json({ error: "EmailNotVerified" }, { status: 400 });
  }

  try {
    // Set redirect: false so we can control the redirect ourselves
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Return a success response with the redirect URL
    // Your frontend will handle the actual redirect
    return Response.json({ 
      success: true, 
      redirectUrl: "/" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return Response.json({ error: "Invalid Password" }, { status: 400 });
        default:
          return Response.json({ error: "Something went wrong" }, { status: 500 });
      }
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}