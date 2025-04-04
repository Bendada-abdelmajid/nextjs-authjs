import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import { AuthProvider } from "@/components/auth-provider";



const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className}  antialiased`}
      >
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>


  );
}
