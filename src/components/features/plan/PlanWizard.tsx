'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import {
    selectCurrentStep,
    selectIsCompleted,
    selectIsSubmitting,
    usePlanWizardStore,
} from '@/stores/planWizardStore'
import { WIZARD_STEPS } from '@/types/plan'
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Step1GoalSelect } from './Step1GoalSelect'
import { Step2SubjectSelect } from './Step2SubjectSelect'
import { Step3TimeInput } from './Step3TimeInput'
import { Step4TimeAllocation } from './Step4TimeAllocation'
import { Step5Complete } from './Step5Complete'
import { Stepper, StepperMobile } from './Stepper'

export function PlanWizard() {
  const router = useRouter()
  const toast = useToast()
  const [showExitModal, setShowExitModal] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const currentStep = usePlanWizardStore(selectCurrentStep)
  const isSubmitting = usePlanWizardStore(selectIsSubmitting)
  const isCompleted = usePlanWizardStore(selectIsCompleted)
  const { nextStep, prevStep, goToStep, canProceed, saveDraft, resetWizard } = usePlanWizardStore()

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // 완료된 단계 계산
  const completedSteps = useMemo(() => {
    const steps: number[] = []
    for (let i = 1; i < currentStep; i++) {
      if (canProceed(i)) {
        steps.push(i)
      }
    }
    return steps
  }, [currentStep, canProceed])

  // 현재 단계의 다음 진행 가능 여부
  const canGoNext = canProceed(currentStep)
  const isLastStep = currentStep === WIZARD_STEPS.length

  // 단계 이동 핸들러
  const handleNext = () => {
    if (canGoNext && !isLastStep) {
      nextStep()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep()
    }
  }

  const handleStepClick = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step)) {
      goToStep(step)
    }
  }

  // 임시 저장
  const handleSaveDraft = () => {
    saveDraft()
    toast.success('임시 저장되었습니다.')
  }

  // 나가기
  const handleExit = () => {
    setShowExitModal(true)
  }

  const handleConfirmExit = () => {
    saveDraft()
    router.push('/dashboard')
  }

  const handleExitWithoutSave = () => {
    resetWizard()
    router.push('/dashboard')
  }

  // 현재 단계 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GoalSelect />
      case 2:
        return <Step2SubjectSelect />
      case 3:
        return <Step3TimeInput />
      case 4:
        return <Step4TimeAllocation />
      case 5:
        return <Step5Complete />
      default:
        return <Step1GoalSelect />
    }
  }

  // 하이드레이션 이슈 방지
  if (!hasMounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">나가기</span>
          </button>

          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
            학습 계획 만들기
          </h1>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">임시저장</span>
          </button>
        </div>

        {/* 스텝퍼 - 완료 상태가 아닐 때만 표시 */}
        {!isCompleted && (
          <>
            {/* 데스크탑 스텝퍼 */}
            <div className="hidden sm:block">
              <Stepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
                className="mb-8"
              />
            </div>

            {/* 모바일 스텝퍼 */}
            <div className="sm:hidden">
              <StepperMobile
                currentStep={currentStep}
                totalSteps={WIZARD_STEPS.length}
                className="mb-6"
              />
            </div>
          </>
        )}

        {/* 메인 컨텐츠 */}
        <Card>
          <CardContent className="p-6 sm:p-8">{renderCurrentStep()}</CardContent>
        </Card>

        {/* 네비게이션 버튼 - 완료 상태가 아닐 때만 표시 */}
        {!isCompleted && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              이전
            </Button>

            {!isLastStep && (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canGoNext || isSubmitting}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                다음
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 나가기 확인 모달 */}
      <Modal
        open={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="계획 생성 나가기"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            아직 계획 생성이 완료되지 않았습니다. 어떻게 하시겠습니까?
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={handleExitWithoutSave}
              className="w-full sm:w-auto"
            >
              저장하지 않고 나가기
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmExit}
              className="w-full sm:w-auto"
            >
              임시 저장하고 나가기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
