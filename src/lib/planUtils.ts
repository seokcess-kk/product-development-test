/**
 * 계획 생성 유틸리티 함수
 *
 * 시간 자동 배분 알고리즘 및 일정 생성 로직
 */

import { format, addDays, isWeekend, startOfWeek, eachDayOfInterval, isBefore } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { SubjectId, StudyTimeSlot, PlanWizardData, SchedulePreviewItem } from '@/types/plan'
import { getSubjectName, TIME_SLOTS } from '@/types/plan'

/**
 * 과목별 시간 균등 배분 알고리즘
 *
 * @param subjects 선택된 과목 목록
 * @param totalMinutes 총 가용 시간 (분)
 * @returns 과목별 배분된 시간 (분)
 */
export function calculateEqualAllocation(
  subjects: SubjectId[],
  totalMinutes: number
): Record<SubjectId, number> {
  if (subjects.length === 0) return {} as Record<SubjectId, number>

  const baseMinutes = Math.floor(totalMinutes / subjects.length)
  const remainder = totalMinutes % subjects.length

  const allocation: Record<SubjectId, number> = {} as Record<SubjectId, number>

  subjects.forEach((subject, index) => {
    // 나머지 분은 앞쪽 과목부터 1분씩 배분
    allocation[subject] = baseMinutes + (index < remainder ? 1 : 0)
  })

  return allocation
}

/**
 * 과목별 우선순위 기반 시간 배분 알고리즘
 *
 * @param subjects 선택된 과목 목록 (우선순위 순)
 * @param totalMinutes 총 가용 시간 (분)
 * @returns 과목별 배분된 시간 (분)
 */
export function calculatePriorityAllocation(
  subjects: SubjectId[],
  totalMinutes: number
): Record<SubjectId, number> {
  if (subjects.length === 0) return {} as Record<SubjectId, number>

  // 우선순위 가중치 계산 (1등: n점, 2등: n-1점, ...)
  const totalWeight = (subjects.length * (subjects.length + 1)) / 2
  const allocation: Record<SubjectId, number> = {} as Record<SubjectId, number>

  subjects.forEach((subject, index) => {
    const weight = subjects.length - index
    const ratio = weight / totalWeight
    allocation[subject] = Math.round(totalMinutes * ratio)
  })

  // 반올림으로 인한 오차 보정
  const allocatedTotal = Object.values(allocation).reduce((sum, val) => sum + val, 0)
  const diff = totalMinutes - allocatedTotal

  if (diff !== 0 && subjects.length > 0) {
    allocation[subjects[0]] += diff
  }

  return allocation
}

/**
 * 시간대별 세션 생성
 *
 * @param timeSlots 선택된 시간대
 * @param totalMinutes 총 학습 시간 (분)
 * @returns 시간대별 배분된 시간
 */
export function distributeTimeSlots(
  timeSlots: StudyTimeSlot[],
  totalMinutes: number
): { slot: StudyTimeSlot; minutes: number }[] {
  if (timeSlots.length === 0) return []

  const minutesPerSlot = Math.floor(totalMinutes / timeSlots.length)
  const remainder = totalMinutes % timeSlots.length

  return timeSlots.map((slot, index) => ({
    slot,
    minutes: minutesPerSlot + (index < remainder ? 1 : 0),
  }))
}

/**
 * 요일별 한국어 변환
 */
export function getDayOfWeekKorean(date: Date): string {
  return format(date, 'E', { locale: ko })
}

/**
 * 주간 일정 미리보기 생성
 *
 * @param data 위저드 데이터
 * @returns 주간 일정 미리보기
 */
export function generateWeeklyPreview(data: PlanWizardData): SchedulePreviewItem[] {
  const { step1, step2, step3, step4 } = data
  const { targetDate } = step1
  const { selectedSubjects } = step2
  const { dailyStudyMinutes, availableTimeSlots, studyOnWeekends } = step3
  const { subjectAllocations } = step4

  if (!targetDate || selectedSubjects.length === 0) return []

  // 오늘부터 7일간의 일정 생성
  const today = new Date()
  const endDate = addDays(today, 6)
  const days = eachDayOfInterval({ start: today, end: endDate })

  const preview: SchedulePreviewItem[] = []

  days.forEach((day) => {
    // 주말 학습 여부 확인
    if (!studyOnWeekends && isWeekend(day)) {
      preview.push({
        date: format(day, 'yyyy-MM-dd'),
        dayOfWeek: getDayOfWeekKorean(day),
        sessions: [],
        totalMinutes: 0,
      })
      return
    }

    // 시간대별 세션 생성
    const timeDistribution = distributeTimeSlots(availableTimeSlots, dailyStudyMinutes)
    const sessions: SchedulePreviewItem['sessions'] = []

    let subjectIndex = 0
    const subjectCount = selectedSubjects.length

    timeDistribution.forEach(({ slot, minutes }) => {
      const slotInfo = TIME_SLOTS.find((t) => t.id === slot)
      if (!slotInfo || minutes <= 0) return

      // 시간대 내에서 과목 배분
      let remainingMinutes = minutes
      let currentHour = slotInfo.startHour

      while (remainingMinutes > 0 && subjectIndex < subjectCount) {
        const subject = selectedSubjects[subjectIndex % subjectCount]
        const allocation = subjectAllocations[subject] || 30
        const sessionMinutes = Math.min(remainingMinutes, Math.max(30, Math.min(allocation, 90)))

        const startHour = currentHour
        const endMinutes = (startHour * 60 + sessionMinutes) % (24 * 60)
        const endHour = Math.floor(endMinutes / 60)
        const endMin = endMinutes % 60

        sessions.push({
          subject,
          subjectName: getSubjectName(subject),
          startTime: `${String(startHour).padStart(2, '0')}:00`,
          endTime: `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
          durationMinutes: sessionMinutes,
        })

        currentHour = endHour + (endMin > 0 ? 1 : 0)
        remainingMinutes -= sessionMinutes
        subjectIndex++
      }
    })

    preview.push({
      date: format(day, 'yyyy-MM-dd'),
      dayOfWeek: getDayOfWeekKorean(day),
      sessions,
      totalMinutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    })
  })

  return preview
}

/**
 * 목표 날짜까지의 총 학습 시간 계산
 *
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 * @param dailyMinutes 하루 학습 시간 (분)
 * @param studyOnWeekends 주말 학습 여부
 * @returns 총 학습 시간 (분)
 */
export function calculateTotalStudyTime(
  startDate: Date,
  endDate: Date,
  dailyMinutes: number,
  studyOnWeekends: boolean
): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return days.reduce((total, day) => {
    if (!studyOnWeekends && isWeekend(day)) return total
    return total + dailyMinutes
  }, 0)
}

/**
 * 분을 시간/분 문자열로 변환
 */
export function formatMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}

/**
 * 퍼센트 계산
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * 로컬 스토리지 키
 */
export const PLAN_WIZARD_STORAGE_KEY = 'studymate_plan_wizard_draft'

/**
 * 위저드 데이터 임시 저장
 */
export function savePlanWizardDraft(data: PlanWizardData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PLAN_WIZARD_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

/**
 * 임시 저장된 위저드 데이터 불러오기
 */
export function loadPlanWizardDraft(): PlanWizardData | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(PLAN_WIZARD_STORAGE_KEY)
    if (!saved) return null
    return JSON.parse(saved) as PlanWizardData
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

/**
 * 임시 저장 데이터 삭제
 */
export function clearPlanWizardDraft(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(PLAN_WIZARD_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}
