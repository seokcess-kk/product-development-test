'use client'

import * as React from 'react'
import { cn, formatDuration } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SubjectRanking } from '@/lib/mockData/statsData'

export interface SubjectRankingListProps {
  data: SubjectRanking[]
  isLoading?: boolean
  className?: string
  showChange?: boolean
}

function getRankBadgeStyle(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 2:
      return 'bg-gray-100 text-gray-600 border-gray-300'
    case 3:
      return 'bg-orange-100 text-orange-700 border-orange-300'
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200'
  }
}

interface RankingItemProps {
  item: SubjectRanking
  maxMinutes: number
  showChange?: boolean
}

function RankingItem({ item, maxMinutes, showChange = true }: RankingItemProps) {
  const progressPercent = maxMinutes > 0 ? (item.minutes / maxMinutes) * 100 : 0

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Rank Badge */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
          getRankBadgeStyle(item.rank)
        )}
      >
        {item.rank}
      </div>

      {/* Subject Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-900">{item.label}</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatDuration(item.minutes)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: item.color,
            }}
          />
        </div>

        {/* Change Indicator */}
        {showChange && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">
              {item.percentage}%
            </span>
            {item.change !== 0 ? (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-xs',
                  item.change > 0 ? 'text-success-600' : 'text-danger-500'
                )}
              >
                {item.change > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {item.change > 0 ? '+' : ''}
                {formatDuration(Math.abs(item.change))}
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <Minus className="h-3 w-3" />
                변화 없음
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function SubjectRankingList({
  data,
  isLoading = false,
  className,
  showChange = true,
}: SubjectRankingListProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">과목별 순위</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner size="lg" label="통계를 불러오는 중..." />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">과목별 순위</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p>아직 학습 기록이 없습니다</p>
        </CardContent>
      </Card>
    )
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes))

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">과목별 순위</CardTitle>
          {showChange && (
            <span className="text-xs text-gray-400">이전 기간 대비</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          {data.map((item) => (
            <RankingItem
              key={item.subject}
              item={item}
              maxMinutes={maxMinutes}
              showChange={showChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 간단한 랭킹 목록 (대시보드용)
 */
export interface MiniRankingListProps {
  data: SubjectRanking[]
  isLoading?: boolean
  className?: string
  limit?: number
}

export function MiniRankingList({
  data,
  isLoading = false,
  className,
  limit = 3,
}: MiniRankingListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('text-center text-gray-500 py-4', className)}>
        <p className="text-sm">학습 기록이 없습니다</p>
      </div>
    )
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes))
  const displayData = data.slice(0, limit)

  return (
    <div className={cn('space-y-2', className)}>
      {displayData.map((item) => {
        const progressPercent = maxMinutes > 0 ? (item.minutes / maxMinutes) * 100 : 0

        return (
          <div key={item.subject} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 w-4">{item.rank}.</span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-0.5">
                <span className="text-gray-700">{item.label}</span>
                <span className="text-gray-500">{formatDuration(item.minutes)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
