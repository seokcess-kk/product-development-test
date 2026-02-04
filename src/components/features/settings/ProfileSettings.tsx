'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { GRADE_OPTIONS, SCHOOL_TYPE_OPTIONS } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap, Loader2, School, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// 프로필 업데이트 스키마
const profileSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.').max(20, '이름은 20자 이하여야 합니다.'),
  grade: z.number().min(1).max(3),
  schoolType: z.enum(['middle', 'high']),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSettingsProps {
  initialData?: {
    name: string
    grade: number
    schoolType: 'middle' | 'high'
  }
  onSubmit: (data: ProfileFormData) => Promise<{ error: Error | null }>
  className?: string
}

export function ProfileSettings({ initialData, onSubmit, className }: ProfileSettingsProps) {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || '',
      grade: initialData?.grade || 1,
      schoolType: initialData?.schoolType || 'high',
    },
  })

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const { error } = await onSubmit(data)
      if (error) {
        toast.error('프로필 업데이트에 실패했습니다.')
      } else {
        toast.success('프로필이 업데이트되었습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>프로필 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* 이름 */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={cn(
                  'block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900',
                  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  errors.name && 'border-danger focus:border-danger focus:ring-danger/20'
                )}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-danger">{errors.name.message}</p>
            )}
          </div>

          {/* 학교 유형 */}
          <div className="space-y-2">
            <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700">
              학교
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <School className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="schoolType"
                {...register('schoolType')}
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {SCHOOL_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 학년 */}
          <div className="space-y-2">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              학년
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <GraduationCap className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="grade"
                {...register('grade', { valueAsNumber: true })}
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {GRADE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 저장 버튼 */}
          <Button
            type="submit"
            variant="primary"
            disabled={!isDirty || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
