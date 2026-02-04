'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getStudyRecords,
  calculateSubjectStats,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateStudySummary,
  calculateSubjectRanking,
  type StudyRecordData,
  type SubjectStats,
  type DailyStats,
  type MonthlyStats,
  type StudySummary,
  type SubjectRanking,
} from '@/lib/mockData/statsData'

export type StatsPeriod = 'today' | 'week' | 'month' | 'all'

interface UseStudyStatsOptions {
  period?: StatsPeriod
  dailyGoalMinutes?: number
  monthlyGoalMinutes?: number
}

interface UseStudyStatsReturn {
  // Data
  records: StudyRecordData[]
  subjectStats: SubjectStats[]
  dailyStats: DailyStats[]
  monthlyStats: MonthlyStats[]
  summary: StudySummary
  ranking: SubjectRanking[]

  // State
  period: StatsPeriod
  isLoading: boolean
  error: Error | null

  // Actions
  setPeriod: (period: StatsPeriod) => void
  refresh: () => void
}

const PERIOD_DAYS: Record<StatsPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
  all: 90,
}

/**
 * 학습 통계 데이터를 관리하는 커스텀 훅
 */
export function useStudyStats(options: UseStudyStatsOptions = {}): UseStudyStatsReturn {
  const {
    period: initialPeriod = 'week',
    dailyGoalMinutes = 180, // 3시간
    monthlyGoalMinutes = 5400, // 90시간
  } = options

  const [period, setPeriod] = useState<StatsPeriod>(initialPeriod)
  const [records, setRecords] = useState<StudyRecordData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // 데이터 불러오기
  const fetchData = useCallback(() => {
    setIsLoading(true)
    setError(null)

    try {
      // Mock 데이터 로딩 시뮬레이션
      setTimeout(() => {
        const data = getStudyRecords(period)
        setRecords(data)
        setIsLoading(false)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다.'))
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 과목별 통계
  const subjectStats = useMemo(() => {
    return calculateSubjectStats(records)
  }, [records])

  // 일별 통계
  const dailyStats = useMemo(() => {
    const days = PERIOD_DAYS[period]
    return calculateDailyStats(records, days, dailyGoalMinutes)
  }, [records, period, dailyGoalMinutes])

  // 월별 통계
  const monthlyStats = useMemo(() => {
    const months = period === 'all' ? 6 : 3
    return calculateMonthlyStats(records, months, monthlyGoalMinutes)
  }, [records, period, monthlyGoalMinutes])

  // 학습 요약
  const summary = useMemo(() => {
    const days = PERIOD_DAYS[period]
    return calculateStudySummary(records, days, dailyGoalMinutes)
  }, [records, period, dailyGoalMinutes])

  // 과목별 랭킹 (이전 기간 대비)
  const ranking = useMemo(() => {
    // 이전 기간 데이터 가져오기
    const previousPeriodMap: Record<StatsPeriod, StatsPeriod> = {
      today: 'today',
      week: 'week',
      month: 'month',
      all: 'month',
    }
    const previousRecords = getStudyRecords(previousPeriodMap[period])
    return calculateSubjectRanking(records, previousRecords)
  }, [records, period])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    records,
    subjectStats,
    dailyStats,
    monthlyStats,
    summary,
    ranking,
    period,
    isLoading,
    error,
    setPeriod,
    refresh,
  }
}

/**
 * 총 학습 시간만 필요한 경우 사용
 */
export function useTotalStudyTime(period: StatsPeriod = 'week') {
  const { summary, isLoading } = useStudyStats({ period })
  return { totalMinutes: summary.totalMinutes, isLoading }
}

/**
 * 과목별 통계만 필요한 경우 사용
 */
export function useSubjectStats(period: StatsPeriod = 'week') {
  const { subjectStats, isLoading } = useStudyStats({ period })
  return { subjectStats, isLoading }
}
