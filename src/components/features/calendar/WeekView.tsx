'use client'

import * as React from 'react'
import { format, isToday as isTodayFn, getHours, getMinutes } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { ScheduleCard } from './ScheduleCard'
import { EmptyState } from './EmptyState'
import type { CalendarSchedule as Schedule, TimeSlot } from '@/types/calendar'

export interface WeekViewProps {
  weekDays: Date[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  onScheduleClick?: (schedule: Schedule) => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onDayClick?: (date: Date) => void
  onAddSchedule?: () => void
  className?: string
}

// Calculate position and height for a schedule
function getSchedulePosition(
  schedule: Schedule,
  startHour: number = 6
): { top: number; height: number } {
  const startMinutes =
    (getHours(schedule.startTime) - startHour) * 60 +
    getMinutes(schedule.startTime)
  const endMinutes =
    (getHours(schedule.endTime) - startHour) * 60 + getMinutes(schedule.endTime)
  const duration = endMinutes - startMinutes

  // Each hour = 64px (h-16)
  const pixelsPerMinute = 64 / 60

  return {
    top: startMinutes * pixelsPerMinute,
    height: Math.max(duration * pixelsPerMinute, 32), // Minimum height of 32px
  }
}

// Get schedules for a specific date from the map
function getSchedulesForDate(
  schedules: Schedule[],
  date: Date
): Schedule[] {
  const dateStr = format(date, 'yyyy-MM-dd')
  return schedules.filter(
    (s) => format(s.startTime, 'yyyy-MM-dd') === dateStr
  )
}

export function WeekView({
  weekDays,
  schedules,
  timeSlots,
  onScheduleClick,
  onToggleComplete,
  onDayClick,
  onAddSchedule,
  className,
}: WeekViewProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [currentTimePosition, setCurrentTimePosition] = React.useState<number | null>(null)

  // Scroll to current time on mount
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      const now = new Date()
      const currentHour = getHours(now)
      const startHour = 6

      if (currentHour >= startHour && currentHour <= 24) {
        // Each hour = 64px (h-16)
        const scrollPosition = (currentHour - startHour - 2) * 64
        container.scrollTop = Math.max(0, scrollPosition)
      }
    }
  }, [])

  // Update current time line position
  React.useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      const currentHour = getHours(now)
      const currentMinute = getMinutes(now)
      const startHour = 6

      if (currentHour >= startHour && currentHour <= 24) {
        const minutes = (currentHour - startHour) * 60 + currentMinute
        const pixelsPerMinute = 64 / 60
        setCurrentTimePosition(minutes * pixelsPerMinute)
      } else {
        setCurrentTimePosition(null)
      }
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const hasAnySchedules = schedules.length > 0

  if (!hasAnySchedules) {
    return (
      <div className={cn('rounded-lg bg-white shadow', className)}>
        <EmptyState onAddSchedule={onAddSchedule} />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col rounded-lg bg-white shadow', className)}>
      {/* Mobile scroll hint */}
      <div className="flex items-center justify-center gap-2 border-b border-gray-100 bg-gray-50 py-2 text-xs text-gray-500 md:hidden">
        <span>좌우로 스크롤하여 전체 일정을 확인하세요</span>
      </div>

      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header - Days of week */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="grid grid-cols-[64px_repeat(7,1fr)]">
              {/* Empty cell for time column */}
              <div className="border-r border-gray-200 p-2" />

              {/* Day headers */}
              {weekDays.map((day) => {
                const isToday = isTodayFn(day)
                const daySchedules = getSchedulesForDate(schedules, day)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => onDayClick?.(day)}
                    className={cn(
                      'border-r border-gray-200 p-2 text-center transition-colors hover:bg-gray-50 last:border-r-0',
                      isToday && 'bg-primary-50'
                    )}
                  >
                    <p className="text-xs text-gray-500">
                      {format(day, 'EEE', { locale: ko })}
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-lg font-semibold',
                        isToday ? 'text-primary-600' : 'text-gray-900'
                      )}
                    >
                      {format(day, 'd')}
                    </p>
                    {daySchedules.length > 0 && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {daySchedules.length}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time grid */}
          <div
            ref={scrollContainerRef}
            className="relative flex-1 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            <div className="relative grid grid-cols-[64px_repeat(7,1fr)]">
              {/* Time labels column */}
              <div className="border-r border-gray-200">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.hour}
                    className="relative h-16 border-b border-gray-100"
                  >
                    <span className="absolute -top-2.5 right-2 text-xs text-gray-400">
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((day) => {
                const daySchedules = getSchedulesForDate(schedules, day)
                const isToday = isTodayFn(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'relative border-r border-gray-200 last:border-r-0',
                      isToday && 'bg-primary-50/30'
                    )}
                  >
                    {/* Hour grid lines */}
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.hour}
                        className="h-16 border-b border-gray-100"
                      />
                    ))}

                    {/* Schedules */}
                    {daySchedules.map((schedule) => {
                      const { top, height } = getSchedulePosition(schedule)
                      return (
                        <div
                          key={schedule.id}
                          className="absolute inset-x-0.5 z-10"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <ScheduleCard
                            schedule={schedule}
                            variant="compact"
                            onClick={onScheduleClick}
                            onToggleComplete={onToggleComplete}
                            className="h-full"
                          />
                        </div>
                      )
                    })}

                    {/* Current time line */}
                    {isToday && currentTimePosition !== null && (
                      <div
                        className="absolute left-0 right-0 z-20 flex items-center"
                        style={{ top: `${currentTimePosition}px` }}
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-danger-500" />
                        <div className="h-0.5 flex-1 bg-danger-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
