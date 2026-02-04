'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import {
  usePlanWizardStore,
  selectStep2Data,
  selectStep3Data,
  selectStep4Data,
} from '@/stores/planWizardStore'
import { SUBJECTS, getSubjectName, type SubjectId } from '@/types/plan'
import { formatMinutesToHoursAndMinutes, calculatePercentage } from '@/lib/planUtils'

// 과목별 색상
const subjectBarColors: Record<SubjectId, string> = {
  korean: 'bg-danger-500',
  math: 'bg-primary-500',
  english: 'bg-violet-500',
  science: 'bg-success-500',
  social: 'bg-warning-500',
  other: 'bg-gray-500',
}

interface AllocationSliderProps {
  subject: SubjectId
  minutes: number
  totalMinutes: number
  onChangeMinutes: (minutes: number) => void
}

function AllocationSlider({
  subject,
  minutes,
  totalMinutes,
  onChangeMinutes,
}: AllocationSliderProps) {
  const percentage = calculatePercentage(minutes, totalMinutes)
  const barColor = subjectBarColors[subject]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeMinutes(parseInt(e.target.value, 10))
  }

  return (
    <div className="space-y-2">
      {/* 과목 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', barColor)} />
          <span className="font-medium text-gray-900">{getSubjectName(subject)}</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-gray-900">
            {formatMinutesToHoursAndMinutes(minutes)}
          </span>
          <span className="ml-2 text-sm text-gray-500">({percentage}%)</span>
        </div>
      </div>

      {/* 슬라이더 */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={totalMinutes}
          step={5}
          value={minutes}
          onChange={handleSliderChange}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-primary-500',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary-500',
            '[&::-moz-range-thumb]:border-none',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
          style={{
            background: `linear-gradient(to right, ${subject === 'korean' ? '#ef4444' : subject === 'math' ? '#3b82f6' : subject === 'english' ? '#8b5cf6' : subject === 'science' ? '#22c55e' : subject === 'social' ? '#eab308' : '#6b7280'} 0%, ${subject === 'korean' ? '#ef4444' : subject === 'math' ? '#3b82f6' : subject === 'english' ? '#8b5cf6' : subject === 'science' ? '#22c55e' : subject === 'social' ? '#eab308' : '#6b7280'} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
          aria-label={`${getSubjectName(subject)} 학습 시간`}
        />
      </div>
    </div>
  )
}

export function Step4TimeAllocation() {
  const step2Data = usePlanWizardStore(selectStep2Data)
  const step3Data = usePlanWizardStore(selectStep3Data)
  const step4Data = usePlanWizardStore(selectStep4Data)
  const { setSubjectAllocation, autoDistributeTime } = usePlanWizardStore()

  const { selectedSubjects } = step2Data
  const { dailyStudyMinutes } = step3Data
  const { subjectAllocations } = step4Data

  // 총 배분된 시간 계산
  const totalAllocated = useMemo(() => {
    return Object.values(subjectAllocations).reduce((sum, val) => sum + val, 0)
  }, [subjectAllocations])

  // 남은 시간
  const remainingMinutes = dailyStudyMinutes - totalAllocated
  const isOverAllocated = remainingMinutes < 0

  // 차트 데이터
  const chartData = useMemo(() => {
    return selectedSubjects.map((subject) => ({
      subject,
      name: getSubjectName(subject),
      minutes: subjectAllocations[subject] || 0,
      percentage: calculatePercentage(subjectAllocations[subject] || 0, dailyStudyMinutes),
      color: subjectBarColors[subject],
    }))
  }, [selectedSubjects, subjectAllocations, dailyStudyMinutes])

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">시간 배분 확인</h2>
        <p className="mt-1 text-sm text-gray-500">
          각 과목별 학습 시간을 조정하세요. 슬라이더를 드래그하여 변경할 수 있습니다.
        </p>
      </div>

      {/* 총 시간 표시 */}
      <div
        className={cn(
          'rounded-lg p-4',
          isOverAllocated ? 'bg-danger-50' : 'bg-gray-50'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">배분된 시간 / 목표 시간</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatMinutesToHoursAndMinutes(totalAllocated)} /{' '}
              {formatMinutesToHoursAndMinutes(dailyStudyMinutes)}
            </p>
          </div>
          <div className="text-right">
            {remainingMinutes !== 0 && (
              <Badge variant={isOverAllocated ? 'danger' : 'warning'}>
                {isOverAllocated
                  ? `${formatMinutesToHoursAndMinutes(Math.abs(remainingMinutes))} 초과`
                  : `${formatMinutesToHoursAndMinutes(remainingMinutes)} 남음`}
              </Badge>
            )}
            {remainingMinutes === 0 && <Badge variant="success">완벽!</Badge>}
          </div>
        </div>

        {/* 균등 배분 버튼 */}
        <button
          type="button"
          onClick={autoDistributeTime}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700 hover:underline"
        >
          균등하게 다시 배분하기
        </button>
      </div>

      {/* 시각화 차트 (막대 그래프) */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">시간 배분 비율</p>
        <div className="flex h-8 w-full overflow-hidden rounded-lg bg-gray-200">
          {chartData.map((item, index) => {
            if (item.percentage <= 0) return null
            return (
              <div
                key={item.subject}
                className={cn('relative h-full transition-all duration-300', item.color)}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                title={`${item.name}: ${item.percentage}%`}
              >
                {item.percentage >= 10 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {item.name}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* 범례 */}
        <div className="flex flex-wrap gap-3">
          {chartData.map((item) => (
            <div key={item.subject} className="flex items-center gap-1.5">
              <div className={cn('h-3 w-3 rounded-full', item.color)} />
              <span className="text-xs text-gray-600">
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 과목별 슬라이더 */}
      <div className="space-y-6">
        <p className="text-sm font-medium text-gray-700">과목별 시간 조정</p>
        <div className="space-y-5">
          {selectedSubjects.map((subject) => (
            <AllocationSlider
              key={subject}
              subject={subject}
              minutes={subjectAllocations[subject] || 0}
              totalMinutes={dailyStudyMinutes}
              onChangeMinutes={(minutes) => setSubjectAllocation(subject, minutes)}
            />
          ))}
        </div>
      </div>

      {/* 경고 메시지 */}
      {isOverAllocated && (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
          <p className="text-sm text-danger-700">
            배분된 시간이 하루 목표 시간을 초과했습니다. 시간을 조정해주세요.
          </p>
        </div>
      )}
    </div>
  )
}
