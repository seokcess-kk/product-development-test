'use client'

import * as React from 'react'
import { cn, formatDuration } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { SUBJECT_LABELS } from '@/lib/mockData/statsData'
import type { StudySummary } from '@/lib/mockData/statsData'
import { Clock, Calendar, BookOpen, Target, TrendingUp, Flame } from 'lucide-react'

export interface StudySummaryCardProps {
  data: StudySummary
  isLoading?: boolean
  className?: string
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subValue?: string
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

function StatItem({ icon, label, value, subValue, variant = 'default' }: StatItemProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
      <div className={cn('p-2 rounded-lg', variantClasses[variant])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
        {subValue && (
          <p className="text-xs text-gray-400">{subValue}</p>
        )}
      </div>
    </div>
  )
}

export function StudySummaryCard({
  data,
  isLoading = false,
  className,
}: StudySummaryCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner size="lg" label="통계를 불러오는 중..." />
        </CardContent>
      </Card>
    )
  }

  const mostStudiedLabel = data.mostStudiedSubject
    ? SUBJECT_LABELS[data.mostStudiedSubject]
    : '-'

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {/* 총 학습 시간 */}
      <StatItem
        icon={<Clock className="h-5 w-5" />}
        label="총 학습 시간"
        value={formatDuration(data.totalMinutes)}
        subValue={`${data.totalSessions}회 학습`}
        variant="primary"
      />

      {/* 평균 일일 학습 시간 */}
      <StatItem
        icon={<TrendingUp className="h-5 w-5" />}
        label="평균 일일 학습"
        value={formatDuration(data.averageDailyMinutes)}
        subValue={`${data.studyDays}일 / ${data.totalDays}일 학습`}
        variant="default"
      />

      {/* 목표 달성률 */}
      <StatItem
        icon={<Target className="h-5 w-5" />}
        label="목표 달성률"
        value={`${data.goalAchievementRate}%`}
        subValue={data.goalAchievementRate >= 80 ? '훌륭해요!' : data.goalAchievementRate >= 50 ? '좋은 진행!' : '조금만 더 힘내세요!'}
        variant={data.goalAchievementRate >= 80 ? 'success' : data.goalAchievementRate >= 50 ? 'primary' : 'warning'}
      />

      {/* 가장 많이 공부한 과목 */}
      <StatItem
        icon={<BookOpen className="h-5 w-5" />}
        label="최다 학습 과목"
        value={mostStudiedLabel}
        variant="default"
      />

      {/* 학습 일수 */}
      <StatItem
        icon={<Calendar className="h-5 w-5" />}
        label="학습 일수"
        value={`${data.studyDays}일`}
        subValue={`총 ${data.totalDays}일 중`}
        variant="default"
      />

      {/* 학습 열정 (세션 수 기반) */}
      <StatItem
        icon={<Flame className="h-5 w-5" />}
        label="학습 열정"
        value={
          data.totalSessions >= 20
            ? '불타오르는 중!'
            : data.totalSessions >= 10
              ? '열심히 하는 중'
              : '시작이 반!'
        }
        subValue={`${data.totalSessions}회 학습 세션`}
        variant={data.totalSessions >= 20 ? 'success' : data.totalSessions >= 10 ? 'primary' : 'default'}
      />
    </div>
  )
}

/**
 * 간단한 요약 카드 (대시보드용)
 */
export interface MiniSummaryCardProps {
  totalMinutes: number
  goalAchievementRate: number
  isLoading?: boolean
  className?: string
}

export function MiniSummaryCard({
  totalMinutes,
  goalAchievementRate,
  isLoading = false,
  className,
}: MiniSummaryCardProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 grid-cols-2', className)}>
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 grid-cols-2', className)}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            총 학습 시간
          </div>
          <p className="text-2xl font-bold text-primary-600">
            {formatDuration(totalMinutes)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Target className="h-4 w-4" />
            목표 달성률
          </div>
          <p className={cn(
            'text-2xl font-bold',
            goalAchievementRate >= 80
              ? 'text-success-600'
              : goalAchievementRate >= 50
                ? 'text-primary-600'
                : 'text-warning-600'
          )}>
            {goalAchievementRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
