import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const isDev = process.env.NODE_ENV !== 'production';

  // Construct the Content-Security-Policy header
  // In development, Next.js requires 'unsafe-eval' for Hot Module Replacement.
  // We use 'strict-dynamic' to allow scripts loaded by the nonced script.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''} https://vercel.live;
    style-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-inline'" : "https://fonts.googleapis.com"};
    img-src 'self' blob: data: https://*.supabase.co;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Next.js uses the 'x-nonce' header to inject the nonce into the HTML tags it generates
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // Set the response headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // Address CORS misconfiguration by strictly allowing only the deployed domain
  // instead of Vercel's default wildcard '*'
  const origin = request.headers.get('origin');
  const allowedOrigin = 'https://referidos-qr.vercel.app';
  if (origin === allowedOrigin || !origin) {
     response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
