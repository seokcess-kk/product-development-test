'use client'

import { Layout, PageContainer } from '@/components/common'
import {
    DailyBarChart,
    MonthlyTrendChart,
    ResponsivePeriodSelector,
    StudySummaryCard,
    SubjectPieChart,
    SubjectRankingList,
} from '@/components/features/stats'
import { useStudyStats } from '@/hooks/useStudyStats'

// Mock user data (will be replaced with actual auth)
const mockUser = {
  id: '1',
  name: '김학생',
  email: 'student@example.com',
  avatarUrl: undefined,
}

export default function StatsPage() {
  const {
    subjectStats,
    dailyStats,
    monthlyStats,
    summary,
    ranking,
    period,
    isLoading,
    setPeriod,
  } = useStudyStats({ period: 'week' })

  // Handle logout (placeholder)
  const handleLogout = () => {
    // TODO: Implement actual logout
  }

  return (
    <Layout user={mockUser} onLogout={handleLogout}>
      <PageContainer
        title="학습 통계"
        description="학습 현황을 자세히 분석해 보세요"
        actions={
          <ResponsivePeriodSelector
            value={period}
            onChange={setPeriod}
          />
        }
      >
        <div className="grid gap-6">
          {/* Summary Cards */}
          <section>
            <StudySummaryCard
              data={summary}
              isLoading={isLoading}
            />
          </section>

          {/* Subject Pie Chart */}
          <section>
            <SubjectPieChart
              data={subjectStats}
              isLoading={isLoading}
            />
          </section>

          {/* Daily Bar Chart */}
          <section>
            <DailyBarChart
              data={dailyStats}
              goalMinutes={180}
              isLoading={isLoading}
            />
          </section>

          {/* Bottom Row: Monthly Trend + Subject Ranking */}
          <section className="grid gap-6 lg:grid-cols-2">
            <MonthlyTrendChart
              data={monthlyStats}
              isLoading={isLoading}
            />
            <SubjectRankingList
              data={ranking}
              isLoading={isLoading}
              showChange={period !== 'today'}
            />
          </section>
        </div>
      </PageContainer>
    </Layout>
  )
}
