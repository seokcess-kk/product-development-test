/**
 * Supabase Client (Server)
 *
 * 서버 사이드에서 사용하는 Supabase 클라이언트
 * Server Components, Route Handlers, Server Actions에서 사용
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * 서버용 Supabase 클라이언트 생성
 *
 * 주의: 이 함수는 반드시 Server Component, Route Handler, 또는 Server Action 내에서 호출해야 합니다.
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('profiles').select('*')
 *   return <div>{JSON.stringify(data)}</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Route Handler (app/api/users/route.ts)
 * import { createClient } from '@/lib/supabase/server'
 * import { NextResponse } from 'next/server'
 *
 * export async function GET() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('profiles').select('*')
 *   return NextResponse.json({ data })
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Component에서 호출된 경우 setAll이 실패할 수 있음
            // 미들웨어에서 세션 갱신을 처리하므로 무시해도 됨
          }
        },
      },
    }
  )
}

/**
 * Admin 권한을 가진 Supabase 클라이언트 생성
 *
 * 주의: Service Role Key를 사용하므로 RLS를 우회합니다.
 * 반드시 서버 사이드에서만 사용하고, 신중하게 사용하세요.
 *
 * @example
 * ```tsx
 * // Server Action에서 관리자 작업 수행
 * import { createAdminClient } from '@/lib/supabase/server'
 *
 * export async function adminAction() {
 *   'use server'
 *   const supabase = createAdminClient()
 *   // RLS를 우회하여 모든 데이터에 접근 가능
 *   const { data } = await supabase.from('profiles').select('*')
 * }
 * ```
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Admin 클라이언트는 쿠키를 사용하지 않음
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
