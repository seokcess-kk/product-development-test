import { subDays, subMonths, format, startOfDay, endOfDay } from 'date-fns'
import type { SubjectType } from '@/components/ui/SubjectBadge'

/**
 * 과목별 색상 정의 (차트용)
 */
export const SUBJECT_COLORS: Record<SubjectType, string> = {
  math: '#3b82f6',      // primary blue
  english: '#8b5cf6',   // violet
  korean: '#22c55e',    // green
  science: '#f59e0b',   // amber
  social: '#ec4899',    // pink
  other: '#6b7280',     // gray
}

export const SUBJECT_LABELS: Record<SubjectType, string> = {
  math: '수학',
  english: '영어',
  korean: '국어',
  science: '과학',
  social: '사회',
  other: '기타',
}

/**
 * 학습 기록 타입
 */
export interface StudyRecordData {
  id: string
  subject: SubjectType
  minutes: number
  date: Date
  title: string
}

/**
 * 과목별 통계 타입
 */
export interface SubjectStats {
  subject: SubjectType
  label: string
  minutes: number
  percentage: number
  color: string
  sessions: number
}

/**
 * 일별 통계 타입
 */
export interface DailyStats {
  date: Date
  dateLabel: string
  dayLabel: string
  totalMinutes: number
  goalMinutes: number
  subjects: {
    subject: SubjectType
    minutes: number
  }[]
}

/**
 * 월별 통계 타입
 */
export interface MonthlyStats {
  month: Date
  monthLabel: string
  totalMinutes: number
  goalMinutes: number
  achievementRate: number
}

/**
 * 학습 요약 타입
 */
export interface StudySummary {
  totalMinutes: number
  totalSessions: number
  averageDailyMinutes: number
  mostStudiedSubject: SubjectType | null
  goalAchievementRate: number
  studyDays: number
  totalDays: number
}

/**
 * 과목별 랭킹 타입
 */
export interface SubjectRanking {
  rank: number
  subject: SubjectType
  label: string
  minutes: number
  percentage: number
  color: string
  previousMinutes: number
  change: number // 증감 (분)
  changePercent: number // 증감률 (%)
}

/**
 * Mock 학습 기록 생성
 */
function generateMockRecords(days: number): StudyRecordData[] {
  const records: StudyRecordData[] = []
  const subjects: SubjectType[] = ['math', 'english', 'korean', 'science', 'social']
  const titles: Record<SubjectType, string[]> = {
    math: ['미적분 문제풀이', '확률과 통계', '기하 개념정리', '수학 모의고사'],
    english: ['영단어 암기', '영어 독해', '영어 듣기', '영문법 정리'],
    korean: ['비문학 독해', '문학 작품 분석', '화법과 작문', '국어 문법'],
    science: ['물리 개념정리', '화학 반응식', '생물 실험', '지구과학 정리'],
    social: ['한국사 정리', '세계사 연표', '경제 개념', '정치와 법'],
    other: ['복습', '정리', '예습'],
  }

  let id = 1
  const today = new Date()

  for (let d = 0; d < days; d++) {
    const date = subDays(today, d)
    // 하루에 1~4개의 학습 기록
    const recordCount = Math.floor(Math.random() * 4) + 1

    // 주말에는 더 많이 공부
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const multiplier = isWeekend ? 1.5 : 1

    for (let r = 0; r < recordCount; r++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)]
      const titleOptions = titles[subject]
      const title = titleOptions[Math.floor(Math.random() * titleOptions.length)]
      // 30분~120분 사이 (15분 단위)
      const minutes = (Math.floor(Math.random() * 7) + 2) * 15 * multiplier

      records.push({
        id: String(id++),
        subject,
        minutes: Math.round(minutes),
        date,
        title,
      })
    }
  }

  return records
}

// 30일치 Mock 데이터
const mockRecords = generateMockRecords(90)

/**
 * 기간별 학습 기록 필터링
 */
export function getStudyRecords(
  period: 'today' | 'week' | 'month' | 'all',
  customRange?: { start: Date; end: Date }
): StudyRecordData[] {
  const today = new Date()
  let start: Date
  let end: Date = endOfDay(today)

  switch (period) {
    case 'today':
      start = startOfDay(today)
      break
    case 'week':
      start = startOfDay(subDays(today, 6))
      break
    case 'month':
      start = startOfDay(subDays(today, 29))
      break
    case 'all':
      start = startOfDay(subDays(today, 89))
      break
    default:
      if (customRange) {
        start = customRange.start
        end = customRange.end
      } else {
        start = startOfDay(subDays(today, 29))
      }
  }

  return mockRecords.filter((record) => {
    const recordDate = new Date(record.date)
    return recordDate >= start && recordDate <= end
  })
}

/**
 * 과목별 통계 계산
 */
