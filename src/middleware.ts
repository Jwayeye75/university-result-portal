import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Initialize the response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Create the Supabase middleware client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Fetch the current user session
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginRoute = request.nextUrl.pathname === '/login'
  const isRootRoute = request.nextUrl.pathname === '/'

  // 4. Protection Logic
  // If no user is logged in, and they aren't on the login page, boot them to /login
  if (!user && !isLoginRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If a user IS logged in, and they try to go to /login or /, send them to the dashboard
  if (user && (isLoginRoute || isRootRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // (Role-based redirects for Admin/Teacher/Student will be handled within the dashboard layout)

  return response
}

// 5. Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}