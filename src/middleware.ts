/**
 * Next.js Middleware
 *
 * Supabase 세션 갱신 및 인증 보호 처리
 */

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 환경 변수가 설정되지 않은 경우 미들웨어 스킵 (개발 모드)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    return NextResponse.next()
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - 이미지 파일 (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
