'use client'

import { create } from 'zustand'
import type { SubjectType } from '@/components/ui/SubjectBadge'
import type {
  TimerState,
  TimerActions,
  TimerStatus,
  PomodoroSession,
  StudyRecord,
  TimerStorageData,
  TodaySummary,
} from '@/types/timer'
import { DEFAULT_POMODORO_SETTINGS } from '@/types/timer'

const STORAGE_KEY = 'studymate_timer'
const RECORDS_STORAGE_KEY = 'studymate_today_records'
const ALL_RECORDS_STORAGE_KEY = 'studymate_all_records'

/** 고유 ID 생성 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/** 오늘 날짜 문자열 (YYYY-MM-DD) */
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

/** 초기 상태 */
const initialState: TimerState = {
  status: 'idle',
  elapsedSeconds: 0,
  selectedSubject: null,
  selectedScheduleId: null,
  pomodoro: {
    enabled: false,
    currentSession: 'work',
    completedSessions: 0,
    settings: DEFAULT_POMODORO_SETTINGS,
  },
  sessionStartTime: null,
  sessionNote: '',
  todayRecords: [],
}

/** 타이머 스토어 */
export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  ...initialState,

  // ============================================
  // 타이머 컨트롤
  // ============================================

  start: (subject: SubjectType, scheduleId?: string) => {
    const now = new Date()
    set({
      status: 'running',
      elapsedSeconds: 0,
      selectedSubject: subject,
      selectedScheduleId: scheduleId ?? null,
      sessionStartTime: now,
      sessionNote: '',
      pomodoro: {
        ...get().pomodoro,
        currentSession: 'work',
        completedSessions: 0,
      },
    })
    get().saveToStorage()
  },

  pause: () => {
    set({ status: 'paused' })
    get().saveToStorage()
  },

  resume: () => {
    set({ status: 'running' })
    get().saveToStorage()
  },

  stop: () => {
    set({ status: 'completed' })
    get().saveToStorage()
  },

  reset: () => {
    set({
      status: 'idle',
      elapsedSeconds: 0,
      selectedSubject: null,
      selectedScheduleId: null,
      sessionStartTime: null,
      sessionNote: '',
      pomodoro: {
        ...get().pomodoro,
        currentSession: 'work',
        completedSessions: 0,
      },
    })
    get().saveToStorage()
  },

  // ============================================
  // 타이머 틱
  // ============================================

  tick: () => {
    const { status, elapsedSeconds, pomodoro } = get()
    if (status !== 'running') return

    const newElapsed = elapsedSeconds + 1
    set({ elapsedSeconds: newElapsed })

    // 포모도로 모드일 때 세션 완료 체크
    if (pomodoro.enabled) {
      const { currentSession, settings } = pomodoro
      let sessionDuration = 0

      switch (currentSession) {
        case 'work':
          sessionDuration = settings.workDuration * 60
          break
        case 'shortBreak':
          sessionDuration = settings.shortBreakDuration * 60
          break
        case 'longBreak':
          sessionDuration = settings.longBreakDuration * 60
          break
      }

      if (newElapsed >= sessionDuration) {
        get().nextPomodoroSession()
      }
    }

    // 10초마다 저장
    if (newElapsed % 10 === 0) {
      get().saveToStorage()
    }
  },

  // ============================================
  // 포모도로
  // ============================================

  togglePomodoro: () => {
    const { pomodoro } = get()
    set({
      pomodoro: {
        ...pomodoro,
        enabled: !pomodoro.enabled,
      },
    })
    get().saveToStorage()
  },

  nextPomodoroSession: () => {
    const { pomodoro, status } = get()
    if (!pomodoro.enabled || status !== 'running') return

    const { currentSession, completedSessions, settings } = pomodoro
    let nextSession: PomodoroSession
    let newCompletedSessions = completedSessions

    if (currentSession === 'work') {
      newCompletedSessions += 1
      // 4세션 완료 후 긴 휴식
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        nextSession = 'longBreak'
      } else {
        nextSession = 'shortBreak'
      }
    } else {
      // 휴식 후 작업
      nextSession = 'work'
    }

    set({
      elapsedSeconds: 0,
      pomodoro: {
        ...pomodoro,
        currentSession: nextSession,
        completedSessions: newCompletedSessions,
      },
    })

    // 알림
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const message =
          nextSession === 'work'
            ? '휴식 끝! 다시 집중할 시간입니다.'
            : nextSession === 'longBreak'
              ? '수고했어요! 긴 휴식을 취하세요.'
              : '잘했어요! 짧은 휴식을 취하세요.'

        new Notification('StudyMate', {
          body: message,
          icon: '/favicon.ico',
        })
      }
    }

    // 진동 (모바일)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    get().saveToStorage()
  },

  // ============================================
  // 세션 관리
  // ============================================

  setNote: (note: string) => {
    set({ sessionNote: note })
  },

  completeSession: (): StudyRecord | null => {
    const {
      selectedSubject,
      selectedScheduleId,
      sessionStartTime,
      elapsedSeconds,
      sessionNote,
      pomodoro,
    } = get()

    if (!selectedSubject || !sessionStartTime) return null

    const now = new Date()
    const record: StudyRecord = {
      id: generateId(),
      subject: selectedSubject,
      scheduleId: selectedScheduleId ?? undefined,
      startTime: sessionStartTime.toISOString(),
      endTime: now.toISOString(),
      durationSeconds: elapsedSeconds,
      note: sessionNote || undefined,
      createdAt: now.toISOString(),
      isPomodoro: pomodoro.enabled,
      pomodoroSessions: pomodoro.enabled ? pomodoro.completedSessions : undefined,
    }

    // 오늘 기록에 추가
    get().addTodayRecord(record)

    // 상태 초기화
    get().reset()

    return record
  },

  // ============================================
  // 오늘 기록 관리
  // ============================================

  addTodayRecord: (record: StudyRecord) => {
    const { todayRecords } = get()
    const newRecords = [...todayRecords, record]
    set({ todayRecords: newRecords })

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      const today = getTodayDateString()
      localStorage.setItem(
        RECORDS_STORAGE_KEY,
        JSON.stringify({
          date: today,
          records: newRecords,
        })
      )

      // 전체 기록에도 추가
      try {
        const storedAll = localStorage.getItem(ALL_RECORDS_STORAGE_KEY)
        const allRecords: StudyRecord[] = storedAll ? JSON.parse(storedAll) : []
        allRecords.push(record)
        localStorage.setItem(ALL_RECORDS_STORAGE_KEY, JSON.stringify(allRecords))
      } catch {
        // 저장 에러 무시
      }
    }
  },

  loadTodayRecords: () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(RECORDS_STORAGE_KEY)
      if (!stored) return

      const data = JSON.parse(stored)
      const today = getTodayDateString()

      // 오늘 날짜 기록만 로드
      if (data.date === today && Array.isArray(data.records)) {
        set({ todayRecords: data.records })
      } else {
        // 다른 날짜 기록은 삭제
        localStorage.removeItem(RECORDS_STORAGE_KEY)
      }
    } catch {
      // 파싱 에러 시 무시
    }
  },

  clearTodayRecords: () => {
    set({ todayRecords: [] })
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECORDS_STORAGE_KEY)
    }
  },

  // ============================================
  // 상태 복원
  // ============================================

  restoreFromStorage: () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const data: TimerStorageData = JSON.parse(stored)

      // 마지막 저장 시간 확인 (1시간 이상 지났으면 무시)
      const lastSaved = new Date(data.lastSavedAt)
      const now = new Date()
      const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60)

      if (hoursDiff > 1) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      // 상태 복원
      set({
        status: data.status === 'running' ? 'paused' : data.status, // 복원 시 일시정지 상태로
        elapsedSeconds: data.elapsedSeconds,
        selectedSubject: data.selectedSubject,
        selectedScheduleId: data.selectedScheduleId,
        sessionStartTime: data.sessionStartTime ? new Date(data.sessionStartTime) : null,
        sessionNote: data.sessionNote,
        pomodoro: data.pomodoro,
      })
    } catch {
      // 파싱 에러 시 무시
    }

    // 오늘 기록도 로드
    get().loadTodayRecords()
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return

    const { status, elapsedSeconds, selectedSubject, selectedScheduleId, sessionStartTime, sessionNote, pomodoro } =
      get()

    // idle 상태면 저장 안함
    if (status === 'idle') {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    const data: TimerStorageData = {
      status,
      elapsedSeconds,
      selectedSubject,
      selectedScheduleId,
      sessionStartTime: sessionStartTime?.toISOString() ?? null,
      sessionNote,
      pomodoro,
      lastSavedAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },
}))

