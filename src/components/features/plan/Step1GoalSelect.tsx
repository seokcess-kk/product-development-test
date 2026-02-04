'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, GraduationCap, Target, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { usePlanWizardStore, selectStep1Data } from '@/stores/planWizardStore'
import { step1Schema, type Step1FormData, getDefaultTitle } from '@/lib/validations/plan'
import { GOAL_TYPES, type GoalTypeInfo } from '@/types/plan'
import type { GoalType } from '@/types/database'

// 아이콘 매핑
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  GraduationCap,
  Target,
  Calendar,
}

interface GoalCardProps {
  goal: GoalTypeInfo
  isSelected: boolean
  onSelect: () => void
}

function GoalCard({ goal, isSelected, onSelect }: GoalCardProps) {
  const Icon = iconMap[goal.icon] || BookOpen

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all duration-200',
        'hover:border-primary-300 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-sm'
          : 'border-gray-200 bg-white'
      )}
    >
      <div
        className={cn(
          'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3
        className={cn(
          'mb-1 font-medium',
          isSelected ? 'text-primary-700' : 'text-gray-900'
        )}
      >
        {goal.label}
      </h3>
      <p className="text-sm text-gray-500">{goal.description}</p>
    </button>
  )
}

export function Step1GoalSelect() {
  const step1Data = usePlanWizardStore(selectStep1Data)
  const { setGoalType, setTargetDate, setTitle, setStep1Data } = usePlanWizardStore()

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      goalType: step1Data.goalType ?? undefined,
      targetDate: step1Data.targetDate,
      title: step1Data.title,
    },
    mode: 'onChange',
  })

  const watchGoalType = watch('goalType')
  const watchTitle = watch('title')
  const watchTargetDate = watch('targetDate')

  // Store와 Form 동기화
  useEffect(() => {
    if (watchGoalType && watchGoalType !== step1Data.goalType) {
      setGoalType(watchGoalType)
      // 목표 타입 선택 시 기본 제목 설정 (제목이 비어있을 때만)
      if (!watchTitle) {
        const defaultTitle = getDefaultTitle(watchGoalType)
        setValue('title', defaultTitle)
        setTitle(defaultTitle)
      }
    }
  }, [watchGoalType, step1Data.goalType, setGoalType, watchTitle, setValue, setTitle])

  useEffect(() => {
    if (watchTitle !== step1Data.title) {
      setTitle(watchTitle)
    }
  }, [watchTitle, step1Data.title, setTitle])

  useEffect(() => {
    if (watchTargetDate !== step1Data.targetDate) {
      setTargetDate(watchTargetDate)
    }
  }, [watchTargetDate, step1Data.targetDate, setTargetDate])

  const handleGoalSelect = (goalType: GoalType) => {
    setValue('goalType', goalType)
    trigger('goalType')
  }

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">학습 목표 설정</h2>
        <p className="mt-1 text-sm text-gray-500">
          어떤 목표를 위해 학습 계획을 세우시나요?
        </p>
      </div>

      {/* 목표 타입 선택 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">목표 유형</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOAL_TYPES.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isSelected={watchGoalType === goal.id}
              onSelect={() => handleGoalSelect(goal.id)}
            />
          ))}
        </div>
        {errors.goalType && (
          <p className="text-xs text-danger-500" role="alert">
            {errors.goalType.message}
          </p>
        )}
      </div>

      {/* 목표 날짜 */}
      <div className="space-y-3">
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
          목표 날짜
        </label>
        <p className="text-xs text-gray-500">시험 날짜 또는 학습 목표 달성일을 선택하세요.</p>
        <input
          id="targetDate"
          type="date"
          min={today}
          {...register('targetDate')}
          className={cn(
            'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900',
            'transition-colors duration-150 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            errors.targetDate
              ? 'border-danger-500 focus:ring-2 focus:ring-danger-500'
              : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          )}
        />
        {errors.targetDate && (
          <p className="text-xs text-danger-500" role="alert">
            {errors.targetDate.message}
          </p>
        )}
      </div>

      {/* 목표 제목 */}
      <Input
        label="목표 제목"
        placeholder="예: 1학기 중간고사 대비"
        helperText="학습 목표를 구체적으로 적어주세요."
        {...register('title')}
        error={errors.title?.message}
      />
    </div>
  )
}
