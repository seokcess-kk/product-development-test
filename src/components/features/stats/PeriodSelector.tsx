'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { StatsPeriod } from '@/hooks/useStudyStats'

export interface PeriodSelectorProps {
  value: StatsPeriod
  onChange: (period: StatsPeriod) => void
  className?: string
}

const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'all', label: '전체' },
]

export function PeriodSelector({
  value,
  onChange,
  className,
}: PeriodSelectorProps) {
  return (
    <div className={cn('inline-flex rounded-lg bg-gray-100 p-1', className)}>
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * 드롭다운 스타일의 기간 선택기 (모바일용)
 */
export function PeriodSelectorDropdown({
  value,
  onChange,
  className,
}: PeriodSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as StatsPeriod)}
      className={cn(
        'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700',
        'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
        className
      )}
    >
      {PERIOD_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

/**
 * 반응형 기간 선택기 (데스크톱: 버튼 그룹, 모바일: 드롭다운)
 */
export function ResponsivePeriodSelector({
  value,
  onChange,
  className,
}: PeriodSelectorProps) {
  return (
    <>
      {/* Desktop */}
      <div className={cn('hidden sm:block', className)}>
        <PeriodSelector value={value} onChange={onChange} />
      </div>

      {/* Mobile */}
      <div className={cn('block sm:hidden', className)}>
        <PeriodSelectorDropdown value={value} onChange={onChange} />
      </div>
    </>
  )
}
