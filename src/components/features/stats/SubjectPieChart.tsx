'use client'

import * as React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { cn, formatDuration } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { SubjectStats } from '@/lib/mockData/statsData'

export interface SubjectPieChartProps {
  data: SubjectStats[]
  isLoading?: boolean
  className?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: SubjectStats
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
      <p className="font-medium">{data.label}</p>
      <p className="text-gray-300">{formatDuration(data.minutes)}</p>
      <p className="text-gray-400">{data.percentage}%</p>
    </div>
  )
}

interface CustomLegendProps {
  payload?: Array<{
    value: string
    color: string
    payload: {
      payload: SubjectStats
    }
  }>
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null

  return (
    <ul className="flex flex-col gap-2 text-sm">
      {payload.map((entry, index) => {
        const data = entry.payload.payload
        return (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="flex-1 text-gray-700">{data.label}</span>
            <span className="text-gray-500">{data.percentage}%</span>
            <span className="text-gray-900 font-medium">
              {formatDuration(data.minutes)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function SubjectPieChart({
  data,
  isLoading = false,
  className,
}: SubjectPieChartProps) {
  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0)

  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">과목별 학습 비율</CardTitle>
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
          <CardTitle className="text-base font-medium">과목별 학습 비율</CardTitle>
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <p>아직 학습 기록이 없습니다</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">과목별 학습 비율</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="relative h-48 w-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="minutes"
                  nameKey="label"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500">총 학습</span>
              <span className="text-lg font-bold text-gray-900">
                {formatDuration(totalMinutes)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full">
            <CustomLegend
              payload={data.map((item) => ({
                value: item.label,
                color: item.color,
                payload: { payload: item },
              }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
