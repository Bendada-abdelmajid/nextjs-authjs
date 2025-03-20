import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { apiPrefixAuth, authRoutes, puplicRoutes } from "./route";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLogedIn = !!req.auth;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefixAuth);
  const isPuplic = puplicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoutes) {
    if (isLogedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isPuplic && !isLogedIn) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }
  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
