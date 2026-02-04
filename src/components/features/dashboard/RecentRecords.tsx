'use client'

import * as React from 'react'
import { Clock, BookOpen } from 'lucide-react'
import { cn, formatDuration, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SubjectBadge, type SubjectType } from '@/components/ui/SubjectBadge'
import { Spinner } from '@/components/ui/Spinner'

export interface StudyRecord {
  id: string
  date: string
  subject: SubjectType
  title: string
  minutes: number
}

export interface RecentRecordsProps {
  records: StudyRecord[]
  isLoading?: boolean
  className?: string
}

export function RecentRecords({
  records,
  isLoading = false,
  className,
}: RecentRecordsProps) {
  if (isLoading) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">최근 학습 기록</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" label="기록을 불러오는 중..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">최근 학습 기록</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-2">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">아직 학습 기록이 없습니다</p>
            <p className="mt-1 text-xs text-gray-400">학습을 시작하면 여기에 기록됩니다</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {records.map((record) => (
              <li
                key={record.id}
                className="flex items-center gap-3 px-5 py-3"
              >
                {/* Date */}
                <span className="w-20 shrink-0 text-xs text-gray-500">
                  {formatDate(record.date, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                {/* Subject Badge */}
                <SubjectBadge subject={record.subject} size="sm" />

                {/* Title */}
                <span className="flex-1 truncate text-sm text-gray-900">
                  {record.title}
                </span>

                {/* Duration */}
                <span className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDuration(record.minutes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
