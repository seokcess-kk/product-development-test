'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useTimerStore, useIsTimerActive, usePomodoroRemaining, useTodaySummary } from '@/stores/timerStore'
import type { SubjectType } from '@/components/ui/SubjectBadge'

/** 알림 권한 요청 */
async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

/** 시간 포맷 (00:00:00) */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hours, minutes, secs].map((v) => v.toString().padStart(2, '0')).join(':')
}

/** 분:초 포맷 (00:00) */
export function formatTimeShort(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return [minutes, secs].map((v) => v.toString().padStart(2, '0')).join(':')
}

/** 학습 타이머 훅 */
export function useStudyTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const baseElapsedRef = useRef<number>(0)
  const [notificationEnabled, setNotificationEnabled] = useState(false)

  // 스토어 상태
  const status = useTimerStore((state) => state.status)
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds)
  const selectedSubject = useTimerStore((state) => state.selectedSubject)
  const pomodoro = useTimerStore((state) => state.pomodoro)

  // 스토어 액션
  const storeStart = useTimerStore((state) => state.start)
  const pause = useTimerStore((state) => state.pause)
  const resume = useTimerStore((state) => state.resume)
  const stop = useTimerStore((state) => state.stop)
  const reset = useTimerStore((state) => state.reset)
  const tick = useTimerStore((state) => state.tick)
  const togglePomodoro = useTimerStore((state) => state.togglePomodoro)
  const setNote = useTimerStore((state) => state.setNote)
  const completeSession = useTimerStore((state) => state.completeSession)
  const restoreFromStorage = useTimerStore((state) => state.restoreFromStorage)

  // 셀렉터
  const isActive = useIsTimerActive()
  const pomodoroRemaining = usePomodoroRemaining()
  const todaySummary = useTodaySummary()

  // 타이머 시작
  const start = useCallback(
    (subject: SubjectType, scheduleId?: string) => {
      storeStart(subject, scheduleId)
      startTimeRef.current = Date.now()
      baseElapsedRef.current = 0
    },
    [storeStart]
  )

  // 탭 비활성화 시에도 정확한 시간 계산을 위한 인터벌 관리
  useEffect(() => {
    if (status === 'running') {
      // 시작 시간 기록
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now()
        baseElapsedRef.current = elapsedSeconds
      }

      intervalRef.current = setInterval(() => {
        // 탭 비활성화 시에도 정확한 시간 계산
        if (startTimeRef.current !== null) {
          const now = Date.now()
          const realElapsed = Math.floor((now - startTimeRef.current) / 1000) + baseElapsedRef.current
          const diff = realElapsed - useTimerStore.getState().elapsedSeconds

          // 1초 이상 차이나면 보정
          if (diff > 1) {
            for (let i = 0; i < diff; i++) {
              tick()
            }
          } else {
            tick()
          }
        }
      }, 1000)
    } else {
      // 정지 시 인터벌 해제
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // 일시정지 시 기준 시간 업데이트
      if (status === 'paused') {
        baseElapsedRef.current = elapsedSeconds
        startTimeRef.current = null
      }

      // 완전 정지 시 초기화
      if (status === 'idle' || status === 'completed') {
        startTimeRef.current = null
        baseElapsedRef.current = 0
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, elapsedSeconds, tick])

  // 초기 복원
  useEffect(() => {
    restoreFromStorage()
  }, [restoreFromStorage])

  // 알림 권한 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationEnabled(Notification.permission === 'granted')
    }
  }, [])

  // 알림 권한 요청
  const enableNotification = useCallback(async () => {
    const granted = await requestNotificationPermission()
    setNotificationEnabled(granted)
    return granted
  }, [])

  // 창 닫기 전 확인
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'running' || status === 'paused') {
        e.preventDefault()
        e.returnValue = '학습 중입니다. 정말 나가시겠습니까?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [status])

  // 페이지 visibility 변경 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'running') {
        // 탭이 다시 활성화되면 시간 보정
        if (startTimeRef.current !== null) {
          const now = Date.now()
          const realElapsed = Math.floor((now - startTimeRef.current) / 1000) + baseElapsedRef.current
          const currentElapsed = useTimerStore.getState().elapsedSeconds
          const diff = realElapsed - currentElapsed

          if (diff > 0) {
            for (let i = 0; i < diff; i++) {
              tick()
            }
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [status, tick])

  return {
    // 상태
    status,
    elapsedSeconds,
    selectedSubject,
    isActive,

    // 포모도로
    pomodoro,
    pomodoroRemaining,
    togglePomodoro,

    // 액션
    start,
    pause,
    resume,
    stop,
    reset,
    setNote,
    completeSession,

    // 알림
    notificationEnabled,
    enableNotification,

    // 요약
    todaySummary,

    // 유틸
    formatTime: () => formatTime(elapsedSeconds),
    formatPomodoroRemaining: () => formatTimeShort(pomodoroRemaining),
  }
}

export default useStudyTimer
