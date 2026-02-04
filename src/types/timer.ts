/**
 * 타이머 및 학습 기록 관련 타입 정의
 */

import type { SubjectType } from '@/components/ui/SubjectBadge'

// ============================================
// 타이머 상태 타입
// ============================================

/** 타이머 상태 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

/** 포모도로 세션 타입 */
export type PomodoroSession = 'work' | 'shortBreak' | 'longBreak'

/** 포모도로 설정 */
export interface PomodoroSettings {
  workDuration: number // 분 단위 (기본 25분)
  shortBreakDuration: number // 분 단위 (기본 5분)
  longBreakDuration: number // 분 단위 (기본 15분)
  sessionsBeforeLongBreak: number // 긴 휴식 전 세션 수 (기본 4)
}

/** 포모도로 상태 */
export interface PomodoroState {
  enabled: boolean
  currentSession: PomodoroSession
  completedSessions: number
  settings: PomodoroSettings
}

/** 타이머 스토어 상태 */
export interface TimerState {
  // 기본 상태
  status: TimerStatus
  elapsedSeconds: number
  selectedSubject: SubjectType | null
  selectedScheduleId: string | null

  // 포모도로
  pomodoro: PomodoroState

  // 세션 정보 (현재 학습 세션)
  sessionStartTime: Date | null
  sessionNote: string

  // 오늘 학습 기록 (로컬 캐시)
  todayRecords: TimerStudyRecord[]
}

/** 타이머 스토어 액션 */
export interface TimerActions {
  // 타이머 컨트롤
  start: (subject: SubjectType, scheduleId?: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void

  // 타이머 틱
  tick: () => void

  // 포모도로
  togglePomodoro: () => void
  nextPomodoroSession: () => void

  // 세션 관리
  setNote: (note: string) => void
  completeSession: () => TimerStudyRecord | null

  // 오늘 기록 관리
  addTodayRecord: (record: TimerStudyRecord) => void
  loadTodayRecords: () => void
  clearTodayRecords: () => void

  // 상태 복원
  restoreFromStorage: () => void
  saveToStorage: () => void
}

// ============================================
// 학습 기록 타입
// ============================================

/** 학습 기록 */
export interface TimerStudyRecord {
  id: string
  userId?: string
  subject: SubjectType
  scheduleId?: string
  startTime: string // ISO 날짜 문자열
  endTime: string // ISO 날짜 문자열
  durationSeconds: number
  note?: string
  createdAt: string
  isPomodoro?: boolean
  pomodoroSessions?: number
}

/** 학습 기록 필터 */
export interface RecordFilters {
  subject: SubjectType | 'all'
  period: 'today' | 'week' | 'month' | 'all'
  dateRange?: {
    start: string
    end: string
  }
}

/** 날짜별 그룹화된 기록 */
export interface GroupedRecords {
  date: string
  displayDate: string
  records: TimerStudyRecord[]
  totalSeconds: number
}

/** 기록 통계 */
export interface RecordStats {
  totalSeconds: number
  totalSessions: number
  subjectBreakdown: {
    subject: SubjectType
    seconds: number
    percentage: number
  }[]
  averageSessionLength: number
}

// ============================================
// 오늘 학습 요약 타입
// ============================================

/** 오늘 학습 요약 */
export interface TodaySummary {
  totalSeconds: number
  totalSessions: number
  subjectBreakdown: {
    subject: SubjectType
    seconds: number
    label: string
  }[]
}

// ============================================
// 유틸리티 타입
// ============================================

/** 로컬 스토리지 저장 데이터 */
export interface TimerStorageData {
  status: TimerStatus
  elapsedSeconds: number
  selectedSubject: SubjectType | null
  selectedScheduleId: string | null
  sessionStartTime: string | null
  sessionNote: string
  pomodoro: PomodoroState
  lastSavedAt: string
}

/** 기본 포모도로 설정 */
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
}

// 하위 호환성을 위한 별칭
export type StudyRecord = TimerStudyRecord
