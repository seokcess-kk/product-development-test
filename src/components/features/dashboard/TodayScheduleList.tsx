'use client'

import * as React from 'react'
import { Check, Circle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SubjectBadge, type SubjectType } from '@/components/ui/SubjectBadge'
import { Spinner } from '@/components/ui/Spinner'

export interface ScheduleItem {
  id: string
  time: string
  title: string
  subject: SubjectType
  isCompleted: boolean
}

export interface TodayScheduleListProps {
  schedules: ScheduleItem[]
  isLoading?: boolean
  onToggleComplete?: (id: string) => void
  className?: string
}

export function TodayScheduleList({
  schedules,
  isLoading = false,
  onToggleComplete,
  className,
}: TodayScheduleListProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">오늘 할 일</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner size="lg" label="일정을 불러오는 중..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">오늘 할 일</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-2">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">오늘 일정이 없습니다</p>
            <p className="mt-1 text-xs text-gray-400">새 계획을 만들어보세요!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {schedules.map((schedule) => (
              <li
                key={schedule.id}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 transition-colors',
                  schedule.isCompleted ? 'bg-gray-50' : 'hover:bg-gray-50'
                )}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleComplete?.(schedule.id)}
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    schedule.isCompleted
                      ? 'border-success-500 bg-success-500 text-white'
                      : 'border-gray-300 hover:border-primary-400'
                  )}
                  aria-label={schedule.isCompleted ? '완료 취소' : '완료로 표시'}
                >
                  {schedule.isCompleted && <Check className="h-3 w-3" />}
                </button>

                {/* Time */}
                <span
                  className={cn(
                    'w-14 shrink-0 text-sm font-medium',
                    schedule.isCompleted ? 'text-gray-400' : 'text-gray-600'
                  )}
                >
                  {schedule.time}
                </span>

                {/* Subject Badge */}
                <SubjectBadge
                  subject={schedule.subject}
                  size="sm"
                  className={cn(schedule.isCompleted && 'opacity-50')}
                />

                {/* Title */}
                <span
                  className={cn(
                    'flex-1 truncate text-sm',
                    schedule.isCompleted
                      ? 'text-gray-400 line-through'
                      : 'text-gray-900'
                  )}
                >
                  {schedule.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
