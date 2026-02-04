import { Metadata } from 'next'
import { PlanWizard } from '@/components/features/plan'

export const metadata: Metadata = {
  title: '학습 계획 만들기 | StudyMate',
  description: '나만의 맞춤 학습 계획을 만들어보세요. 목표, 과목, 시간을 설정하면 자동으로 일정이 생성됩니다.',
}

export default function NewPlanPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PlanWizard />
    </main>
  )
}
