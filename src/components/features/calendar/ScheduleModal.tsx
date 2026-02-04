'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Clock, Trash2, Check, FileText } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { SubjectBadge } from '@/components/ui/SubjectBadge'
import { cn } from '@/lib/utils'
import type { CalendarSchedule as Schedule } from '@/types/calendar'

export interface ScheduleModalProps {
  schedule: Schedule | null
  open: boolean
  onClose: () => void
  onToggleComplete?: (id: string, completed: boolean) => void
  onDelete?: (id: string) => void
  onEdit?: (schedule: Schedule) => void
}

export function ScheduleModal({
  schedule,
  open,
  onClose,
  onToggleComplete,
  onDelete,
  onEdit,
}: ScheduleModalProps) {
  const [memo, setMemo] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

  // Reset state when schedule changes
  React.useEffect(() => {
    if (schedule) {
      setMemo(schedule.memo || '')
      setIsEditing(false)
    }
  }, [schedule])

  if (!schedule) return null

  const { id, title, subject, startTime, endTime, isCompleted } = schedule

  const dateLabel = format(startTime, 'yyyy년 M월 d일 (EEE)', { locale: ko })
  const timeLabel = `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`

  const handleToggleComplete = () => {
    onToggleComplete?.(id, !isCompleted)
  }

  const handleDelete = () => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      onDelete?.(id)
      onClose()
    }
  }

  const handleSaveMemo = () => {
    if (onEdit) {
      onEdit({ ...schedule, memo })
    }
    setIsEditing(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            삭제
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              닫기
            </Button>
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleToggleComplete}
              leftIcon={<Check className="h-4 w-4" />}
            >
              {isCompleted ? '완료 취소' : '완료'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Subject badge */}
        <div className="flex items-center gap-2">
          <SubjectBadge subject={subject} />
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
              <Check className="h-3 w-3" />
              완료됨
            </span>
          )}
        </div>

        {/* Date and time */}
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{dateLabel}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium">{timeLabel}</span>
        </div>

        {/* Memo section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">메모</span>
            </div>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                {memo ? '편집' : '추가'}
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력하세요..."
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMemo(schedule.memo || '')
                    setIsEditing(false)
                  }}
                >
                  취소
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveMemo}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <p
              className={cn(
                'mt-2 text-sm',
                memo ? 'text-gray-600' : 'text-gray-400'
              )}
            >
              {memo || '메모가 없습니다.'}
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
