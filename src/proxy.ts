import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STACK_ALIAS_HOST, STACK_HOST, STACK_PATH } from '@/lib/stack/content';

/**
 * Host routing for The Physical Stack microsite:
 *   stack.transientlabs.ai/*     → /stack/*
 *   deepdive.transientlabs.ai/*  → /stack/*  (alias)
 *
 * Path routes on the apex domain remain available at transientlabs.ai/stack.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname } = request.nextUrl;

  // This application deliberately exposes route handlers under /api and no
  // Server Actions. Reject forged/stale action traffic before Next attempts to
  // parse an RSC payload. Production saw batches of these requests retain
  // memory until the 512 MiB instance was restarted.
  if (request.headers.has('next-action')) {
    return new NextResponse(null, {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const isApiRoute = pathname === '/api' || pathname.startsWith('/api/');
  const isReadMethod =
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'OPTIONS';

  if (!isApiRoute && !isReadMethod) {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD, OPTIONS',
        'Cache-Control': 'no-store',
      },
    });
  }

  const isStackHost = host === STACK_HOST || host === STACK_ALIAS_HOST;

  if (!isStackHost) {
    return NextResponse.next();
  }

  // Already rewritten or static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Map bare subdomain paths onto /stack
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = STACK_PATH;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith(STACK_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = `${STACK_PATH}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files handled above via early return.
     * Keep matcher broad so host checks always run.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
