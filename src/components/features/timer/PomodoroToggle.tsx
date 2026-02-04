'use client'

import * as React from 'react'
import { Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PomodoroToggleProps {
  enabled: boolean
  onToggle: () => void
  completedSessions?: number
  disabled?: boolean
  className?: string
}

export function PomodoroToggle({
  enabled,
  onToggle,
  completedSessions = 0,
  disabled = false,
  className,
}: PomodoroToggleProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 토글 */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          'flex items-center gap-3 rounded-lg border p-3 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          enabled
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 bg-white hover:border-gray-300',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            enabled ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
          )}
        >
          <Timer className="h-5 w-5" />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-medium',
                enabled ? 'text-primary-700' : 'text-gray-700'
              )}
            >
              포모도로 모드
            </span>

            {/* 토글 스위치 */}
            <div
              className={cn(
                'relative ml-auto h-6 w-11 rounded-full transition-colors',
                enabled ? 'bg-primary-500' : 'bg-gray-200'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  enabled ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            25분 집중 + 5분 휴식
          </p>
        </div>
      </button>

      {/* 세션 카운터 */}
      {enabled && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((session) => (
            <div
              key={session}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-colors',
                session <= completedSessions
                  ? 'bg-primary-500'
                  : 'bg-gray-200'
              )}
              aria-label={`세션 ${session} ${session <= completedSessions ? '완료' : '미완료'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {completedSessions}/4 세션
          </span>
        </div>
      )}

      {/* 설명 */}
      {enabled && (
        <p className="text-center text-xs text-gray-400">
          4세션 완료 후 15분 긴 휴식
        </p>
      )}
    </div>
  )
}

export default PomodoroToggle
