/**
 * 회원가입 폼 컴포넌트
 *
 * 이메일, 비밀번호, 이름, 학년, 학교 유형을 입력받는 회원가입 폼입니다.
 * React Hook Form + Zod로 폼 검증을 수행합니다.
 */

'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Mail, Lock, User, GraduationCap, School } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  signupSchema,
  type SignupFormData,
  SCHOOL_TYPE_OPTIONS,
  GRADE_OPTIONS,
} from '@/lib/validations/auth'

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function SignupForm({
  onSubmit,
  isLoading = false,
  error,
  className,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      grade: undefined,
      schoolType: undefined,
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
          이메일 <span className="text-danger">*</span>
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
          비밀번호 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="8자 이상, 영문자와 숫자 포함"
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

      {/* 비밀번호 확인 */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호 확인 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
            disabled={loading}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-gray-900 placeholder:text-gray-400',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
              errors.confirmPassword && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-danger" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* 이름 입력 */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          이름 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력하세요"
            disabled={loading}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
              errors.name && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('name')}
          />
        </div>
        {errors.name && (
          <p id="name-error" className="text-sm text-danger" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 학교 유형 선택 */}
      <div className="space-y-2">
        <label
          htmlFor="schoolType"
          className="block text-sm font-medium text-gray-700"
        >
          학교 유형 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <School className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Controller
            name="schoolType"
            control={control}
            render={({ field }) => (
              <select
                id="schoolType"
                disabled={loading}
                aria-invalid={errors.schoolType ? 'true' : 'false'}
                aria-describedby={errors.schoolType ? 'school-type-error' : undefined}
                className={cn(
                  'block w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900',
                  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
                  errors.schoolType && 'border-danger focus:border-danger focus:ring-danger/20',
                  !field.value && 'text-gray-400'
                )}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value === '' ? undefined : value)
                }}
              >
                <option value="" disabled>
                  학교 유형을 선택하세요
                </option>
                {SCHOOL_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {errors.schoolType && (
          <p id="school-type-error" className="text-sm text-danger" role="alert">
            {errors.schoolType.message}
          </p>
        )}
      </div>

      {/* 학년 선택 */}
      <div className="space-y-2">
        <label
          htmlFor="grade"
          className="block text-sm font-medium text-gray-700"
        >
          학년 <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GraduationCap className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <select
                id="grade"
                disabled={loading}
                aria-invalid={errors.grade ? 'true' : 'false'}
                aria-describedby={errors.grade ? 'grade-error' : undefined}
                className={cn(
                  'block w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900',
                  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
                  errors.grade && 'border-danger focus:border-danger focus:ring-danger/20',
                  !field.value && 'text-gray-400'
                )}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value === '' ? undefined : Number(value))
                }}
              >
                <option value="" disabled>
                  학년을 선택하세요
                </option>
                {GRADE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {errors.grade && (
          <p id="grade-error" className="text-sm text-danger" role="alert">
            {errors.grade.message}
          </p>
        )}
      </div>

      {/* 회원가입 버튼 */}
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
            <span>가입 중...</span>
          </>
        ) : (
          <span>회원가입</span>
        )}
      </button>
    </form>
  )
}
