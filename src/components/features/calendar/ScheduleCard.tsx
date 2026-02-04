'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubjectBadge } from '@/components/ui/SubjectBadge'
import type { CalendarSchedule as Schedule } from '@/types/calendar'

export interface ScheduleCardProps {
  schedule: Schedule
  variant?: 'compact' | 'expanded'
  onToggleComplete?: (id: string, completed: boolean) => void
  onClick?: (schedule: Schedule) => void
  className?: string
}

// Subject color mappings for background
const subjectBgColors = {
  korean: 'bg-danger-50 border-danger-200 hover:bg-danger-100',
  math: 'bg-primary-50 border-primary-200 hover:bg-primary-100',
  english: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
  science: 'bg-success-50 border-success-200 hover:bg-success-100',
  social: 'bg-warning-50 border-warning-200 hover:bg-warning-100',
  other: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
} as const

export function ScheduleCard({
  schedule,
  variant = 'compact',
  onToggleComplete,
  onClick,
  className,
}: ScheduleCardProps) {
  const { id, title, subject, startTime, endTime, isCompleted, memo } = schedule

  const timeLabel = `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleComplete?.(id, !isCompleted)
  }

  const handleClick = () => {
    onClick?.(schedule)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  if (variant === 'compact') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'cursor-pointer rounded-md border p-2 transition-colors',
          subjectBgColors[subject],
          isCompleted && 'opacity-60',
          className
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'truncate text-xs font-medium text-gray-900',
                isCompleted && 'line-through'
              )}
            >
              {title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{timeLabel}</p>
          </div>
          {isCompleted && (
            <Check className="h-3.5 w-3.5 shrink-0 text-success-500" />
          )}
        </div>
      </div>
    )
  }

  // Expanded variant for day view
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer rounded-lg border p-4 transition-colors',
        subjectBgColors[subject],
        isCompleted && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SubjectBadge subject={subject} size="sm" />
            <span className="text-sm text-gray-500">{timeLabel}</span>
          </div>
          <h4
            className={cn(
              'mt-2 font-medium text-gray-900',
              isCompleted && 'line-through'
            )}
          >
            {title}
          </h4>
          {memo && (
            <p className="mt-1 text-sm text-gray-500">{memo}</p>
          )}
        </div>

        {/* Completion checkbox */}
        <button
          type="button"
          onClick={handleToggleComplete}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
            isCompleted
              ? 'border-success-500 bg-success-500 text-white'
              : 'border-gray-300 bg-white hover:border-gray-400'
          )}
          aria-label={isCompleted ? '완료 취소' : '완료 처리'}
        >
          {isCompleted && <Check className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
