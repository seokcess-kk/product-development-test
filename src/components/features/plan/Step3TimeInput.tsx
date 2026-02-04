'use client'

import { Sun, Sunset, Moon, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlanWizardStore, selectStep3Data } from '@/stores/planWizardStore'
import { TIME_SLOTS, type StudyTimeSlot } from '@/types/plan'
import { formatMinutesToHoursAndMinutes } from '@/lib/planUtils'

// 시간대별 아이콘 매핑
const timeSlotIcons: Record<StudyTimeSlot, React.ComponentType<{ className?: string }>> = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
}

interface TimeSlotCardProps {
  slot: (typeof TIME_SLOTS)[number]
  isSelected: boolean
  onToggle: () => void
  disabled?: boolean
}

function TimeSlotCard({ slot, isSelected, onToggle, disabled }: TimeSlotCardProps) {
  const Icon = timeSlotIcons[slot.id]

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 bg-white hover:border-gray-300',
        disabled && !isSelected && 'cursor-not-allowed opacity-50'
      )}
      aria-pressed={isSelected}
    >
      {/* 체크박스 */}
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

      {/* 아이콘 */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* 정보 */}
      <div className="flex-1 text-left">
        <p className={cn('font-medium', isSelected ? 'text-primary-700' : 'text-gray-900')}>
          {slot.label}
        </p>
        <p className="text-sm text-gray-500">{slot.description}</p>
      </div>
    </button>
  )
}

// 슬라이더 단계값 (30분 단위)
const SLIDER_MIN = 30
const SLIDER_MAX = 720
const SLIDER_STEP = 30

export function Step3TimeInput() {
  const step3Data = usePlanWizardStore(selectStep3Data)
  const { setDailyStudyMinutes, toggleTimeSlot, setStudyOnWeekends } = usePlanWizardStore()

  const selectedSlotsCount = step3Data.availableTimeSlots.length

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyStudyMinutes(parseInt(e.target.value, 10))
  }

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">가용 시간 입력</h2>
        <p className="mt-1 text-sm text-gray-500">
          하루에 얼마나 공부할 수 있나요? 현실적인 목표를 세워보세요.
        </p>
      </div>

      {/* 하루 학습 시간 슬라이더 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="dailyStudyTime" className="text-sm font-medium text-gray-700">
            하루 목표 학습 시간
          </label>
          <span className="text-lg font-semibold text-primary-600">
            {formatMinutesToHoursAndMinutes(step3Data.dailyStudyMinutes)}
          </span>
        </div>

        {/* 슬라이더 */}
        <div className="space-y-2">
          <input
            id="dailyStudyTime"
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={step3Data.dailyStudyMinutes}
            onChange={handleSliderChange}
            className={cn(
              'w-full cursor-pointer appearance-none rounded-lg bg-gray-200 h-2',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-primary-500',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-primary-500',
              '[&::-moz-range-thumb]:border-none',
              '[&::-moz-range-thumb]:cursor-pointer'
            )}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((step3Data.dailyStudyMinutes - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%, #e5e7eb ${((step3Data.dailyStudyMinutes - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>30분</span>
            <span>6시간</span>
            <span>12시간</span>
          </div>
        </div>

        {/* 추천 시간 표시 */}
        <div className="flex flex-wrap gap-2">
          {[60, 120, 180, 240, 360].map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => setDailyStudyMinutes(minutes)}
              className={cn(
                'rounded-full px-3 py-1 text-sm transition-colors',
                step3Data.dailyStudyMinutes === minutes
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {formatMinutesToHoursAndMinutes(minutes)}
            </button>
          ))}
        </div>
      </div>

      {/* 학습 가능 시간대 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">학습 가능 시간대</label>
          <span className="text-xs text-gray-500">최소 1개 이상 선택</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = step3Data.availableTimeSlots.includes(slot.id)
            return (
              <TimeSlotCard
                key={slot.id}
                slot={slot}
                isSelected={isSelected}
                onToggle={() => toggleTimeSlot(slot.id)}
                disabled={selectedSlotsCount <= 1 && isSelected}
              />
            )
          })}
        </div>
      </div>

      {/* 주말 학습 */}
      <div className="rounded-lg border border-gray-200 p-4">
        <label className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">주말에도 학습하기</p>
              <p className="text-sm text-gray-500">토요일, 일요일에도 일정이 생성됩니다.</p>
            </div>
          </div>

          {/* 토글 스위치 */}
          <div className="relative">
            <input
              type="checkbox"
              checked={step3Data.studyOnWeekends}
              onChange={(e) => setStudyOnWeekends(e.target.checked)}
              className="sr-only"
            />
            <div
              className={cn(
                'h-6 w-11 rounded-full transition-colors',
                step3Data.studyOnWeekends ? 'bg-primary-500' : 'bg-gray-300'
              )}
            >
              <div
                className={cn(
                  'h-5 w-5 translate-y-0.5 transform rounded-full bg-white shadow-md transition-transform',
                  step3Data.studyOnWeekends ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </div>
        </label>
      </div>

      {/* 요약 정보 */}
      <div className="rounded-lg bg-primary-50 p-4">
        <h3 className="font-medium text-primary-900">설정 요약</h3>
        <ul className="mt-2 space-y-1 text-sm text-primary-700">
          <li>
            하루 학습 시간: <strong>{formatMinutesToHoursAndMinutes(step3Data.dailyStudyMinutes)}</strong>
          </li>
          <li>
            학습 시간대:{' '}
            <strong>
              {step3Data.availableTimeSlots
                .map((slot) => TIME_SLOTS.find((t) => t.id === slot)?.label)
                .join(', ')}
            </strong>
          </li>
          <li>
            주말 학습: <strong>{step3Data.studyOnWeekends ? '포함' : '미포함'}</strong>
          </li>
        </ul>
      </div>
    </div>
  )
}
