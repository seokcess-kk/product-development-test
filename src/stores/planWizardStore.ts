'use client'

/**
 * 계획 생성 위저드 상태 관리
 *
 * Zustand를 사용한 위저드 상태 관리
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { GoalType } from '@/types/database'
import type {
  SubjectId,
  StudyTimeSlot,
  PlanWizardData,
  PlanWizardState,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
} from '@/types/plan'
import { initialPlanWizardData, WIZARD_STEPS } from '@/types/plan'
import {
  calculateEqualAllocation,
  savePlanWizardDraft,
  clearPlanWizardDraft,
} from '@/lib/planUtils'

/**
 * 위저드 스토어 액션 타입
 */
interface PlanWizardActions {
  // 단계 이동
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Step 1: 목표 선택
  setGoalType: (goalType: GoalType) => void
  setTargetDate: (date: string) => void
  setTitle: (title: string) => void
  setStep1Data: (data: Partial<Step1Data>) => void

  // Step 2: 과목 선택
  toggleSubject: (subject: SubjectId) => void
  setSelectedSubjects: (subjects: SubjectId[]) => void

  // Step 3: 가용 시간 입력
  setDailyStudyMinutes: (minutes: number) => void
  toggleTimeSlot: (slot: StudyTimeSlot) => void
  setStudyOnWeekends: (value: boolean) => void
  setStep3Data: (data: Partial<Step3Data>) => void

  // Step 4: 시간 배분
  setSubjectAllocation: (subject: SubjectId, minutes: number) => void
  autoDistributeTime: () => void
  setStep4Data: (data: Partial<Step4Data>) => void

  // 제출 상태
  setIsSubmitting: (value: boolean) => void
  setIsCompleted: (value: boolean) => void

  // 유틸리티
  resetWizard: () => void
  saveDraft: () => void
  getCompletedData: () => PlanWizardData
  canProceed: (step: number) => boolean
}

/**
 * 위저드 스토어 타입
 */
type PlanWizardStore = PlanWizardState & PlanWizardActions

/**
 * 초기 상태
 */
const initialState: PlanWizardState = {
  currentStep: 1,
  data: initialPlanWizardData,
  isSubmitting: false,
  isCompleted: false,
}

/**
 * 위저드 스토어 생성
 */
