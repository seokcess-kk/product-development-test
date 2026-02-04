'use client'

import * as React from 'react'
import { Clock, FileText, Trash2, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SubjectBadge, type SubjectType } from '@/components/ui/SubjectBadge'
import type { StudyRecord } from '@/types/timer'

export interface RecordCardProps {
  record: StudyRecord
  onDelete?: (id: string) => void
  className?: string
}

/** 초를 시간 형식으로 변환 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
  }
  if (minutes > 0) {
    return `${minutes}분`
  }
  return `${secs}초`
}

/** 시간 포맷 (HH:MM) */
function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function RecordCard({ record, onDelete, className }: RecordCardProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    const confirmed = window.confirm('이 기록을 삭제하시겠습니까?')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      onDelete(record.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start gap-3">
        {/* 과목 배지 */}
        <SubjectBadge subject={record.subject} />

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 시간 정보 */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-gray-900 font-medium">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {formatDuration(record.durationSeconds)}
            </span>
            <span className="text-gray-400">
              {formatTime(record.startTime)} - {formatTime(record.endTime)}
            </span>
          </div>

          {/* 포모도로 정보 */}
          {record.isPomodoro && record.pomodoroSessions !== undefined && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs text-primary-600">
                포모도로 {record.pomodoroSessions}세션
              </span>
            </div>
          )}

          {/* 메모 */}
          {record.note && (
            <div className="mt-2 flex items-start gap-1.5">
              <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">{record.note}</p>
            </div>
          )}
        </div>

        {/* 삭제 버튼 */}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-gray-400 hover:text-danger-500"
            aria-label="기록 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}

export default RecordCard