// ============================================
// 셀렉터
// ============================================

/** 오늘 학습 요약 계산 */
export function useTodaySummary(): TodaySummary {
  const todayRecords = useTimerStore((state) => state.todayRecords)

  const totalSeconds = todayRecords.reduce((sum, r) => sum + r.durationSeconds, 0)
  const totalSessions = todayRecords.length

  // 과목별 집계
  const subjectMap = new Map<SubjectType, number>()
  const subjectLabels: Record<SubjectType, string> = {
    korean: '국어',
    math: '수학',
    english: '영어',
    science: '과학',
    social: '사회',
    other: '기타',
  }

  for (const record of todayRecords) {
    const current = subjectMap.get(record.subject) ?? 0
    subjectMap.set(record.subject, current + record.durationSeconds)
  }

  const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, seconds]) => ({
    subject,
    seconds,
    label: subjectLabels[subject],
  }))

  // 시간 순 정렬
  subjectBreakdown.sort((a, b) => b.seconds - a.seconds)

  return {
    totalSeconds,
    totalSessions,
    subjectBreakdown,
  }
}

/** 타이머가 활성 상태인지 확인 */
export function useIsTimerActive(): boolean {
  const status = useTimerStore((state) => state.status)
  return status === 'running' || status === 'paused'
}

/** 포모도로 현재 세션 남은 시간 (초) */
export function usePomodoroRemaining(): number {
  const { elapsedSeconds, pomodoro } = useTimerStore()

  if (!pomodoro.enabled) return 0

  const { currentSession, settings } = pomodoro
  let sessionDuration = 0

  switch (currentSession) {
    case 'work':
      sessionDuration = settings.workDuration * 60
      break
    case 'shortBreak':
      sessionDuration = settings.shortBreakDuration * 60
      break
    case 'longBreak':
      sessionDuration = settings.longBreakDuration * 60
      break
  }

  return Math.max(0, sessionDuration - elapsedSeconds)
}
