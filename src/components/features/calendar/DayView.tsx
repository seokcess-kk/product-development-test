'use client'

import * as React from 'react'
import { format, getHours, getMinutes, isSameHour, isToday as isTodayFn } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { ScheduleCard } from './ScheduleCard'
import { EmptyState } from './EmptyState'
import type { CalendarSchedule as Schedule, TimeSlot } from '@/types/calendar'

export interface DayViewProps {
  date: Date
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  onScheduleClick?: (schedule: Schedule) => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onAddSchedule?: () => void
  className?: string
}

// Get schedules that start within a specific hour
function getSchedulesForHour(schedules: Schedule[], hour: number): Schedule[] {
  return schedules.filter((schedule) => getHours(schedule.startTime) === hour)
}

export function DayView({
  date,
  schedules,
  timeSlots,
  onScheduleClick,
  onToggleComplete,
  onAddSchedule,
  className,
}: DayViewProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [currentTimePosition, setCurrentTimePosition] = React.useState<number | null>(null)
  const isToday = isTodayFn(date)

  // Filter schedules for this day
  const daySchedules = React.useMemo(() => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return schedules.filter(
      (s) => format(s.startTime, 'yyyy-MM-dd') === dateStr
    )
  }, [schedules, date])

  // Scroll to current time on mount
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (container && isToday) {
      const now = new Date()
      const currentHour = getHours(now)
      const startHour = 6

      if (currentHour >= startHour && currentHour <= 24) {
        // Each hour = 80px (h-20)
        const scrollPosition = (currentHour - startHour - 2) * 80
        container.scrollTop = Math.max(0, scrollPosition)
      }
    }
  }, [isToday])

  // Update current time line position
  React.useEffect(() => {
    if (!isToday) {
      setCurrentTimePosition(null)
      return
    }

    const updateCurrentTime = () => {
      const now = new Date()
      const currentHour = getHours(now)
      const currentMinute = getMinutes(now)
      const startHour = 6

      if (currentHour >= startHour && currentHour <= 24) {
        const minutes = (currentHour - startHour) * 60 + currentMinute
        const pixelsPerMinute = 80 / 60
        setCurrentTimePosition(minutes * pixelsPerMinute)
      } else {
        setCurrentTimePosition(null)
      }
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000)

    return () => clearInterval(interval)
  }, [isToday])

  // Sort schedules by start time
  const sortedSchedules = React.useMemo(() => {
    return [...daySchedules].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    )
  }, [daySchedules])

  if (daySchedules.length === 0) {
    return (
      <div className={cn('rounded-lg bg-white shadow', className)}>
        <EmptyState
          title={`${format(date, 'M월 d일', { locale: ko })}에 일정이 없습니다`}
          description="새로운 학습 계획을 추가해보세요."
          onAddSchedule={onAddSchedule}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col rounded-lg bg-white shadow', className)}>
      {/* Summary header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500">
          총 <span className="font-medium text-gray-900">{daySchedules.length}</span>개의 일정
          {' / '}
          완료{' '}
          <span className="font-medium text-success-600">
            {daySchedules.filter((s) => s.isCompleted).length}
          </span>
          개
        </p>
      </div>

      {/* Time grid */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((slot) => {
            const slotSchedules = getSchedulesForHour(sortedSchedules, slot.hour)
            const now = new Date()
            const isCurrentHour = isToday && isSameHour(
              new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.hour),
              now
            )

            return (
              <div
                key={slot.hour}
                className={cn(
                  'flex min-h-[80px] border-b border-gray-100',
                  isCurrentHour && 'bg-primary-50/50'
                )}
              >
                {/* Time label */}
                <div className="flex w-20 shrink-0 items-start justify-end border-r border-gray-100 pr-3 pt-2">
                  <span
                    className={cn(
                      'text-sm',
                      isCurrentHour ? 'font-medium text-primary-600' : 'text-gray-400'
                    )}
                  >
                    {slot.label}
                  </span>
                </div>

                {/* Schedule cards */}
                <div className="flex-1 space-y-2 p-2">
                  {slotSchedules.length > 0 ? (
                    slotSchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        variant="expanded"
                        onClick={onScheduleClick}
                        onToggleComplete={onToggleComplete}
                      />
                    ))
                  ) : (
                    <div className="flex h-full min-h-[60px] items-center justify-center">
                      <span className="text-sm text-gray-300">(빈 시간)</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Current time line */}
          {isToday && currentTimePosition !== null && (
            <div
              className="absolute left-0 right-0 z-20 flex items-center"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="ml-[76px] h-2.5 w-2.5 rounded-full bg-danger-500" />
              <div className="h-0.5 flex-1 bg-danger-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
