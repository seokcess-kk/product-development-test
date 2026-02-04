import {
  addDays,
  setHours,
  setMinutes,
  startOfWeek,
} from 'date-fns'
import type { CalendarSchedule as Schedule } from '@/types/calendar'
import type { SubjectType } from '@/components/ui/SubjectBadge'

// Helper to create a date with specific time
function createDateTime(baseDate: Date, hour: number, minute: number = 0): Date {
  return setMinutes(setHours(baseDate, hour), minute)
}

// Generate mock schedules for the current week
export function generateMockSchedules(): Schedule[] {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  const schedules: Schedule[] = [
    // Monday
    {
      id: '1',
      title: '미적분 개념 정리',
      subject: 'math' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 0), 9),
      endTime: createDateTime(addDays(weekStart, 0), 10, 30),
      isCompleted: true,
      memo: '교과서 3장 복습 완료',
    },
    {
      id: '2',
      title: '영어 단어 암기',
      subject: 'english' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 0), 14),
      endTime: createDateTime(addDays(weekStart, 0), 15),
      isCompleted: true,
    },
    // Tuesday
    {
      id: '3',
      title: '국어 문학 작품 분석',
      subject: 'korean' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 1), 10),
      endTime: createDateTime(addDays(weekStart, 1), 11, 30),
      isCompleted: true,
    },
    {
      id: '4',
      title: '수학 문제풀이',
      subject: 'math' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 1), 15),
      endTime: createDateTime(addDays(weekStart, 1), 17),
      isCompleted: false,
      memo: '미적분 연습문제 20문항',
    },
    // Wednesday
    {
      id: '5',
      title: '과학 실험 보고서 작성',
      subject: 'science' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 2), 9),
      endTime: createDateTime(addDays(weekStart, 2), 10),
      isCompleted: false,
    },
    {
      id: '6',
      title: '영어 독해 연습',
      subject: 'english' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 2), 14),
      endTime: createDateTime(addDays(weekStart, 2), 15, 30),
      isCompleted: false,
    },
    // Thursday
    {
      id: '7',
      title: '사회 역사 정리',
      subject: 'social' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 3), 11),
      endTime: createDateTime(addDays(weekStart, 3), 12, 30),
      isCompleted: false,
    },
    {
      id: '8',
      title: '국어 문법 복습',
      subject: 'korean' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 3), 16),
      endTime: createDateTime(addDays(weekStart, 3), 17),
      isCompleted: false,
    },
    // Friday
    {
      id: '9',
      title: '수학 모의고사 풀이',
      subject: 'math' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 4), 9),
      endTime: createDateTime(addDays(weekStart, 4), 11),
      isCompleted: false,
      memo: '2024 6월 모의고사',
    },
    {
      id: '10',
      title: '영어 리스닝 연습',
      subject: 'english' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 4), 14),
      endTime: createDateTime(addDays(weekStart, 4), 15),
      isCompleted: false,
    },
    // Saturday
    {
      id: '11',
      title: '과학 개념 정리',
      subject: 'science' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 5), 10),
      endTime: createDateTime(addDays(weekStart, 5), 12),
      isCompleted: false,
    },
    // Sunday
    {
      id: '12',
      title: '주간 복습',
      subject: 'other' as SubjectType,
      startTime: createDateTime(addDays(weekStart, 6), 14),
      endTime: createDateTime(addDays(weekStart, 6), 16),
      isCompleted: false,
      memo: '이번 주 학습 내용 전체 복습',
    },
  ]

  return schedules
}

// Export a singleton instance for easy access
export const mockSchedules = generateMockSchedules()
