'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { ViewMode } from '@/types/calendar'

export interface CalendarHeaderProps {
  label: string
  viewMode: ViewMode
  isToday: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function CalendarHeader({
  label,
  viewMode,
  isToday,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  className,
}: CalendarHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          aria-label={viewMode === 'week' ? '이전 주' : '이전 날'}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h2 className="min-w-[180px] text-center text-lg font-semibold text-gray-900 sm:min-w-[220px]">
          {label}
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          aria-label={viewMode === 'week' ? '다음 주' : '다음 날'}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Today button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          disabled={isToday}
          className="shrink-0"
        >
          오늘
        </Button>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('week')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            aria-pressed={viewMode === 'week'}
          >
            주간
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('day')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'day'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            aria-pressed={viewMode === 'day'}
          >
            일간
          </button>
        </div>
      </div>
    </div>
  )
}
