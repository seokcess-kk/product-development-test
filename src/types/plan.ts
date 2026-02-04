/**
 * 계획 생성 위저드 관련 타입 정의
 */

import type { GoalType, SubjectGoal } from './database'

/**
 * 과목 타입
 */
export type SubjectId = 'korean' | 'math' | 'english' | 'science' | 'social' | 'other'

/**
 * 과목 정보
 */
export interface Subject {
  id: SubjectId
  name: string
  priority: number
  allocatedMinutes: number
}

/**
 * 학습 시간대 타입 (계획 생성용)
 */
export type StudyTimeSlot = 'morning' | 'afternoon' | 'evening'

/**
 * 시간대 정보
 */
export interface TimeSlotInfo {
  id: StudyTimeSlot
  label: string
  description: string
  startHour: number
  endHour: number
}

/**
 * 목표 타입 정보
 */
export interface GoalTypeInfo {
  id: GoalType
  label: string
  description: string
  icon: string
}

/**
 * 위저드 Step 1: 목표 선택 데이터
 */
export interface Step1Data {
  goalType: GoalType | null
  targetDate: string
  title: string
}

/**
 * 위저드 Step 2: 과목 선택 데이터
 */
export interface Step2Data {
  selectedSubjects: SubjectId[]
}

/**
 * 위저드 Step 3: 가용 시간 입력 데이터
 */
export interface Step3Data {
  dailyStudyMinutes: number
  availableTimeSlots: StudyTimeSlot[]
  studyOnWeekends: boolean
}

/**
 * 위저드 Step 4: 시간 배분 데이터
 */
export interface Step4Data {
  subjectAllocations: Record<SubjectId, number>
}

/**
 * 전체 위저드 데이터
 */
export interface PlanWizardData {
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
}

/**
 * 생성된 일정 미리보기 아이템
 */
export interface SchedulePreviewItem {
  date: string
  dayOfWeek: string
  sessions: {
    subject: SubjectId
    subjectName: string
    startTime: string
    endTime: string
    durationMinutes: number
  }[]
  totalMinutes: number
}

/**
 * 위저드 상태
 */
export interface PlanWizardState {
  currentStep: number
  data: PlanWizardData
  isSubmitting: boolean
  isCompleted: boolean
}

/**
 * 과목 목록 (상수)
 */
export const SUBJECTS: { id: SubjectId; name: string }[] = [
  { id: 'korean', name: '국어' },
  { id: 'math', name: '수학' },
  { id: 'english', name: '영어' },
  { id: 'science', name: '과학' },
  { id: 'social', name: '사회' },
  { id: 'other', name: '기타' },
]

/**
 * 목표 타입 목록 (상수)
 */
export const GOAL_TYPES: GoalTypeInfo[] = [
  {
    id: 'midterm',
    label: '중간고사 대비',
    description: '중간고사를 위한 집중 학습 계획',
    icon: 'BookOpen',
  },
  {
    id: 'final',
    label: '기말고사 대비',
    description: '기말고사를 위한 종합 학습 계획',
    icon: 'GraduationCap',
  },
  {
    id: 'sat',
    label: '수능 대비',
    description: '수능 시험을 위한 장기 학습 계획',
    icon: 'Target',
  },
  {
    id: 'regular',
    label: '일반 학습',
    description: '일상적인 학습 루틴 관리',
    icon: 'Calendar',
  },
]

/**
 * 시간대 목록 (상수)
 */
export const TIME_SLOTS: TimeSlotInfo[] = [
  {
    id: 'morning',
    label: '오전',
    description: '6시 - 12시',
    startHour: 6,
    endHour: 12,
  },
  {
    id: 'afternoon',
    label: '오후',
    description: '12시 - 18시',
    startHour: 12,
    endHour: 18,
  },
  {
    id: 'evening',
    label: '저녁',
    description: '18시 - 24시',
    startHour: 18,
    endHour: 24,
  },
]

/**
 * 과목 ID로 이름 찾기
 */
export function getSubjectName(id: SubjectId): string {
  const subject = SUBJECTS.find((s) => s.id === id)
  return subject?.name ?? id
}

/**
 * 목표 타입 ID로 정보 찾기
 */
export function getGoalTypeInfo(id: GoalType): GoalTypeInfo | undefined {
  return GOAL_TYPES.find((g) => g.id === id)
}

/**
 * 초기 위저드 데이터
 */
export const initialPlanWizardData: PlanWizardData = {
  step1: {
    goalType: null,
    targetDate: '',
    title: '',
  },
  step2: {
    selectedSubjects: [],
  },
  step3: {
    dailyStudyMinutes: 180, // 기본값 3시간
    availableTimeSlots: ['afternoon'],
    studyOnWeekends: true,
  },
  step4: {
    subjectAllocations: {} as Record<SubjectId, number>,
  },
}

/**
 * 위저드 단계 정보
 */
export const WIZARD_STEPS = [
  { step: 1, title: '목표', description: '학습 목표 설정' },
  { step: 2, title: '과목', description: '과목 선택' },
  { step: 3, title: '시간', description: '가용 시간 입력' },
  { step: 4, title: '배분', description: '시간 배분 확인' },
  { step: 5, title: '완료', description: '일정 생성' },
]
