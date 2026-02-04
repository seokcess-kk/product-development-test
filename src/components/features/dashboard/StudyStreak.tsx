'use client'

import * as React from 'react'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'

export interface StudyStreakProps {
  streakDays: number
  isLoading?: boolean
  className?: string
}

function getStreakMessage(days: number): string {
  if (days === 0) {
    return '오늘부터 시작해보세요!'
  }
  if (days === 1) {
    return '좋은 시작이에요!'
  }
  if (days < 3) {
    return '잘하고 있어요!'
  }
  if (days < 7) {
    return '대단해요! 계속 유지하세요!'
  }
  if (days < 14) {
    return '놀라워요! 습관이 되어가고 있어요!'
  }
  if (days < 30) {
    return '정말 대단해요! 학습 고수시네요!'
  }
  return '전설적인 기록이에요!'
}

function getFlameColor(days: number): string {
  if (days === 0) {
    return 'text-gray-300'
  }
  if (days < 3) {
    return 'text-warning-400'
  }
  if (days < 7) {
    return 'text-warning-500'
  }
  if (days < 14) {
    return 'text-danger-400'
  }
  return 'text-danger-500'
}

export function StudyStreak({
  streakDays,
  isLoading = false,
  className,
}: StudyStreakProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="flex items-center gap-4 py-4">
        {/* Flame Icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            streakDays > 0 ? 'bg-warning-100' : 'bg-gray-100'
          )}
        >
          <Flame
            className={cn('h-7 w-7', getFlameColor(streakDays))}
            fill={streakDays > 0 ? 'currentColor' : 'none'}
          />
        </div>

        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{streakDays}</span>
            <span className="text-sm font-medium text-gray-600">일 연속</span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {getStreakMessage(streakDays)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
