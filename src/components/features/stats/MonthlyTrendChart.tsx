'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts'
import { cn, formatDuration } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { MonthlyStats } from '@/lib/mockData/statsData'

export interface MonthlyTrendChartProps {
  data: MonthlyStats[]
  isLoading?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: MonthlyStats
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
      <p className="font-medium mb-1">{data.monthLabel}</p>
      <p className="text-gray-300">
        총 학습: <span className="text-white font-medium">{formatDuration(data.totalMinutes)}</span>
      </p>
      <p className="text-gray-300">
        목표: <span className="text-white">{formatDuration(data.goalMinutes)}</span>
      </p>
      <p className="text-gray-400 text-xs mt-1">
        달성률: {data.achievementRate}%
      </p>
    </div>
  )
}

export function MonthlyTrendChart({
  data,
  isLoading = false,
  className,
}: MonthlyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">월간 학습 트렌드</CardTitle>
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
          <CardTitle className="text-base font-medium">월간 학습 트렌드</CardTitle>
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <p>아직 학습 기록이 없습니다</p>
        </CardContent>
      </Card>
    )
  }

  const maxMinutes = Math.max(...data.map((d) => Math.max(d.totalMinutes, d.goalMinutes)))
  const avgGoal = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.goalMinutes, 0) / data.length)
    : 0

  // 평균 달성률 계산
  const avgAchievementRate = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.achievementRate, 0) / data.length)
    : 0

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">월간 학습 트렌드</CardTitle>
          <span className="text-xs text-gray-500">
            평균 달성률 <span className="font-semibold text-primary-600">{avgAchievementRate}%</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="monthLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `${Math.round(value / 60)}h`}
                domain={[0, Math.ceil(maxMinutes / 60) * 60]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 목표 라인 */}
              <ReferenceLine
                y={avgGoal}
                stroke="#f87171"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '목표',
                  position: 'right',
                  fill: '#f87171',
                  fontSize: 10,
                }}
              />

              {/* 학습 시간 영역 */}
              <Area
                type="monotone"
                dataKey="totalMinutes"
                stroke="#3b82f6"
                fill="url(#colorMinutes)"
                strokeWidth={0}
              />

              {/* 학습 시간 라인 */}
              <Line
                type="monotone"
                dataKey="totalMinutes"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 달성률 바 */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>월별 목표 달성률</span>
          </div>
          <div className="flex gap-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      item.achievementRate >= 100
                        ? 'bg-success-500'
                        : item.achievementRate >= 70
                          ? 'bg-primary-500'
                          : item.achievementRate >= 50
                            ? 'bg-warning-500'
                            : 'bg-danger-400'
                    )}
                    style={{ width: `${Math.min(item.achievementRate, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{item.achievementRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
