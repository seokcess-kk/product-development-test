'use client'

import { Book, Calculator, Languages, FlaskConical, Globe, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { usePlanWizardStore, selectStep2Data } from '@/stores/planWizardStore'
import { SUBJECTS, type SubjectId } from '@/types/plan'

// 과목별 아이콘 매핑
const subjectIcons: Record<SubjectId, React.ComponentType<{ className?: string }>> = {
  korean: Book,
  math: Calculator,
  english: Languages,
  science: FlaskConical,
  social: Globe,
  other: MoreHorizontal,
}

// 과목별 색상 스타일
const subjectColors: Record<
  SubjectId,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  korean: {
    bg: 'bg-danger-50',
    border: 'border-danger-500',
    text: 'text-danger-700',
    iconBg: 'bg-danger-500',
  },
  math: {
    bg: 'bg-primary-50',
    border: 'border-primary-500',
    text: 'text-primary-700',
    iconBg: 'bg-primary-500',
  },
  english: {
    bg: 'bg-violet-50',
    border: 'border-violet-500',
    text: 'text-violet-700',
    iconBg: 'bg-violet-500',
  },
  science: {
    bg: 'bg-success-50',
    border: 'border-success-500',
    text: 'text-success-700',
    iconBg: 'bg-success-500',
  },
  social: {
    bg: 'bg-warning-50',
    border: 'border-warning-500',
    text: 'text-warning-700',
    iconBg: 'bg-warning-500',
  },
  other: {
    bg: 'bg-gray-50',
    border: 'border-gray-500',
    text: 'text-gray-700',
    iconBg: 'bg-gray-500',
  },
}

interface SubjectCardProps {
  subject: { id: SubjectId; name: string }
  isSelected: boolean
  onToggle: () => void
  disabled?: boolean
}

function SubjectCard({ subject, isSelected, onToggle, disabled }: SubjectCardProps) {
  const Icon = subjectIcons[subject.id]
  const colors = subjectColors[subject.id]

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'relative flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected ? [colors.bg, colors.border] : 'border-gray-200 bg-white hover:border-gray-300',
        disabled && !isSelected && 'cursor-not-allowed opacity-50'
      )}
      aria-pressed={isSelected}
    >
      {/* 체크박스 표시 */}
      <div
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
          isSelected
            ? 'border-transparent bg-primary-500 text-white'
            : 'border-gray-300 bg-white'
        )}
      >
        {isSelected && (
          <svg
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z" />
          </svg>
        )}
      </div>

      {/* 과목 아이콘 */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg text-white',
          isSelected ? colors.iconBg : 'bg-gray-200 text-gray-600'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* 과목명 */}
      <span
        className={cn(
          'font-medium',
          isSelected ? colors.text : 'text-gray-900'
        )}
      >
        {subject.name}
      </span>
    </button>
  )
}

export function Step2SubjectSelect() {
  const step2Data = usePlanWizardStore(selectStep2Data)
  const { toggleSubject } = usePlanWizardStore()

  const selectedCount = step2Data.selectedSubjects.length
  const isMaxSelected = selectedCount >= 7

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">과목 선택</h2>
        <p className="mt-1 text-sm text-gray-500">
          학습할 과목을 선택해주세요. 최대 7개까지 선택할 수 있습니다.
        </p>
      </div>

      {/* 선택 현황 */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">선택한 과목</span>
          <Badge variant={selectedCount > 0 ? 'default' : 'secondary'}>
            {selectedCount} / 7
          </Badge>
        </div>
        {selectedCount === 0 && (
          <span className="text-xs text-danger-500">최소 1개 이상 선택해주세요</span>
        )}
        {isMaxSelected && (
          <span className="text-xs text-warning-600">최대 선택 수에 도달했습니다</span>
        )}
      </div>

      {/* 과목 목록 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((subject) => {
          const isSelected = step2Data.selectedSubjects.includes(subject.id)
          return (
            <SubjectCard
              key={subject.id}
              subject={subject}
              isSelected={isSelected}
              onToggle={() => toggleSubject(subject.id)}
              disabled={isMaxSelected && !isSelected}
            />
          )
        })}
      </div>

      {/* 선택된 과목 표시 */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">선택된 과목 순서</p>
          <div className="flex flex-wrap gap-2">
            {step2Data.selectedSubjects.map((subjectId, index) => {
              const subject = SUBJECTS.find((s) => s.id === subjectId)
              if (!subject) return null
              return (
                <Badge
                  key={subjectId}
                  variant={subjectId as 'korean' | 'math' | 'english' | 'science' | 'social' | 'other'}
                  className="gap-1"
                >
                  <span className="text-xs opacity-70">{index + 1}.</span>
                  {subject.name}
                </Badge>
              )
            })}
          </div>
          <p className="text-xs text-gray-500">
            * 선택한 순서대로 학습 시간이 배분됩니다.
          </p>
        </div>
      )}
    </div>
  )
}
