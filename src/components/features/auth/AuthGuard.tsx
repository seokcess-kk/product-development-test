/**
 * 인증 가드 컴포넌트
 *
 * 인증이 필요한 페이지를 감싸서 사용합니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * 인증 필요 페이지 래퍼
 *
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedPageContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`
      router.push(redirectUrl)
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname])

  // 로딩 중
  if (isLoading) {
    return fallback ?? <AuthGuardSkeleton />
  }

  // 인증되지 않음 (리다이렉트 전 잠시 표시)
  if (!isAuthenticated) {
    return fallback ?? <AuthGuardSkeleton />
  }

  // 인증됨
  return <>{children}</>
}

/**
 * 인증 가드 로딩 스켈레톤
 */
function AuthGuardSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner className="h-10 w-10 text-primary" />
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    </div>
  )
}

/**
 * 로딩 스피너
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * 게스트 전용 가드 (로그인된 사용자 접근 금지)
 *
 * 로그인/회원가입 페이지에서 사용하여
 * 이미 로그인된 사용자를 대시보드로 리다이렉트합니다.
 *
 * @example
 * ```tsx
 * <GuestGuard>
 *   <LoginPageContent />
 * </GuestGuard>
 * ```
 */
export function GuestGuard({
  children,
  fallback,
  redirectTo = '/dashboard',
}: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  // 로딩 중
  if (isLoading) {
    return fallback ?? <AuthGuardSkeleton />
  }

  // 인증됨 (리다이렉트 전 잠시 표시)
  if (isAuthenticated) {
    return fallback ?? <AuthGuardSkeleton />
  }

  // 게스트
  return <>{children}</>
}
