/**
 * StudyMate 공통 타입 정의
 */

// ============================================
// Database 타입 Re-export
// ============================================

export * from './database'
export * from './plan'
export {
  type ViewMode,
  type CalendarSchedule,
  type CalendarState,
  type TimeSlot,
  type MockScheduleData
} from './calendar'
export {
  type TimerStatus,
  type PomodoroSession,
  type PomodoroSettings,
  type PomodoroState,
  type TimerState,
  type TimerActions,
  type TimerStudyRecord,
  type StudyRecord,
  type RecordFilters,
  type GroupedRecords,
  type RecordStats,
  type TodaySummary,
  type TimerStorageData,
  DEFAULT_POMODORO_SETTINGS
} from './timer'

// ============================================
// 기본 타입
// ============================================

/** API 응답 기본 구조 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

/** API 에러 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ============================================
// 통계 관련 타입 (UI용 확장)
// ============================================

/** 일별 학습 통계 (UI용) */
export interface DailyStatsUI {
  date: string
  totalMinutes: number
  sessions: number
  subjectBreakdown: {
    subjectId: string
    subjectName: string
    minutes: number
  }[]
}

/** 주간 학습 통계 (UI용) */
export interface WeeklyStatsUI {
  weekStart: string
  weekEnd: string
  totalMinutes: number
  dailyAverage: number
  mostStudiedSubject?: {
    id: string
    name: string
    minutes: number
  }
  dailyBreakdown: DailyStatsUI[]
}

// ============================================
// UI 관련 타입
// ============================================

/** 네비게이션 아이템 */
export interface NavItem {
  title: string
  href: string
  icon?: string
  disabled?: boolean
  external?: boolean
  badge?: string | number
}

/** 사이드바 네비게이션 */
export interface SidebarNav {
  items: NavItem[]
}

/** 테이블 컬럼 정의 */
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

// ============================================
// 폼 관련 타입
// ============================================

/** 폼 필드 상태 */
export interface FormFieldState {
  error?: string
  touched: boolean
  dirty: boolean
}

/** 폼 상태 */
export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, string>
}

// ============================================
// 유틸리티 타입
// ============================================

/** Nullable 타입 */
export type Nullable<T> = T | null

/** Optional 타입 */
export type Optional<T> = T | undefined

/** 깊은 Partial */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** 선택된 키만 Required */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/** 선택된 키만 Optional */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
