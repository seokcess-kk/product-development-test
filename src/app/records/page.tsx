'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/common/Layout'
import {
  RecordList,
  RecordFilters,
  RecordStats,
} from '@/components/features/records'
import { useTimerStore } from '@/stores/timerStore'
import type {
  StudyRecord,
  RecordFilters as RecordFiltersType,
  GroupedRecords,
  RecordStats as RecordStatsType,
} from '@/types/timer'
import type { SubjectType } from '@/components/ui/SubjectBadge'

// 로컬 스토리지 키
const RECORDS_STORAGE_KEY = 'studymate_all_records'

/** 날짜 포맷 (YYYY-MM-DD) */
function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/** 날짜 표시 포맷 */
function getDisplayDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (dateString === getDateString(today)) {
    return '오늘'
  }
  if (dateString === getDateString(yesterday)) {
    return '어제'
  }

  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/** 기간 필터에 따른 시작 날짜 계산 */
function getStartDate(period: RecordFiltersType['period']): Date | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (period) {
    case 'today':
      return today
    case 'week': {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return weekStart
    }
    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return monthStart
    }
    case 'all':
      return null
  }
}

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = React.useState<StudyRecord[]>([])
  const [showFilters, setShowFilters] = React.useState(false)
  const [filters, setFilters] = React.useState<RecordFiltersType>({
    subject: 'all',
    period: 'week',
  })

  // 오늘 기록도 포함
  const todayRecords = useTimerStore((state) => state.todayRecords)

  // 기록 로드
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(RECORDS_STORAGE_KEY)
      if (stored) {
        const allRecords: StudyRecord[] = JSON.parse(stored)
        setRecords(allRecords)
      }
    } catch {
      // 파싱 에러 무시
    }
  }, [])

  // 오늘 기록을 전체 기록에 병합 (중복 제거)
  const allRecords = React.useMemo(() => {
    const recordMap = new Map<string, StudyRecord>()

    // 기존 기록 추가
    records.forEach((r) => recordMap.set(r.id, r))

    // 오늘 기록 추가/업데이트
    todayRecords.forEach((r) => recordMap.set(r.id, r))

    return Array.from(recordMap.values())
  }, [records, todayRecords])

  // 필터링된 기록
  const filteredRecords = React.useMemo(() => {
    let filtered = [...allRecords]

    // 과목 필터
    if (filters.subject !== 'all') {
      filtered = filtered.filter((r) => r.subject === filters.subject)
    }

    // 기간 필터
    const startDate = getStartDate(filters.period)
    if (startDate) {
      filtered = filtered.filter((r) => new Date(r.startTime) >= startDate)
    }

    // 최신순 정렬
    filtered.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )

    return filtered
  }, [allRecords, filters])

  // 그룹화된 기록
  const groupedRecords = React.useMemo((): GroupedRecords[] => {
    const groups = new Map<string, StudyRecord[]>()

    filteredRecords.forEach((record) => {
      const date = getDateString(new Date(record.startTime))
      const existing = groups.get(date) ?? []
      groups.set(date, [...existing, record])
    })

    return Array.from(groups.entries())
      .map(([date, records]) => ({
        date,
        displayDate: getDisplayDate(date),
        records,
        totalSeconds: records.reduce((sum, r) => sum + r.durationSeconds, 0),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [filteredRecords])

  // 통계 계산
  const stats = React.useMemo((): RecordStatsType => {
    const totalSeconds = filteredRecords.reduce(
      (sum, r) => sum + r.durationSeconds,
      0
    )
    const totalSessions = filteredRecords.length

    // 과목별 집계
    const subjectMap = new Map<SubjectType, number>()
    filteredRecords.forEach((r) => {
      const current = subjectMap.get(r.subject) ?? 0
      subjectMap.set(r.subject, current + r.durationSeconds)
    })

    const subjectBreakdown = Array.from(subjectMap.entries())
      .map(([subject, seconds]) => ({
        subject,
        seconds,
        percentage: totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0,
      }))
      .sort((a, b) => b.seconds - a.seconds)

    const averageSessionLength =
      totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 0

    return {
      totalSeconds,
      totalSessions,
      subjectBreakdown,
      averageSessionLength,
    }
  }, [filteredRecords])

  // 기록 삭제
  const handleDelete = (id: string) => {
    // 로컬 상태에서 제거
    const newRecords = records.filter((r) => r.id !== id)
    setRecords(newRecords)

    // 로컬 스토리지 업데이트
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(newRecords))
    }

    // 오늘 기록에서도 제거
    const { todayRecords: currentTodayRecords } = useTimerStore.getState()
    const newTodayRecords = currentTodayRecords.filter((r) => r.id !== id)
    useTimerStore.setState({ todayRecords: newTodayRecords })

    // 오늘 기록 로컬 스토리지도 업데이트
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(
        'studymate_today_records',
        JSON.stringify({
          date: today,
          records: newTodayRecords,
        })
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-9 w-9 p-0"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-lg font-semibold text-gray-900">학습 기록</h1>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'h-9 w-9 p-0',
            showFilters && 'bg-primary-50 text-primary-600'
          )}
          aria-label="필터"
          aria-pressed={showFilters}
        >
          {showFilters ? (
            <X className="h-5 w-5" />
          ) : (
            <Filter className="h-5 w-5" />
          )}
        </Button>
      </header>

      <main className="pb-safe">
        {/* 필터 (토글) */}
        {showFilters && (
          <div className="border-b border-gray-200 bg-white p-4">
            <RecordFilters filters={filters} onChange={setFilters} />
          </div>
        )}

        <PageContainer>
          {/* 통계 */}
          <RecordStats stats={stats} className="mb-6" />

          {/* 기록 목록 */}
          <RecordList groupedRecords={groupedRecords} onDelete={handleDelete} />
        </PageContainer>
      </main>
    </div>
  )
}
