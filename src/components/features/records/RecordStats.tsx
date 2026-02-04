'use client'

import * as React from 'react'
import { Clock, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { subjectLabels, type SubjectType } from '@/components/ui/SubjectBadge'
import type { RecordStats as RecordStatsType } from '@/types/timer'

export interface RecordStatsProps {
  stats: RecordStatsType
  className?: string
}

/** 초를 시간 형식으로 변환 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
  }
  return `${minutes}분`
}

/** 과목별 색상 */
const subjectColors: Record<SubjectType, string> = {
  korean: '#ef4444', // danger-500
  math: '#3b82f6', // primary-500
  english: '#8b5cf6', // violet-500
  science: '#22c55e', // success-500
  social: '#eab308', // warning-500
  other: '#6b7280', // gray-500
}

export function RecordStats({ stats, className }: RecordStatsProps) {
  const { totalSeconds, totalSessions, subjectBreakdown, averageSessionLength } =
    stats

  // 파이 차트 계산
  const total = subjectBreakdown.reduce((sum, item) => sum + item.seconds, 0)
  let cumulativePercent = 0

  const pieSegments = subjectBreakdown.map((item) => {
    const percent = total > 0 ? (item.seconds / total) * 100 : 0
    const startPercent = cumulativePercent
    cumulativePercent += percent

    return {
      ...item,
      percent,
      startPercent,
      color: subjectColors[item.subject],
    }
  })

  // SVG 파이 차트 경로 생성
  const getArcPath = (startPercent: number, percent: number): string => {
    if (percent === 0) return ''
    if (percent >= 100) {
      // 전체 원
      return 'M 50 10 A 40 40 0 1 1 49.99 10'
    }

    const startAngle = (startPercent / 100) * 360 - 90
    const endAngle = ((startPercent + percent) / 100) * 360 - 90

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArc = percent > 50 ? 1 : 0

    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  if (totalSeconds === 0) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <BarChart3 className="mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">통계 데이터가 없습니다</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="pt-5">
        {/* 상단 통계 */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* 총 학습 시간 */}
          <div className="rounded-lg bg-primary-50 p-4">
            <div className="flex items-center gap-2 text-primary-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">총 학습 시간</span>
            </div>
            <p className="mt-1 text-xl font-bold text-primary-700">
              {formatDuration(totalSeconds)}
            </p>
          </div>

          {/* 총 세션 수 */}
          <div className="rounded-lg bg-success-50 p-4">
            <div className="flex items-center gap-2 text-success-600">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">학습 세션</span>
            </div>
            <p className="mt-1 text-xl font-bold text-success-700">
              {totalSessions}회
            </p>
          </div>
        </div>

        {/* 과목별 비율 */}
        {subjectBreakdown.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              과목별 비율
            </h4>

            <div className="flex items-center gap-6">
              {/* 파이 차트 */}
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {pieSegments.map((segment, index) => (
                    <path
                      key={segment.subject}
                      d={getArcPath(segment.startPercent, segment.percent)}
                      fill={segment.color}
                      className="transition-all duration-300"
                    />
                  ))}
                  {/* 중앙 원 (도넛 차트 효과) */}
                  <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
              </div>

              {/* 범례 */}
              <div className="flex-1 space-y-1.5">
                {subjectBreakdown.map((item) => (
                  <div key={item.subject} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: subjectColors[item.subject] }}
                    />
                    <span className="text-xs text-gray-600 flex-1">
                      {subjectLabels[item.subject]}
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 평균 세션 시간 */}
        {averageSessionLength > 0 && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">평균 세션 시간</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDuration(averageSessionLength)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecordStats
