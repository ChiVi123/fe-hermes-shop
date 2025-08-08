import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TokenName } from '~/constants';
import { AUTH_ROUTES, PRIVATE_ROUTES } from '~/lib/route';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(TokenName.ACCESS_TOKEN)?.value;
  // const refreshToken = request.cookies.get(TokenName.REFRESH_TOKEN)?.value;

  if (PRIVATE_ROUTES.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (AUTH_ROUTES.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
