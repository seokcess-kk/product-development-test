'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import { cn, formatDuration } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { format, isToday } from 'date-fns'
import type { DailyStats } from '@/lib/mockData/statsData'

export interface DailyBarChartProps {
  data: DailyStats[]
  goalMinutes?: number
  isLoading?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: DailyStats
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const percentage = data.goalMinutes > 0
    ? Math.round((data.totalMinutes / data.goalMinutes) * 100)
    : 0

  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg min-w-[120px]">
      <p className="font-medium mb-1">
        {format(data.date, 'M월 d일')} ({data.dayLabel})
      </p>
      <p className="text-gray-300">
        학습: <span className="text-white font-medium">{formatDuration(data.totalMinutes)}</span>
      </p>
      <p className="text-gray-400 text-xs">목표 달성률: {percentage}%</p>
      {data.subjects.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          {data.subjects.slice(0, 3).map((s, i) => (
            <p key={i} className="text-gray-400 text-xs">
              {s.subject}: {formatDuration(s.minutes)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function DailyBarChart({
  data,
  goalMinutes = 180,
  isLoading = false,
  className,
}: DailyBarChartProps) {
  const maxMinutes = Math.max(...data.map((d) => d.totalMinutes), goalMinutes)

  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">일별 학습 시간</CardTitle>
          </div>
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
          <CardTitle className="text-base font-medium">일별 학습 시간</CardTitle>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>아직 학습 기록이 없습니다</p>
        </CardContent>
      </Card>
    )
  }

  // 평균 학습 시간 계산
  const totalStudyMinutes = data.reduce((sum, d) => sum + d.totalMinutes, 0)
  const avgMinutes = data.length > 0 ? Math.round(totalStudyMinutes / data.length) : 0

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">일별 학습 시간</CardTitle>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded bg-danger-400"></span>
              목표 {formatDuration(goalMinutes)}
            </span>
            <span>평균 {formatDuration(avgMinutes)}/일</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                interval={data.length > 14 ? Math.floor(data.length / 7) - 1 : 0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `${Math.round(value / 60)}h`}
                domain={[0, Math.ceil(maxMinutes / 60) * 60]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />

              {/* 목표 라인 */}
              <ReferenceLine
                y={goalMinutes}
                stroke="#f87171"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />

              <Bar dataKey="totalMinutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => {
                  const isCurrentDay = isToday(entry.date)
                  const reachedGoal = entry.totalMinutes >= goalMinutes

                  let fill = '#93c5fd' // 기본: 연한 파란색
                  if (isCurrentDay) {
                    fill = '#3b82f6' // 오늘: 진한 파란색
                  } else if (reachedGoal) {
                    fill = '#22c55e' // 목표 달성: 초록색
                  }

                  return <Cell key={`cell-${index}`} fill={fill} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-[#93c5fd]"></span>
            미달성
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-[#22c55e]"></span>
            목표 달성
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-[#3b82f6]"></span>
            오늘
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
