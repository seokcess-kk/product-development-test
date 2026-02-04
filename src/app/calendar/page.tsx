'use client'

import * as React from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { Layout, PageContainer } from '@/components/common/Layout'
import {
  CalendarHeader,
  WeekView,
  DayView,
  ScheduleModal,
} from '@/components/features/calendar'
import { mockSchedules } from '@/lib/mockData/calendarData'
import type { CalendarSchedule as Schedule } from '@/types/calendar'

export default function CalendarPage() {
  const {
    currentDate,
    viewMode,
    weekDays,
    weekLabel,
    dayLabel,
    isToday,
    goToNextWeek,
    goToPreviousWeek,
    goToNextDay,
    goToPreviousDay,
    goToToday,
    goToDate,
    setViewMode,
    timeSlots,
  } = useCalendar()

  // Schedules state (using mock data)
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules)

  // Modal state
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Responsive view mode - default to day view on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'week') {
        setViewMode('day')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode, setViewMode])

  // Navigation handlers
  const handlePrevious = () => {
    if (viewMode === 'week') {
      goToPreviousWeek()
    } else {
      goToPreviousDay()
    }
  }

  const handleNext = () => {
    if (viewMode === 'week') {
      goToNextWeek()
    } else {
      goToNextDay()
    }
  }

  // Schedule handlers
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsModalOpen(true)
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCompleted: completed } : s))
    )
    // Also update selected schedule if it's the one being toggled
    if (selectedSchedule?.id === id) {
      setSelectedSchedule((prev) =>
        prev ? { ...prev, isCompleted: completed } : null
      )
    }
  }

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
    setSelectedSchedule(null)
    setIsModalOpen(false)
  }

  const handleEditSchedule = (updatedSchedule: Schedule) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
    )
    setSelectedSchedule(updatedSchedule)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  const handleDayClick = (date: Date) => {
    goToDate(date)
    setViewMode('day')
  }

  const handleAddSchedule = () => {
    // TODO: Implement add schedule functionality
    alert('새 일정 추가 기능은 추후 구현 예정입니다.')
  }

  // Label based on view mode
  const headerLabel = viewMode === 'week' ? weekLabel : dayLabel

  return (
    <Layout
      user={undefined}
      onLogout={() => {}}
      showSidebar={true}
    >
      <PageContainer>
        {/* Calendar Header */}
        <CalendarHeader
          label={headerLabel}
          viewMode={viewMode}
          isToday={isToday}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={goToToday}
          onViewModeChange={setViewMode}
          className="mb-6"
        />

        {/* Calendar View */}
        {viewMode === 'week' ? (
          <WeekView
            weekDays={weekDays}
            schedules={schedules}
            timeSlots={timeSlots}
            onScheduleClick={handleScheduleClick}
            onToggleComplete={handleToggleComplete}
            onDayClick={handleDayClick}
            onAddSchedule={handleAddSchedule}
          />
        ) : (
          <DayView
            date={currentDate}
            schedules={schedules}
            timeSlots={timeSlots}
            onScheduleClick={handleScheduleClick}
            onToggleComplete={handleToggleComplete}
            onAddSchedule={handleAddSchedule}
          />
        )}

        {/* Schedule Detail Modal */}
        <ScheduleModal
          schedule={selectedSchedule}
          open={isModalOpen}
          onClose={handleCloseModal}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteSchedule}
          onEdit={handleEditSchedule}
        />
      </PageContainer>
    </Layout>
  )
}
