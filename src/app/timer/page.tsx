'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  Timer,
  TimerControls,
  SubjectSelector,
  PomodoroToggle,
  TimerComplete,
  TodaySummary,
} from '@/components/features/timer'
import { useStudyTimer, formatTimeShort } from '@/hooks/useStudyTimer'
import { usePomodoroRemaining } from '@/stores/timerStore'
import type { SubjectType } from '@/components/ui/SubjectBadge'

export default function TimerPage() {
  const router = useRouter()
  const [showCompleteModal, setShowCompleteModal] = React.useState(false)
  const [pendingSubject, setPendingSubject] = React.useState<SubjectType | null>(null)

  const {
    status,
    elapsedSeconds,
    selectedSubject,
    isActive,
    pomodoro,
    togglePomodoro,
    start,
    pause,
    resume,
    stop,
    reset,
    setNote,
    completeSession,
    notificationEnabled,
    enableNotification,
    todaySummary,
  } = useStudyTimer()

  const pomodoroRemaining = usePomodoroRemaining()

  // 과목 선택 핸들러
  const handleSubjectSelect = (subject: SubjectType) => {
    if (status === 'idle') {
      setPendingSubject(subject)
    }
  }

  // 시작 핸들러
  const handleStart = () => {
    if (pendingSubject) {
      start(pendingSubject)
      setPendingSubject(null)
    }
  }

  // 완료 핸들러
  const handleStop = () => {
    stop()
    setShowCompleteModal(true)
  }

  // 기록 저장 핸들러
  const handleSave = (note: string) => {
    setNote(note)
    completeSession()
    setShowCompleteModal(false)
  }

  // 계속 학습 핸들러
  const handleContinue = () => {
    setShowCompleteModal(false)
    // 같은 과목으로 다시 시작
    if (selectedSubject) {
      start(selectedSubject)
    }
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    completeSession()
    setShowCompleteModal(false)
  }

  // 포모도로 진행률 계산
  const getPomodoroProgress = (): number => {
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

    return ((sessionDuration - pomodoroRemaining) / sessionDuration) * 100
  }

  // 뒤로가기
  const handleBack = () => {
    if (isActive) {
      const confirmed = window.confirm('학습 중입니다. 정말 나가시겠습니까?')
      if (!confirmed) return
    }
    router.back()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-9 w-9 p-0"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-lg font-semibold text-gray-900">학습 타이머</h1>

        {/* 알림 토글 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={enableNotification}
          className="h-9 w-9 p-0"
          aria-label={notificationEnabled ? '알림 켜짐' : '알림 꺼짐'}
        >
          {notificationEnabled ? (
            <Bell className="h-5 w-5 text-primary-500" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
        </Button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-1 flex-col">
        {/* 타이머 영역 */}
        <div
          className={cn(
            'flex flex-1 flex-col items-center justify-center px-6 py-8',
            isActive && 'bg-white'
          )}
        >
          {/* 타이머 */}
          <Timer
            elapsedSeconds={elapsedSeconds}
            subject={isActive ? selectedSubject : pendingSubject}
            isPomodoro={pomodoro.enabled && isActive}
            pomodoroProgress={getPomodoroProgress()}
            pomodoroSession={pomodoro.currentSession}
            pomodoroRemaining={formatTimeShort(pomodoroRemaining)}
            className="mb-12"
          />

          {/* 컨트롤 */}
          <TimerControls
            status={status}
            onStart={handleStart}
            onPause={pause}
            onResume={resume}
            onStop={handleStop}
            onReset={reset}
            disabled={status === 'idle' && !pendingSubject}
            className="mb-8"
          />

          {/* 과목 선택 (idle 상태에서만) */}
          {status === 'idle' && (
            <SubjectSelector
              selectedSubject={pendingSubject}
              onSelect={handleSubjectSelect}
              className="w-full max-w-md"
            />
          )}

          {/* 포모도로 토글 (idle 또는 학습 중) */}
          {(status === 'idle' || isActive) && (
            <PomodoroToggle
              enabled={pomodoro.enabled}
              onToggle={togglePomodoro}
              completedSessions={pomodoro.completedSessions}
              disabled={isActive}
              className="mt-6 w-full max-w-md"
            />
          )}
        </div>

        {/* 오늘 학습 요약 */}
        <div className="border-t border-gray-200 bg-white p-4">
          <TodaySummary summary={todaySummary} />
        </div>
      </main>

      {/* 학습 완료 모달 */}
      <TimerComplete
        open={showCompleteModal}
        onClose={handleCloseModal}
        subject={selectedSubject}
        durationSeconds={elapsedSeconds}
        onSave={handleSave}
        onContinue={handleContinue}
        isPomodoro={pomodoro.enabled}
        pomodoroSessions={pomodoro.completedSessions}
      />
    </div>
  )
}
