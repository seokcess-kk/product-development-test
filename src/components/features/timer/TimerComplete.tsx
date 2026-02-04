'use client'

import * as React from 'react'
import { Trophy, BookOpen, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { SubjectBadge, type SubjectType } from '@/components/ui/SubjectBadge'

export interface TimerCompleteProps {
  open: boolean
  onClose: () => void
  subject: SubjectType | null
  durationSeconds: number
  onSave: (note: string) => void
  onContinue: () => void
  isPomodoro?: boolean
  pomodoroSessions?: number
}

/** 시간 포맷 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}시간`)
  if (minutes > 0) parts.push(`${minutes}분`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}초`)

  return parts.join(' ')
}

export function TimerComplete({
  open,
  onClose,
  subject,
  durationSeconds,
  onSave,
  onContinue,
  isPomodoro = false,
  pomodoroSessions = 0,
}: TimerCompleteProps) {
  const [note, setNote] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      onSave(note)
      setNote('')
    } finally {
      setIsSaving(false)
    }
  }

  const handleContinue = () => {
    setNote('')
    onContinue()
  }

  const handleClose = () => {
    setNote('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      showCloseButton={false}
      closeOnOverlayClick={false}
      className="max-w-sm"
    >
      <div className="flex flex-col items-center py-2">
        {/* 축하 아이콘 */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <Trophy className="h-8 w-8 text-success-600" />
        </div>

        {/* 제목 */}
        <h2 className="mb-6 text-xl font-bold text-gray-900">학습 완료!</h2>

        {/* 학습 정보 */}
        <div className="mb-6 w-full space-y-3">
          {/* 과목 */}
          {subject && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">과목</span>
              <SubjectBadge subject={subject} className="ml-auto" />
            </div>
          )}

          {/* 시간 */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">시간</span>
            <span className="ml-auto font-medium text-gray-900">
              {formatDuration(durationSeconds)}
            </span>
          </div>

          {/* 포모도로 세션 */}
          {isPomodoro && pomodoroSessions > 0 && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2 w-2 rounded-full',
                      i <= pomodoroSessions ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">포모도로</span>
              <span className="ml-auto font-medium text-gray-900">
                {pomodoroSessions}세션
              </span>
            </div>
          )}
        </div>

        {/* 메모 입력 */}
        <div className="mb-6 w-full">
          <label
            htmlFor="study-note"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <FileText className="h-4 w-4" />
            메모 (선택)
          </label>
          <textarea
            id="study-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="오늘 공부한 내용을 간단히 기록해보세요"
            rows={3}
            className={cn(
              'w-full resize-none rounded-lg border border-gray-300 px-4 py-3',
              'text-sm placeholder:text-gray-400',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
            )}
          />
        </div>

        {/* 버튼 */}
        <div className="flex w-full gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleContinue}
          >
            계속 학습
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            isLoading={isSaving}
          >
            기록 저장
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TimerComplete
