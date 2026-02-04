/**
 * Supabase Middleware Helper
 *
 * Next.js 미들웨어에서 Supabase 세션을 갱신하기 위한 헬퍼 함수
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * 인증이 필요한 경로 패턴
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/schedule',
  '/goals',
  '/records',
  '/settings',
]

/**
 * 인증된 사용자가 접근하면 안 되는 경로 (로그인 후 리다이렉트)
 */
const AUTH_ROUTES = ['/login', '/signup', '/auth']

/**
 * Supabase 세션 갱신 및 인증 체크를 수행하는 미들웨어 헬퍼
 *
 * @example
 * ```tsx
 * // middleware.ts
 * import { updateSession } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 *
 * export const config = {
 *   matcher: [
 *     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
 *   ],
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (중요: getUser()를 호출해야 세션이 갱신됨)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 보호된 경로에 인증되지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하면 대시보드로 리다이렉트
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

/**
 * 현재 사용자 정보를 가져오는 헬퍼 함수
 * Server Component나 Route Handler에서 사용
 */
export async function getCurrentUser(supabase: ReturnType<typeof createServerClient<Database>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * 현재 사용자의 프로필을 가져오는 헬퍼 함수
 */
export async function getCurrentProfile(supabase: ReturnType<typeof createServerClient<Database>>) {
  const user = await getCurrentUser(supabase)

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}
