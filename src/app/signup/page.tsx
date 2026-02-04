/**
 * 회원가입 페이지
 *
 * 이메일/비밀번호 회원가입 및 Google 소셜 로그인을 제공합니다.
 * 이름, 학년, 학교 유형을 추가로 입력받습니다.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { SignupForm, SocialLoginButtons, GuestGuard } from '@/components/features/auth'
import type { SignupFormData } from '@/lib/validations/auth'

export default function SignupPage() {
  return (
    <GuestGuard>
      <SignupPageContent />
    </GuestGuard>
  )
}

function SignupPageContent() {
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (data: SignupFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const { error: authError } = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        grade: data.grade,
        schoolType: data.schoolType,
      })

      if (authError) {
        // Supabase 에러 메시지를 사용자 친화적으로 변환
        if (authError.message.includes('already registered')) {
          setError('이미 가입된 이메일입니다. 로그인해주세요.')
        } else if (authError.message.includes('Password should be')) {
          setError('비밀번호가 요구사항을 충족하지 않습니다.')
        } else {
          setError(authError.message)
        }
        return
      }

      // 회원가입 성공 - 대시보드로 리다이렉트
      router.push('/dashboard')
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
            회원가입
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            StudyMate와 함께 효율적인 학습을 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 카드 */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
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
              <span className="bg-white px-4 text-gray-500">또는 이메일로 가입</span>
            </div>
          </div>

          {/* 회원가입 폼 */}
          <SignupForm
            onSubmit={handleSignup}
            isLoading={isLoading}
            error={error}
          />

          {/* 로그인 링크 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-600 focus:outline-none focus:underline"
            >
              로그인
            </Link>
          </p>
        </div>

        {/* 푸터 */}
        <p className="mt-8 text-center text-xs text-gray-500">
          가입하면{' '}
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
