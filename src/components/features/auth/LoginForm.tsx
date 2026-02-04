/**
 * 로그인 폼 컴포넌트
 *
 * 이메일/비밀번호 로그인 폼을 제공합니다.
 * React Hook Form + Zod로 폼 검증을 수행합니다.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  className,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loading = isLoading || isSubmitting

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-5', className)}
      noValidate
    >
      {/* 에러 메시지 */}
      {error && (
        <div
          className="rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {/* 이메일 입력 */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            disabled={loading}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
              errors.email && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-danger" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            disabled={loading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-gray-900 placeholder:text-gray-400',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
              errors.password && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-danger" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors',
          'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-70'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>로그인 중...</span>
          </>
        ) : (
          <span>로그인</span>
        )}
      </button>
    </form>
  )
}
