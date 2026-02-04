'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Calendar, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import {
  usePlanWizardStore,
  selectStep1Data,
  selectStep2Data,
  selectStep3Data,
  selectStep4Data,
  selectIsSubmitting,
  selectIsCompleted,
} from '@/stores/planWizardStore'
import { getSubjectName, GOAL_TYPES, TIME_SLOTS, type SubjectId } from '@/types/plan'
import {
  generateWeeklyPreview,
  formatMinutesToHoursAndMinutes,
  clearPlanWizardDraft,
} from '@/lib/planUtils'
import { formatDate } from '@/lib/utils'

// 과목별 배경색
const subjectBgColors: Record<SubjectId, string> = {
  korean: 'bg-danger-100 text-danger-700',
  math: 'bg-primary-100 text-primary-700',
  english: 'bg-violet-100 text-violet-700',
  science: 'bg-success-100 text-success-700',
  social: 'bg-warning-100 text-warning-700',
  other: 'bg-gray-100 text-gray-700',
}

export function Step5Complete() {
  const router = useRouter()
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)

  const step1Data = usePlanWizardStore(selectStep1Data)
  const step2Data = usePlanWizardStore(selectStep2Data)
  const step3Data = usePlanWizardStore(selectStep3Data)
  const step4Data = usePlanWizardStore(selectStep4Data)
  const isSubmitting = usePlanWizardStore(selectIsSubmitting)
  const isCompleted = usePlanWizardStore(selectIsCompleted)
  const { setIsSubmitting, setIsCompleted, resetWizard } = usePlanWizardStore()

  // 미리보기 데이터 생성
  const previewData = useMemo(() => {
    return generateWeeklyPreview({
      step1: step1Data,
      step2: step2Data,
      step3: step3Data,
      step4: step4Data,
    })
  }, [step1Data, step2Data, step3Data, step4Data])

  // 목표 타입 라벨
  const goalTypeLabel = GOAL_TYPES.find((g) => g.id === step1Data.goalType)?.label || ''

  // 계획 생성 핸들러
  const handleCreatePlan = async () => {
    setIsSubmitting(true)

    try {
      // TODO: 실제 API 호출로 대체
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 성공 처리
      clearPlanWizardDraft()
      setIsCompleted(true)
    } catch (error) {
      console.error('Failed to create plan:', error)
      // TODO: 에러 처리
    } finally {
      setIsSubmitting(false)
    }
  }

  // 대시보드로 이동
  const handleGoToDashboard = () => {
    resetWizard()
    router.push('/dashboard')
  }

  // 완료 화면
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-12 w-12 text-success-500" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">학습 계획이 생성되었습니다!</h2>
          <p className="mt-2 text-gray-500">
            설정한 목표에 맞춰 학습 일정이 자동으로 생성되었습니다.
          </p>
        </div>

        <div className="rounded-lg bg-primary-50 px-6 py-4 text-center">
          <p className="text-sm text-primary-600">"{step1Data.title}"</p>
          <p className="mt-1 text-lg font-semibold text-primary-900">
            {step1Data.targetDate && formatDate(step1Data.targetDate)}까지 화이팅!
          </p>
        </div>

        <Button size="lg" onClick={handleGoToDashboard}>
          대시보드로 이동
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">일정 생성 확인</h2>
        <p className="mt-1 text-sm text-gray-500">
          설정한 내용을 확인하고 학습 계획을 생성하세요.
        </p>
      </div>

      {/* 요약 정보 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 목표 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">목표</span>
          </div>
          <p className="mt-1 font-semibold text-gray-900">{step1Data.title}</p>
          <Badge variant="secondary" className="mt-2">
            {goalTypeLabel}
          </Badge>
        </div>

        {/* 목표 날짜 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">목표 날짜</span>
          </div>
          <p className="mt-1 font-semibold text-gray-900">
            {step1Data.targetDate && formatDate(step1Data.targetDate)}
          </p>
        </div>

        {/* 선택한 과목 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">과목</span>
          </div>
          <p className="mt-1 font-semibold text-gray-900">
            {step2Data.selectedSubjects.length}개 과목
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {step2Data.selectedSubjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant={subject} className="text-xs">
                {getSubjectName(subject)}
              </Badge>
            ))}
            {step2Data.selectedSubjects.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{step2Data.selectedSubjects.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* 하루 학습 시간 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">하루 학습</span>
          </div>
          <p className="mt-1 font-semibold text-gray-900">
            {formatMinutesToHoursAndMinutes(step3Data.dailyStudyMinutes)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {TIME_SLOTS.filter((s) => step3Data.availableTimeSlots.includes(s.id))
              .map((s) => s.label)
              .join(', ')}
          </p>
        </div>
      </div>

      {/* 주간 일정 미리보기 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">주간 일정 미리보기</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentWeekOffset((prev) => Math.max(0, prev - 1))}
              disabled={currentWeekOffset === 0}
              className="rounded-lg p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">이번 주</span>
            <button
              type="button"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 일정 그리드 */}
        <div className="overflow-x-auto">
          <div className="grid min-w-[700px] grid-cols-7 gap-2">
            {previewData.map((day, index) => (
              <div
                key={day.date}
                className={cn(
                  'rounded-lg border p-3',
                  day.sessions.length > 0
                    ? 'border-gray-200 bg-white'
                    : 'border-dashed border-gray-200 bg-gray-50'
                )}
              >
                {/* 날짜 헤더 */}
                <div className="mb-2 text-center">
                  <p className="text-xs text-gray-500">{day.dayOfWeek}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {day.date.split('-')[2]}일
                  </p>
                </div>

                {/* 세션 목록 */}
                {day.sessions.length > 0 ? (
                  <div className="space-y-1.5">
                    {day.sessions.slice(0, 3).map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className={cn(
                          'rounded px-2 py-1 text-xs',
                          subjectBgColors[session.subject]
                        )}
                      >
                        <p className="font-medium">{session.subjectName}</p>
                        <p className="opacity-70">
                          {formatMinutesToHoursAndMinutes(session.durationMinutes)}
                        </p>
                      </div>
                    ))}
                    {day.sessions.length > 3 && (
                      <p className="text-center text-xs text-gray-500">
                        +{day.sessions.length - 3}개
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-400">휴식</p>
                )}

                {/* 총 시간 */}
                {day.totalMinutes > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-2 text-center">
                    <p className="text-xs font-medium text-primary-600">
                      {formatMinutesToHoursAndMinutes(day.totalMinutes)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 과목별 시간 배분 */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">과목별 시간 배분</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {step2Data.selectedSubjects.map((subject) => {
            const minutes = step4Data.subjectAllocations[subject] || 0
            return (
              <div
                key={subject}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <span className="text-sm text-gray-700">{getSubjectName(subject)}</span>
                <Badge variant={subject}>{formatMinutesToHoursAndMinutes(minutes)}</Badge>
              </div>
            )
          })}
        </div>
      </div>

      {/* 계획 생성 버튼 */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <Button
          size="lg"
          onClick={handleCreatePlan}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? '계획 생성 중...' : '학습 계획 생성하기'}
        </Button>
        <p className="text-xs text-gray-500">
          생성된 일정은 대시보드에서 언제든 수정할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
