'use client'

import * as React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title?: string
  description?: string
  onAddSchedule?: () => void
  className?: string
}

export function EmptyState({
  title = '일정이 없습니다',
  description = '새로운 학습 계획을 추가해보세요.',
  onAddSchedule,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {onAddSchedule && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAddSchedule}
          leftIcon={<Plus className="h-4 w-4" />}
          className="mt-4"
        >
          새 계획 만들기
        </Button>
      )}
    </div>
  )
}
