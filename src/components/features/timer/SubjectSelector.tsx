'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SubjectBadge, subjectLabels, type SubjectType } from '@/components/ui/SubjectBadge'

export interface SubjectSelectorProps {
  selectedSubject: SubjectType | null
  onSelect: (subject: SubjectType) => void
  disabled?: boolean
  className?: string
}

const subjects: SubjectType[] = ['korean', 'math', 'english', 'science', 'social', 'other']

export function SubjectSelector({
  selectedSubject,
  onSelect,
  disabled = false,
  className,
}: SubjectSelectorProps) {
  return (
    <div className={cn('w-full', className)}>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        과목 선택
      </label>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => {
          const isSelected = selectedSubject === subject
          return (
            <button
              key={subject}
              type="button"
              onClick={() => onSelect(subject)}
              disabled={disabled}
              className={cn(
                'rounded-full transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isSelected && 'ring-2 ring-primary-500 ring-offset-2',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-pressed={isSelected}
              aria-label={`${subjectLabels[subject]} 선택`}
            >
              <SubjectBadge
                subject={subject}
                className={cn(
                  'px-4 py-2 text-sm transition-transform',
                  isSelected && 'scale-105 font-semibold',
                  !disabled && 'hover:scale-105'
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SubjectSelector
