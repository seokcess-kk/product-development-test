'use client'

import * as React from 'react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RecordCard } from './RecordCard'
import type { GroupedRecords, StudyRecord } from '@/types/timer'

export interface RecordListProps {
  groupedRecords: GroupedRecords[]
  onDelete?: (id: string) => void
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

export function RecordList({
  groupedRecords,
  onDelete,
  className,
}: RecordListProps) {
  if (groupedRecords.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-16 text-center',
          className
        )}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <BookOpen className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-1 font-medium text-gray-900">학습 기록이 없습니다</h3>
        <p className="text-sm text-gray-500">
          타이머로 학습을 시작하면 기록이 표시됩니다
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {groupedRecords.map((group) => (
        <div key={group.date}>
          {/* 날짜 헤더 */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {group.displayDate}
            </h3>
            <span className="text-sm text-gray-500">
              총 {formatDuration(group.totalSeconds)}
            </span>
          </div>

          {/* 기록 목록 */}
          <div className="space-y-3">
            {group.records.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecordList
