import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * clsx와 tailwind-merge를 조합하여 조건부 클래스와 충돌 해결을 처리합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜 포맷팅 유틸리티
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * 시간 포맷팅 유틸리티 (학습 시간 표시용)
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}시간`
  }
  return `${hours}시간 ${remainingMinutes}분`
}

/**
 * 퍼센트 포맷팅 유틸리티
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * 학습 진도율 계산
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