export function calculateSubjectStats(records: StudyRecordData[]): SubjectStats[] {
  const subjectMap = new Map<SubjectType, { minutes: number; sessions: number }>()
  const allSubjects: SubjectType[] = ['math', 'english', 'korean', 'science', 'social', 'other']

  // 모든 과목 초기화
  allSubjects.forEach((subject) => {
    subjectMap.set(subject, { minutes: 0, sessions: 0 })
  })

  // 데이터 집계
  records.forEach((record) => {
    const current = subjectMap.get(record.subject) || { minutes: 0, sessions: 0 }
    subjectMap.set(record.subject, {
      minutes: current.minutes + record.minutes,
      sessions: current.sessions + 1,
    })
  })

  const totalMinutes = records.reduce((sum, r) => sum + r.minutes, 0)

  // 정렬 및 변환
  const stats = Array.from(subjectMap.entries())
    .map(([subject, data]) => ({
      subject,
      label: SUBJECT_LABELS[subject],
      minutes: data.minutes,
      percentage: totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0,
      color: SUBJECT_COLORS[subject],
      sessions: data.sessions,
    }))
    .filter((stat) => stat.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  return stats
}

/**
 * 일별 통계 계산
 */
export function calculateDailyStats(
  records: StudyRecordData[],
  days: number,
  dailyGoalMinutes: number = 180
): DailyStats[] {
  const today = new Date()
  const dailyMap = new Map<string, DailyStats>()

  // 지정된 일수만큼 초기화
  for (let d = days - 1; d >= 0; d--) {
    const date = subDays(today, d)
    const key = format(date, 'yyyy-MM-dd')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']

    dailyMap.set(key, {
      date,
      dateLabel: format(date, 'M/d'),
      dayLabel: dayNames[date.getDay()],
      totalMinutes: 0,
      goalMinutes: dailyGoalMinutes,
      subjects: [],
    })
  }

  // 데이터 집계
  records.forEach((record) => {
    const key = format(record.date, 'yyyy-MM-dd')
    const daily = dailyMap.get(key)
    if (daily) {
      daily.totalMinutes += record.minutes

      const subjectIndex = daily.subjects.findIndex((s) => s.subject === record.subject)
      if (subjectIndex >= 0) {
        daily.subjects[subjectIndex].minutes += record.minutes
      } else {
        daily.subjects.push({ subject: record.subject, minutes: record.minutes })
      }
    }
  })

  return Array.from(dailyMap.values())
}

/**
 * 월별 통계 계산
 */
export function calculateMonthlyStats(
  records: StudyRecordData[],
  months: number,
  monthlyGoalMinutes: number = 5400 // 90시간
): MonthlyStats[] {
  const today = new Date()
  const monthlyMap = new Map<string, MonthlyStats>()

  // 지정된 월수만큼 초기화
  for (let m = months - 1; m >= 0; m--) {
    const date = subMonths(today, m)
    const key = format(date, 'yyyy-MM')

    monthlyMap.set(key, {
      month: date,
      monthLabel: format(date, 'M월'),
      totalMinutes: 0,
      goalMinutes: monthlyGoalMinutes,
      achievementRate: 0,
    })
  }

  // 데이터 집계
  records.forEach((record) => {
    const key = format(record.date, 'yyyy-MM')
    const monthly = monthlyMap.get(key)
    if (monthly) {
      monthly.totalMinutes += record.minutes
    }
  })

  // 달성률 계산
  monthlyMap.forEach((monthly) => {
    monthly.achievementRate = Math.min(
      Math.round((monthly.totalMinutes / monthly.goalMinutes) * 100),
      100
    )
  })

  return Array.from(monthlyMap.values())
}

/**
 * 학습 요약 계산
 */
export function calculateStudySummary(
  records: StudyRecordData[],
  totalDays: number,
  dailyGoalMinutes: number = 180
): StudySummary {
  if (records.length === 0) {
    return {
      totalMinutes: 0,
      totalSessions: 0,
      averageDailyMinutes: 0,
      mostStudiedSubject: null,
      goalAchievementRate: 0,
      studyDays: 0,
      totalDays,
    }
  }

  const totalMinutes = records.reduce((sum, r) => sum + r.minutes, 0)
  const totalSessions = records.length

  // 실제 공부한 날짜 계산
  const uniqueDates = new Set(records.map((r) => format(r.date, 'yyyy-MM-dd')))
  const studyDays = uniqueDates.size

  // 평균 일일 학습 시간 (공부한 날 기준)
  const averageDailyMinutes = studyDays > 0 ? Math.round(totalMinutes / studyDays) : 0

  // 가장 많이 공부한 과목
  const subjectStats = calculateSubjectStats(records)
  const mostStudiedSubject = subjectStats.length > 0 ? subjectStats[0].subject : null

  // 목표 달성률 (전체 기간 대비)
  const totalGoalMinutes = totalDays * dailyGoalMinutes
  const goalAchievementRate = totalGoalMinutes > 0
    ? Math.min(Math.round((totalMinutes / totalGoalMinutes) * 100), 100)
    : 0

  return {
    totalMinutes,
    totalSessions,
    averageDailyMinutes,
    mostStudiedSubject,
    goalAchievementRate,
    studyDays,
    totalDays,
  }
}

/**
 * 과목별 랭킹 계산 (이전 기간 대비)
 */
export function calculateSubjectRanking(
  currentRecords: StudyRecordData[],
  previousRecords: StudyRecordData[]
): SubjectRanking[] {
  const currentStats = calculateSubjectStats(currentRecords)
  const previousStats = calculateSubjectStats(previousRecords)
  const previousMap = new Map(previousStats.map((s) => [s.subject, s]))

  return currentStats.map((stat, index) => {
    const previous = previousMap.get(stat.subject)
    const previousMinutes = previous?.minutes || 0
    const change = stat.minutes - previousMinutes
    const changePercent = previousMinutes > 0
      ? Math.round((change / previousMinutes) * 100)
      : stat.minutes > 0 ? 100 : 0

    return {
      rank: index + 1,
      ...stat,
      previousMinutes,
      change,
      changePercent,
    }
  })
}

// Export mock data for direct access if needed
export { mockRecords }
