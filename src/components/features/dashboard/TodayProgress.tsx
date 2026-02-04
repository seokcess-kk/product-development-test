'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export interface TodayProgressProps {
  completed: number
  total: number
  isLoading?: boolean
  className?: string
}

export function TodayProgress({
  completed,
  total,
  isLoading = false,
  className,
}: TodayProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">오늘의 학습</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">오늘의 학습</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4">
        {/* Circular Progress */}
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
          </div>
        </div>
        {/* Stats */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{completed}</span>
            <span className="mx-1">/</span>
            <span>{total}</span>
            <span className="ml-1">완료</span>
          </p>
          {percentage === 100 && (
            <p className="mt-1 text-sm font-medium text-success-600">
              오늘 일정을 모두 완료했어요!
            </p>
          )}
          {percentage > 0 && percentage < 100 && (
            <p className="mt-1 text-sm text-gray-500">
              조금만 더 힘내세요!
            </p>
          )}
          {percentage === 0 && total > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              오늘의 학습을 시작해볼까요?
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
