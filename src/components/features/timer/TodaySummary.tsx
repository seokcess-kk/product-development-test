'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TodaySummary as TodaySummaryType } from '@/types/timer'
import type { SubjectType } from '@/components/ui/SubjectBadge'

export interface TodaySummaryProps {
  summary: TodaySummaryType
  className?: string
}

/** 초를 시간:분 형식으로 변환 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
  }
  return `${minutes}분`
}

/** 과목별 색상 */
const subjectColors: Record<SubjectType, string> = {
  korean: 'bg-danger-500',
  math: 'bg-primary-500',
  english: 'bg-violet-500',
  science: 'bg-success-500',
  social: 'bg-warning-500',
  other: 'bg-gray-500',
}

export function TodaySummary({ summary, className }: TodaySummaryProps) {
  const { totalSeconds, subjectBreakdown } = summary

  // 가장 긴 과목 기준으로 바 너비 계산
  const maxSeconds = Math.max(...subjectBreakdown.map((s) => s.seconds), 1)

  if (totalSeconds === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white p-4',
          className
        )}
      >
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-4 w-4" />
          <span className="text-sm">오늘 학습 기록이 없습니다</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4',
        className
      )}
    >
      {/* 총 학습 시간 */}
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">오늘 총 학습:</span>
        <span className="font-semibold text-gray-900">
          {formatDuration(totalSeconds)}
        </span>
      </div>

      {/* 과목별 바 */}
      <div className="space-y-2">
        {subjectBreakdown.map(({ subject, seconds, label }) => {
          const width = (seconds / maxSeconds) * 100
          return (
            <div key={subject} className="flex items-center gap-2">
              {/* 바 */}
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      subjectColors[subject]
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
              {/* 라벨 */}
              <span className="w-8 text-xs text-gray-500">{label}</span>
              {/* 시간 */}
              <span className="w-16 text-right text-xs text-gray-700">
                {formatDuration(seconds)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TodaySummary
