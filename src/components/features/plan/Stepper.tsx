'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { WIZARD_STEPS } from '@/types/plan'

interface StepperProps {
  currentStep: number
  completedSteps: number[]
  onStepClick?: (step: number) => void
  className?: string
}

export function Stepper({ currentStep, completedSteps, onStepClick, className }: StepperProps) {
  const handleStepClick = (step: number) => {
    // 완료된 단계 또는 현재 단계만 클릭 가능
    if (onStepClick && (completedSteps.includes(step) || step === currentStep)) {
      onStepClick(step)
    }
  }

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between">
        {WIZARD_STEPS.map((item, index) => {
          const isCompleted = completedSteps.includes(item.step)
          const isCurrent = currentStep === item.step
          const isClickable = isCompleted || isCurrent
          const isLast = index === WIZARD_STEPS.length - 1

          return (
            <li key={item.step} className={cn('relative flex flex-1 items-center')}>
              {/* 연결선 */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-5 h-0.5',
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}

              {/* 단계 표시 */}
              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(item.step)}
                  disabled={!isClickable}
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                    isCompleted && 'border-primary-500 bg-primary-500 text-white',
                    isCurrent &&
                      !isCompleted &&
                      'border-primary-500 bg-white text-primary-500',
                    !isCompleted && !isCurrent && 'border-gray-300 bg-white text-gray-400',
                    isClickable && 'cursor-pointer hover:shadow-md',
                    !isClickable && 'cursor-default'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-medium">{item.step}</span>
                  )}
                </button>

                {/* 단계 라벨 */}
                <div className="mt-2 text-center">
                  <span
                    className={cn(
                      'block text-xs font-medium',
                      isCurrent ? 'text-primary-600' : 'text-gray-500'
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="sr-only">{item.description}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * 모바일용 간단한 Stepper
 */
export function StepperMobile({
  currentStep,
  totalSteps = 5,
  className,
}: {
  currentStep: number
  totalSteps?: number
  className?: string
}) {
  const stepInfo = WIZARD_STEPS.find((s) => s.step === currentStep)

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <p className="text-sm text-gray-500">
          단계 {currentStep} / {totalSteps}
        </p>
        <h2 className="text-lg font-semibold text-gray-900">{stepInfo?.title}</h2>
      </div>

      {/* 프로그레스 바 */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 w-6 rounded-full transition-colors',
              i + 1 <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  )
}
