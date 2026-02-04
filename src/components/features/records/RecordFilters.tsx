'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { subjectLabels, type SubjectType } from '@/components/ui/SubjectBadge'
import type { RecordFilters as RecordFiltersType } from '@/types/timer'

export interface RecordFiltersProps {
  filters: RecordFiltersType
  onChange: (filters: RecordFiltersType) => void
  className?: string
}

const subjects: (SubjectType | 'all')[] = [
  'all',
  'korean',
  'math',
  'english',
  'science',
  'social',
  'other',
]

const subjectLabelsWithAll: Record<SubjectType | 'all', string> = {
  all: '전체',
  ...subjectLabels,
}

const periods: RecordFiltersType['period'][] = ['today', 'week', 'month', 'all']

const periodLabels: Record<RecordFiltersType['period'], string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  all: '전체',
}

export function RecordFilters({
  filters,
  onChange,
  className,
}: RecordFiltersProps) {
  const handleSubjectChange = (subject: SubjectType | 'all') => {
    onChange({ ...filters, subject })
  }

  const handlePeriodChange = (period: RecordFiltersType['period']) => {
    onChange({ ...filters, period })
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 과목 필터 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          과목
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => handleSubjectChange(subject)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                filters.subject === subject
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {subjectLabelsWithAll[subject]}
            </button>
          ))}
        </div>
      </div>

      {/* 기간 필터 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          기간
        </label>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => handlePeriodChange(period)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                filters.period === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecordFilters
