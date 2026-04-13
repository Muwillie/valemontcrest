import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES  = ['/sign-in', '/sign-up', '/forgot-password', '/'];
const PROTECTED_ROOT = '/dashboard';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next')  ||
    pathname.startsWith('/api')    ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const session        = req.cookies.get('session')?.value;
  const sessionCreated = req.cookies.get('session_created')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  // No session cookie → redirect to sign-in
  if (!session && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Double-check expiry server-side using session_created timestamp
  // This catches cases where the httpOnly cookie somehow outlives its maxAge
  if (session && sessionCreated && !isPublicRoute) {
    const createdAt  = parseInt(sessionCreated);
    const elapsed    = Date.now() - createdAt;
    const SESSION_MS = 10 * 60 * 1000;

    if (elapsed > SESSION_MS) {
      // Session has expired — force sign-in
      const url = req.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('expired', 'true');
      const response = NextResponse.redirect(url);
      response.cookies.delete('session');
      response.cookies.delete('session_created');
      return response;
    }
  }

  // Already logged in + trying to access sign-in → send to dashboard
  if (session && isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = PROTECTED_ROOT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};