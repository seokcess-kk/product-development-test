/**
 * OAuth 콜백 API 라우트
 *
 * Google 등 소셜 로그인 후 Supabase가 리다이렉트하는 엔드포인트
 * 인증 코드를 세션으로 교환하고 프로필을 생성/업데이트합니다.
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { ProfileInsert } from '@/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // 인증 코드를 세션으로 교환
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('인증에 실패했습니다. 다시 시도해주세요.')}`
      )
    }

    // 사용자 정보 확인
    if (data.user) {
      // 프로필 존재 여부 확인
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      // 프로필이 없으면 생성 (소셜 로그인 최초 가입)
      if (!existingProfile) {
        const userMetadata = data.user.user_metadata
        const email = data.user.email ?? ''
        const name =
          userMetadata?.full_name ??
          userMetadata?.name ??
          email.split('@')[0] ??
          '사용자'

        const profileData: ProfileInsert = {
          id: data.user.id,
          email: email,
          name: name,
          grade: 1, // 기본값
          school_type: 'middle', // 기본값
        }
        const { error: profileError } = await supabase.from('profiles').insert(profileData as never)

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // 프로필 생성 실패해도 계속 진행 (나중에 설정에서 업데이트 가능)
        }

        // 소셜 로그인 최초 가입 시 프로필 설정 페이지로 리다이렉트
        return NextResponse.redirect(`${origin}/signup/complete`)
      }
    }

    // 로그인 성공 - 원래 가려던 페이지로 리다이렉트
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // code가 없는 경우 로그인 페이지로 리다이렉트
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('인증 코드가 없습니다.')}`
  )
}
