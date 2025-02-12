import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import { 
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  ROLE_REDIRECTS 
} from "./routes";

export default auth(async (req) => {
  try {
    const { nextUrl } = req;
    const session = await auth();
    
    
    // Get user role from session user object
    const userRole = session?.user?.role?.nom?.toLowerCase();
    

    const isLoggedIn = !!session;

    // Root path redirect
    if (nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    if (isApiAuthRoute) return null;

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isAuthRoute) {
      if (isLoggedIn && userRole) {
        const redirectUrl = ROLE_REDIRECTS[userRole] || '/admin';
        console.log(`Redirecting ${userRole} to: ${redirectUrl}`);
        return NextResponse.redirect(new URL(redirectUrl, nextUrl));
      }
      return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    return null;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}