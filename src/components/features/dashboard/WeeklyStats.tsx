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
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

export interface WeeklyStatsData {
  day: string
  minutes: number
  isToday?: boolean
}

export interface WeeklyStatsProps {
  data: WeeklyStatsData[]
  isLoading?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: WeeklyStatsData
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0]
  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
      <p className="font-medium">{data.payload.day}</p>
      <p className="text-gray-300">{formatDuration(data.value)}</p>
    </div>
  )
}

export function WeeklyStats({
  data,
  isLoading = false,
  className,
}: WeeklyStatsProps) {
  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0)
  const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0

  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">주간 통계</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" label="통계를 불러오는 중..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">주간 통계</CardTitle>
          <span className="text-xs text-gray-500">
            평균 {formatDuration(avgMinutes)}/일
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `${Math.round(value / 60)}h`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isToday ? '#3b82f6' : '#93c5fd'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          이번 주 총 <span className="font-semibold text-primary-600">{formatDuration(totalMinutes)}</span> 학습
        </div>
      </CardContent>
    </Card>
  )
}
