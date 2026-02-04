/**
 * 프로필 완성 페이지
 *
 * Google 소셜 로그인으로 최초 가입한 사용자가
 * 학년, 학교 유형 등 추가 정보를 입력하는 페이지입니다.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Loader2, GraduationCap, School, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthGuard } from '@/components/features/auth'
import { cn } from '@/lib/utils'
import { SCHOOL_TYPE_OPTIONS, GRADE_OPTIONS } from '@/lib/validations/auth'

const profileCompleteSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하여야 합니다.'),
  grade: z
    .number({ required_error: '학년을 선택해주세요.' })
    .min(1, '학년을 선택해주세요.')
    .max(3, '학년은 1~3학년만 선택 가능합니다.'),
  schoolType: z.enum(['middle', 'high'] as const, {
    required_error: '학교 유형을 선택해주세요.',
  }),
})

type ProfileCompleteFormData = z.infer<typeof profileCompleteSchema>

export default function SignupCompletePage() {
  return (
    <AuthGuard>
      <SignupCompleteContent />
    </AuthGuard>
  )
}

function SignupCompleteContent() {
  const router = useRouter()
  const { profile, updateProfile } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileCompleteFormData>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: {
      name: profile?.name ?? '',
      grade: profile?.grade ?? undefined,
      schoolType: profile?.school_type ?? undefined,
    },
  })

  const loading = isLoading || isSubmitting

  const onSubmit = async (data: ProfileCompleteFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const { error: updateError } = await updateProfile({
        name: data.name,
        grade: data.grade,
        schoolType: data.schoolType,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      // 프로필 완성 성공 - 대시보드로 이동
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-8 w-8" aria-hidden="true" />
            <span>StudyMate</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            프로필 완성하기
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            맞춤형 학습 경험을 위해 추가 정보를 입력해주세요
          </p>
        </div>

        {/* 프로필 완성 폼 카드 */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

            {/* 완료 버튼 */}
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
                  <span>저장 중...</span>
                </>
              ) : (
                <span>시작하기</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
