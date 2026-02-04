/**
 * 인증 관련 폼 검증 스키마
 *
 * Zod를 사용한 로그인/회원가입 폼 검증
 */

import { z } from 'zod'
import type { SchoolType } from '@/types/database'

/**
 * 이메일 검증 스키마
 */
const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('유효한 이메일 주소를 입력해주세요.')

/**
 * 비밀번호 검증 스키마
 */
const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .min(8, '비밀번호는 8자 이상이어야 합니다.')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    '비밀번호는 영문자와 숫자를 포함해야 합니다.'
  )

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    name: z
      .string()
      .min(1, '이름을 입력해주세요.')
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
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * 프로필 업데이트 스키마
 */
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하여야 합니다.')
    .optional(),
  grade: z
    .number()
    .min(1, '학년은 1~3학년만 선택 가능합니다.')
    .max(3, '학년은 1~3학년만 선택 가능합니다.')
    .optional(),
  schoolType: z.enum(['middle', 'high'] as const).optional(),
})

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

/**
 * 학교 유형 옵션
 */
export const SCHOOL_TYPE_OPTIONS: { value: SchoolType; label: string }[] = [
  { value: 'middle', label: '중학교' },
  { value: 'high', label: '고등학교' },
]

/**
 * 학년 옵션
 */
export const GRADE_OPTIONS = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
]
