'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  isSameDay,
  getWeek,
  isToday as isTodayFn,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ViewMode, CalendarSchedule as Schedule, TimeSlot } from '@/types/calendar'

interface UseCalendarOptions {
  initialDate?: Date
  initialViewMode?: ViewMode
}

interface UseCalendarReturn {
  // State
  currentDate: Date
  viewMode: ViewMode

  // Computed values
  weekDays: Date[]
  weekNumber: number
  weekLabel: string
  dayLabel: string
  isToday: boolean

  // Navigation
  goToNextWeek: () => void
  goToPreviousWeek: () => void
  goToNextDay: () => void
  goToPreviousDay: () => void
  goToToday: () => void
  goToDate: (date: Date) => void

  // View mode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void

  // Utilities
  getSchedulesForDate: (schedules: Schedule[], date: Date) => Schedule[]
  getSchedulesForWeek: (schedules: Schedule[]) => Map<string, Schedule[]>
  timeSlots: TimeSlot[]
}

// Generate time slots from 6:00 to 24:00
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 6; hour <= 24; hour++) {
    slots.push({
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
    })
  }
  return slots
}

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const { initialDate = new Date(), initialViewMode = 'week' } = options

  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)

  // Computed: Get week days (Mon-Sun)
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [currentDate])

  // Computed: Week number
  const weekNumber = useMemo(() => {
    return getWeek(currentDate, { weekStartsOn: 1 })
  }, [currentDate])

  // Computed: Week label (e.g., "2024년 1월 3주차")
  const weekLabel = useMemo(() => {
    const year = format(currentDate, 'yyyy', { locale: ko })
    const month = format(currentDate, 'M', { locale: ko })
    return `${year}년 ${month}월 ${weekNumber}주차`
  }, [currentDate, weekNumber])

  // Computed: Day label (e.g., "2024년 1월 17일 (수)")
  const dayLabel = useMemo(() => {
    return format(currentDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })
  }, [currentDate])

  // Computed: Is today
  const isToday = useMemo(() => {
    return isTodayFn(currentDate)
  }, [currentDate])

  // Navigation: Week
  const goToNextWeek = useCallback(() => {
    setCurrentDate((prev) => addWeeks(prev, 1))
  }, [])

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate((prev) => subWeeks(prev, 1))
  }, [])

  // Navigation: Day
  const goToNextDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, 1))
  }, [])

  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prev) => subDays(prev, 1))
  }, [])

  // Navigation: Today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  // Navigation: Specific date
  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  // View mode toggle
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'week' ? 'day' : 'week'))
  }, [])

  // Utility: Get schedules for a specific date
  const getSchedulesForDate = useCallback((schedules: Schedule[], date: Date): Schedule[] => {
    return schedules.filter((schedule) => isSameDay(schedule.startTime, date))
  }, [])

  // Utility: Get schedules grouped by date for the week
  const getSchedulesForWeek = useCallback((schedules: Schedule[]): Map<string, Schedule[]> => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

    const grouped = new Map<string, Schedule[]>()

    // Initialize map with all week days
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const key = format(day, 'yyyy-MM-dd')
      grouped.set(key, [])
    }

    // Group schedules by date
    schedules.forEach((schedule) => {
      if (schedule.startTime >= weekStart && schedule.startTime <= weekEnd) {
        const key = format(schedule.startTime, 'yyyy-MM-dd')
        const existing = grouped.get(key) || []
        grouped.set(key, [...existing, schedule])
      }
    })

    return grouped
  }, [currentDate])

  // Time slots
  const timeSlots = useMemo(() => generateTimeSlots(), [])

  return {
    // State
    currentDate,
    viewMode,

    // Computed
    weekDays,
    weekNumber,
    weekLabel,
    dayLabel,
    isToday,

    // Navigation
    goToNextWeek,
    goToPreviousWeek,
    goToNextDay,
    goToPreviousDay,
    goToToday,
    goToDate,

    // View mode
    setViewMode,
    toggleViewMode,

    // Utilities
    getSchedulesForDate,
    getSchedulesForWeek,
    timeSlots,
  }
}