export const usePlanWizardStore = create<PlanWizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 단계 이동
      goToStep: (step) => {
        const maxStep = WIZARD_STEPS.length
        if (step >= 1 && step <= maxStep) {
          set({ currentStep: step })
        }
      },

      nextStep: () => {
        const { currentStep } = get()
        const maxStep = WIZARD_STEPS.length

        // Step 3 -> Step 4로 이동 시 자동 시간 배분
        if (currentStep === 3) {
          get().autoDistributeTime()
        }

        if (currentStep < maxStep) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      // Step 1: 목표 선택
      setGoalType: (goalType) => {
        set((state) => ({
          data: {
            ...state.data,
            step1: { ...state.data.step1, goalType },
          },
        }))
      },

      setTargetDate: (targetDate) => {
        set((state) => ({
          data: {
            ...state.data,
            step1: { ...state.data.step1, targetDate },
          },
        }))
      },

      setTitle: (title) => {
        set((state) => ({
          data: {
            ...state.data,
            step1: { ...state.data.step1, title },
          },
        }))
      },

      setStep1Data: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            step1: { ...state.data.step1, ...data },
          },
        }))
      },

      // Step 2: 과목 선택
      toggleSubject: (subject) => {
        set((state) => {
          const currentSubjects = state.data.step2.selectedSubjects
          const isSelected = currentSubjects.includes(subject)

          let newSubjects: SubjectId[]
          if (isSelected) {
            newSubjects = currentSubjects.filter((s) => s !== subject)
          } else {
            // 최대 7개 제한
            if (currentSubjects.length >= 7) {
              return state
            }
            newSubjects = [...currentSubjects, subject]
          }

          return {
            data: {
              ...state.data,
              step2: { selectedSubjects: newSubjects },
            },
          }
        })
      },

      setSelectedSubjects: (subjects) => {
        set((state) => ({
          data: {
            ...state.data,
            step2: { selectedSubjects: subjects.slice(0, 7) },
          },
        }))
      },

      // Step 3: 가용 시간 입력
      setDailyStudyMinutes: (dailyStudyMinutes) => {
        set((state) => ({
          data: {
            ...state.data,
            step3: { ...state.data.step3, dailyStudyMinutes },
          },
        }))
      },

      toggleTimeSlot: (slot) => {
        set((state) => {
          const currentSlots = state.data.step3.availableTimeSlots
          const isSelected = currentSlots.includes(slot)

          let newSlots: StudyTimeSlot[]
          if (isSelected) {
            // 최소 1개는 유지
            if (currentSlots.length <= 1) {
              return state
            }
            newSlots = currentSlots.filter((s) => s !== slot)
          } else {
            newSlots = [...currentSlots, slot]
          }

          return {
            data: {
              ...state.data,
              step3: { ...state.data.step3, availableTimeSlots: newSlots },
            },
          }
        })
      },

      setStudyOnWeekends: (studyOnWeekends) => {
        set((state) => ({
          data: {
            ...state.data,
            step3: { ...state.data.step3, studyOnWeekends },
          },
        }))
      },

      setStep3Data: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            step3: { ...state.data.step3, ...data },
          },
        }))
      },

      // Step 4: 시간 배분
      setSubjectAllocation: (subject, minutes) => {
        set((state) => ({
          data: {
            ...state.data,
            step4: {
              subjectAllocations: {
                ...state.data.step4.subjectAllocations,
                [subject]: minutes,
              },
            },
          },
        }))
      },

      autoDistributeTime: () => {
        const { data } = get()
        const { selectedSubjects } = data.step2
        const { dailyStudyMinutes } = data.step3

        const allocations = calculateEqualAllocation(selectedSubjects, dailyStudyMinutes)

        set((state) => ({
          data: {
            ...state.data,
            step4: { subjectAllocations: allocations },
          },
        }))
      },

      setStep4Data: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            step4: { ...state.data.step4, ...data },
          },
        }))
      },

      // 제출 상태
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setIsCompleted: (isCompleted) => set({ isCompleted }),

      // 유틸리티
      resetWizard: () => {
        clearPlanWizardDraft()
        set(initialState)
      },

      saveDraft: () => {
        const { data } = get()
        savePlanWizardDraft(data)
      },

      getCompletedData: () => {
        return get().data
      },

      canProceed: (step) => {
        const { data } = get()

        switch (step) {
          case 1:
            return (
              data.step1.goalType !== null &&
              data.step1.targetDate !== '' &&
              data.step1.title.length >= 2
            )
          case 2:
            return data.step2.selectedSubjects.length >= 1
          case 3:
            return (
              data.step3.dailyStudyMinutes >= 30 && data.step3.availableTimeSlots.length >= 1
            )
          case 4:
            return Object.keys(data.step4.subjectAllocations).length > 0
          default:
            return true
        }
      },
    }),
    {
      name: 'studymate-plan-wizard',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
      }),
    }
  )
)

/**
 * 위저드 데이터 셀렉터
 */
export const selectStep1Data = (state: PlanWizardStore) => state.data.step1
export const selectStep2Data = (state: PlanWizardStore) => state.data.step2
export const selectStep3Data = (state: PlanWizardStore) => state.data.step3
export const selectStep4Data = (state: PlanWizardStore) => state.data.step4
export const selectCurrentStep = (state: PlanWizardStore) => state.currentStep
export const selectIsSubmitting = (state: PlanWizardStore) => state.isSubmitting
export const selectIsCompleted = (state: PlanWizardStore) => state.isCompleted
