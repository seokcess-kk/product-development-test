'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SubjectBadge, type SubjectType } from '@/components/ui/SubjectBadge'

export interface TimerProps {
  elapsedSeconds: number
  subject: SubjectType | null
  isPomodoro?: boolean
  pomodoroProgress?: number // 0-100
  pomodoroSession?: 'work' | 'shortBreak' | 'longBreak'
  pomodoroRemaining?: string
  className?: string
}

/** 시간 포맷 (00:00:00) */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hours, minutes, secs].map((v) => v.toString().padStart(2, '0')).join(':')
}

/** 포모도로 세션 라벨 */
const sessionLabels: Record<string, string> = {
  work: '집중 시간',
  shortBreak: '짧은 휴식',
  longBreak: '긴 휴식',
}

export function Timer({
  elapsedSeconds,
  subject,
  isPomodoro = false,
  pomodoroProgress = 0,
  pomodoroSession = 'work',
  pomodoroRemaining,
  className,
}: TimerProps) {
  const timeDisplay = formatTime(elapsedSeconds)

  // SVG 원형 진행률
  const radius = 140
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pomodoroProgress / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* 과목 배지 */}
      {subject && (
        <div className="mb-8">
          <SubjectBadge subject={subject} className="px-4 py-1.5 text-base" />
        </div>
      )}

      {/* 타이머 디스플레이 */}
      <div className="relative flex items-center justify-center">
        {/* 포모도로 원형 진행률 */}
        {isPomodoro && (
          <svg
            className="absolute -rotate-90 transform"
            width="320"
            height="320"
            viewBox="0 0 320 320"
          >
            {/* 배경 원 */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200"
            />
            {/* 진행률 원 */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                'transition-all duration-500',
                pomodoroSession === 'work' && 'text-primary-500',
                pomodoroSession === 'shortBreak' && 'text-success-500',
                pomodoroSession === 'longBreak' && 'text-violet-500'
              )}
            />
          </svg>
        )}

        {/* 시간 표시 */}
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            isPomodoro ? 'h-64 w-64' : 'h-48 w-48'
          )}
        >
          {/* 포모도로 세션 라벨 */}
          {isPomodoro && (
            <span
              className={cn(
                'mb-2 text-sm font-medium',
                pomodoroSession === 'work' && 'text-primary-600',
                pomodoroSession === 'shortBreak' && 'text-success-600',
                pomodoroSession === 'longBreak' && 'text-violet-600'
              )}
            >
              {sessionLabels[pomodoroSession]}
            </span>
          )}

          {/* 메인 시간 (포모도로: 남은 시간, 일반: 경과 시간) */}
          <span
            className={cn(
              'font-mono font-bold tabular-nums tracking-tight text-gray-900',
              isPomodoro ? 'text-5xl' : 'text-6xl'
            )}
          >
            {isPomodoro && pomodoroRemaining ? pomodoroRemaining : timeDisplay}
          </span>

          {/* 포모도로 모드일 때 총 경과 시간 */}
          {isPomodoro && (
            <span className="mt-2 text-sm text-gray-500">
              총 학습: {timeDisplay}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Timer
