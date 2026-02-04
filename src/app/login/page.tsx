/**
 * 로그인 페이지
 *
 * 이메일/비밀번호 로그인 및 Google 소셜 로그인을 제공합니다.
 */

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm, SocialLoginButtons, GuestGuard } from '@/components/features/auth'
import type { LoginFormData } from '@/lib/validations/auth'

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginPageContent />
    </GuestGuard>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // URL에서 에러 메시지 확인
  const urlError = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  const handleEmailLogin = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const { error: authError } = await signInWithEmail(data.email, data.password)

      if (authError) {
        // Supabase 에러 메시지를 사용자 친화적으로 변환
        if (authError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 이메일을 확인해주세요.')
        } else {
          setError(authError.message)
        }
        return
      }

      // 로그인 성공 - 리다이렉트
      router.push(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)

    const { error: authError } = await signInWithGoogle()

    if (authError) {
      setError('Google 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center">
          <Link
            href="/"
            className="mx-auto inline-flex items-center gap-2 text-2xl font-bold text-primary"
          >
            <BookOpen className="h-8 w-8" aria-hidden="true" />
            <span>StudyMate</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            로그인
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            AI와 함께하는 스마트 학습을 시작하세요
          </p>
        </div>

        {/* 로그인 폼 카드 */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
          {/* URL 에러 메시지 */}
          {urlError && (
            <div
              className="mb-6 rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700"
              role="alert"
            >
              {urlError}
            </div>
          )}

          {/* 소셜 로그인 */}
          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            disabled={isLoading}
          />

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">또는</span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <LoginForm
            onSubmit={handleEmailLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* 회원가입 링크 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary-600 focus:outline-none focus:underline"
            >
              회원가입
            </Link>
          </p>
        </div>

        {/* 푸터 */}
        <p className="mt-8 text-center text-xs text-gray-500">
          로그인하면{' '}
          <Link href="/terms" className="underline hover:text-gray-700">
            이용약관
          </Link>
          {' '}및{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
