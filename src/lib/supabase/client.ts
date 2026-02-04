/**
 * Supabase Client (Browser)
 *
 * 브라우저/클라이언트 사이드에서 사용하는 Supabase 클라이언트
 * React 컴포넌트, 클라이언트 훅 등에서 사용
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * 브라우저용 Supabase 클라이언트 생성
 *
 * @example
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 *
 * function MyComponent() {
 *   const supabase = createClient()
 *
 *   const handleClick = async () => {
 *     const { data } = await supabase.from('profiles').select('*')
 *   }
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
