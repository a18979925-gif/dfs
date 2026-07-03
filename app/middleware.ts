import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your application
  // vulnerable to attacks.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/', '/forbidden'];
  const isPublicPath = publicPaths.some((p) => path === p || path.startsWith(p));

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user exists and trying to access auth pages, redirect appropriately
  if (user && (path === '/login' || path === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding/role';
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user && !isPublicPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'VIEWER';

    // Protect developer routes
    if (path.startsWith('/dev') && role !== 'DEVELOPER') {
      const url = request.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }

    // Protect buyer routes
    if (path.startsWith('/buyer') && role !== 'BUYER') {
      const url = request.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }

    // Redirect from onboarding if role is already set
    if (path === '/onboarding/role' && role !== 'VIEWER') {
      const url = request.nextUrl.clone();
      if (role === 'DEVELOPER') {
        url.pathname = '/dev/dashboard';
      } else if (role === 'BUYER') {
        url.pathname = '/buyer/dashboard';
      } else {
        url.pathname = '/viewer/home';
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
