import type { SubjectType } from '@/components/ui/SubjectBadge'

export type ViewMode = 'week' | 'day'

export interface CalendarSchedule {
  id: string
  title: string
  subject: SubjectType
  startTime: Date
  endTime: Date
  isCompleted: boolean
  memo?: string
}

export interface CalendarState {
  currentDate: Date
  viewMode: ViewMode
}

export interface TimeSlot {
  hour: number
  label: string
}

// Mock data type for testing
export interface MockScheduleData {
  schedules: CalendarSchedule[]
}

// types/index.ts에서 database.ts의 Schedule과 구분하기 위해 명시적 이름 사용
// 캘린더 컴포넌트 내부에서는 CalendarSchedule을 사용
