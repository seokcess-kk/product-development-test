/**
 * 계획 생성 위저드 폼 검증 스키마
 *
 * Zod를 사용한 각 단계별 검증
 */

import { z } from 'zod'
import type { GoalType } from '@/types/database'
import type { SubjectId, StudyTimeSlot } from '@/types/plan'

/**
 * Step 1: 목표 선택 스키마
 */
export const step1Schema = z.object({
  goalType: z.enum(['midterm', 'final', 'sat', 'regular'] as const, {
    required_error: '학습 목표를 선택해주세요.',
  }),
  targetDate: z
    .string()
    .min(1, '목표 날짜를 선택해주세요.')
    .refine((date) => {
      const selected = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, '목표 날짜는 오늘 이후여야 합니다.'),
  title: z
    .string()
    .min(1, '목표 제목을 입력해주세요.')
    .min(2, '목표 제목은 2자 이상이어야 합니다.')
    .max(50, '목표 제목은 50자 이하여야 합니다.'),
})

export type Step1FormData = z.infer<typeof step1Schema>

/**
 * Step 2: 과목 선택 스키마
 */
export const step2Schema = z.object({
  selectedSubjects: z
    .array(z.enum(['korean', 'math', 'english', 'science', 'social', 'other'] as const))
    .min(1, '최소 1개 이상의 과목을 선택해주세요.')
    .max(7, '최대 7개까지 선택할 수 있습니다.'),
})

export type Step2FormData = z.infer<typeof step2Schema>

/**
 * Step 3: 가용 시간 입력 스키마
 */
export const step3Schema = z.object({
  dailyStudyMinutes: z
    .number({ required_error: '하루 학습 시간을 입력해주세요.' })
    .min(30, '최소 30분 이상 설정해주세요.')
    .max(720, '최대 12시간까지 설정할 수 있습니다.'),
  availableTimeSlots: z
    .array(z.enum(['morning', 'afternoon', 'evening'] as const))
    .min(1, '최소 1개 이상의 시간대를 선택해주세요.'),
  studyOnWeekends: z.boolean(),
})

export type Step3FormData = z.infer<typeof step3Schema>

/**
 * Step 4: 시간 배분 스키마 (동적 검증)
 */
export const createStep4Schema = (selectedSubjects: SubjectId[], totalMinutes: number) => {
  const subjectEntries = selectedSubjects.map((subject) => [
    subject,
    z.number().min(0, '시간은 0 이상이어야 합니다.'),
  ])

  return z
    .object(Object.fromEntries(subjectEntries))
    .refine(
      (data) => {
        const total = Object.values(data).reduce((sum: number, val) => sum + (val as number), 0)
        return total <= totalMinutes * 1.2 // 20% 여유 허용
      },
      {
        message: '배분된 시간이 가용 시간을 초과합니다.',
      }
    )
}

/**
 * 전체 위저드 데이터 검증 스키마
 */
export const fullPlanSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: z.record(z.string(), z.number()),
})

export type FullPlanFormData = z.infer<typeof fullPlanSchema>

/**
 * 목표 타입별 기본 제목 추천
 */
export const getDefaultTitle = (goalType: GoalType): string => {
  const titles: Record<GoalType, string> = {
    midterm: '중간고사 대비 계획',
    final: '기말고사 대비 계획',
    sat: '수능 대비 학습 계획',
    regular: '일반 학습 계획',
  }
  return titles[goalType]
}

/**
 * 검증 에러 메시지 한글화
 */
export const validationMessages = {
  step1: {
    goalType: '학습 목표를 선택해주세요.',
    targetDate: '목표 날짜를 선택해주세요.',
    title: '목표 제목을 입력해주세요.',
  },
  step2: {
    subjects: '최소 1개 이상의 과목을 선택해주세요.',
    maxSubjects: '최대 7개까지 선택할 수 있습니다.',
  },
  step3: {
    dailyMinutes: '하루 학습 시간을 설정해주세요.',
    timeSlots: '학습 가능한 시간대를 선택해주세요.',
  },
  step4: {
    allocation: '시간 배분을 확인해주세요.',
    exceed: '배분된 시간이 가용 시간을 초과합니다.',
  },
}
