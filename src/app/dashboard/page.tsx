'use client'

import { Layout, PageContainer } from '@/components/common'
import {
    QuickActions,
    RecentRecords,
    StudyStreak,
    TodayProgress,
    TodayScheduleList,
    WeeklyStats,
    type ScheduleItem,
    type StudyRecord,
    type WeeklyStatsData,
} from '@/components/features/dashboard'
import { useToast } from '@/components/ui/Toast'
import { useEffect, useState } from 'react'

// Mock data - will be replaced with actual API calls
const mockSchedules: ScheduleItem[] = [
  {
    id: '1',
    time: '09:00',
    title: '미분 적분 문제풀이',
    subject: 'math',
    isCompleted: true,
  },
  {
    id: '2',
    time: '10:30',
    title: '영단어 50개 암기',
    subject: 'english',
    isCompleted: true,
  },
  {
    id: '3',
    time: '14:00',
    title: '비문학 독해 연습',
    subject: 'korean',
    isCompleted: false,
  },
  {
    id: '4',
    time: '16:00',
    title: '물리 운동량 개념정리',
    subject: 'science',
    isCompleted: false,
  },
  {
    id: '5',
    time: '19:00',
    title: '한국사 근현대사 정리',
    subject: 'social',
    isCompleted: false,
  },
]

const mockWeeklyStats: WeeklyStatsData[] = [
  { day: '월', minutes: 120 },
  { day: '화', minutes: 90 },
  { day: '수', minutes: 150 },
  { day: '목', minutes: 60 },
  { day: '금', minutes: 180 },
  { day: '토', minutes: 200 },
  { day: '일', minutes: 45, isToday: true },
]

const mockRecords: StudyRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    subject: 'math',
    title: '수학 모의고사 풀이',
    minutes: 90,
  },
  {
    id: '2',
    date: '2024-01-14',
    subject: 'english',
    title: '영어 듣기 연습',
    minutes: 45,
  },
  {
    id: '3',
    date: '2024-01-14',
    subject: 'korean',
    title: '문학 작품 분석',
    minutes: 60,
  },
  {
    id: '4',
    date: '2024-01-13',
    subject: 'science',
    title: '화학 반응식 정리',
    minutes: 75,
  },
  {
    id: '5',
    date: '2024-01-12',
    subject: 'social',
    title: '세계사 연표 암기',
    minutes: 50,
  },
]

// Mock user data
const mockUser = {
  id: '1',
  name: '김학생',
  email: 'student@example.com',
  avatarUrl: undefined,
}

export default function DashboardPage() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsData[]>([])
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [streakDays, setStreakDays] = useState(0)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setSchedules(mockSchedules)
      setWeeklyStats(mockWeeklyStats)
      setRecords(mockRecords)
      setStreakDays(7)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Calculate today's progress
  const completedCount = schedules.filter((s) => s.isCompleted).length
  const totalCount = schedules.length

  // Handle schedule toggle
  const handleToggleComplete = (id: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isCompleted: !schedule.isCompleted }
          : schedule
      )
    )
  }

  // Handle timer start (placeholder)
  const handleStartTimer = () => {
    // TODO: Open timer modal or navigate to timer page
    toast.info('타이머 기능은 준비 중입니다.')
  }

  // Handle logout (placeholder)
  const handleLogout = () => {
    // TODO: Implement actual logout
  }

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <PageContainer
        title="대시보드"
        description="오늘의 학습 현황을 확인하세요"
      >
        <div className="grid gap-6">
          {/* Top Row: Today's Progress + Weekly Stats */}
          <div className="grid gap-6 md:grid-cols-2">
            <TodayProgress
              completed={completedCount}
              total={totalCount}
              isLoading={isLoading}
            />
            <WeeklyStats data={weeklyStats} isLoading={isLoading} />
          </div>

          {/* Middle Row: Today's Schedule */}
          <TodayScheduleList
            schedules={schedules}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
          />

          {/* Bottom Row: Quick Actions + Study Streak */}
          <div className="grid gap-6 md:grid-cols-2">
            <QuickActions onStartTimer={handleStartTimer} />
            <StudyStreak streakDays={streakDays} isLoading={isLoading} />
          </div>

          {/* Recent Records */}
          <RecentRecords records={records} isLoading={isLoading} />
        </div>
      </PageContainer>
    </Layout>
  )
}
