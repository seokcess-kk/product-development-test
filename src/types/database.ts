/**
 * Supabase Database Types
 *
 * StudyMate 프로젝트의 데이터베이스 타입 정의
 * Supabase CLI로 자동 생성된 타입과 호환되는 형식
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * 학교 유형
 */
export type SchoolType = 'middle' | 'high'

/**
 * 학습 목표 유형
 */
export type GoalType = 'midterm' | 'final' | 'sat' | 'regular'

/**
 * 학습 목표 상태
 */
export type GoalStatus = 'active' | 'completed' | 'cancelled'

/**
 * 과목 목표 (study_goals.subjects JSONB 구조)
 */
export interface SubjectGoal {
  name: string
  target_hours: number
}

export interface Database {
  public: {
    Tables: {
      /**
       * 사용자 프로필 테이블
       */
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          grade: number
          school_type: SchoolType
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          grade: number
          school_type: SchoolType
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          grade?: number
          school_type?: SchoolType
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }

      /**
       * 학습 목표/시험 테이블
       */
      study_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          goal_type: GoalType
          start_date: string
          end_date: string
          subjects: SubjectGoal[]
          status: GoalStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          goal_type: GoalType
          start_date: string
          end_date: string
          subjects?: SubjectGoal[]
          status?: GoalStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          goal_type?: GoalType
          start_date?: string
          end_date?: string
          subjects?: SubjectGoal[]
          status?: GoalStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'study_goals_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      /**
       * 일정 테이블
       */
      schedules: {
        Row: {
          id: string
          user_id: string
          goal_id: string | null
          date: string
          start_time: string
          end_time: string
          subject: string
          title: string
          description: string | null
          is_completed: boolean
          actual_duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id?: string | null
          date: string
          start_time: string
          end_time: string
          subject: string
          title: string
          description?: string | null
          is_completed?: boolean
          actual_duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          subject?: string
          title?: string
          description?: string | null
          is_completed?: boolean
          actual_duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'schedules_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'schedules_goal_id_fkey'
            columns: ['goal_id']
            isOneToOne: false
            referencedRelation: 'study_goals'
            referencedColumns: ['id']
          }
        ]
      }

      /**
       * 학습 기록 테이블
       */
      study_records: {
        Row: {
          id: string
          user_id: string
          schedule_id: string | null
          subject: string
          duration_minutes: number
          memo: string | null
          started_at: string
          ended_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id?: string | null
          subject: string
          duration_minutes: number
          memo?: string | null
          started_at: string
          ended_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string | null
          subject?: string
          duration_minutes?: number
          memo?: string | null
          started_at?: string
          ended_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'study_records_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'study_records_schedule_id_fkey'
            columns: ['schedule_id']
            isOneToOne: false
            referencedRelation: 'schedules'
            referencedColumns: ['id']
          }
        ]
      }
    }

    Views: {
      /**
       * 일별 과목별 학습 통계 뷰
       */
      daily_study_stats: {
        Row: {
          user_id: string
          study_date: string
          subject: string
          total_minutes: number
          session_count: number
        }
        Relationships: [
          {
            foreignKeyName: 'study_records_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      /**
       * 사용자별 과목별 전체 학습 통계 뷰
       */
      user_study_summary: {
        Row: {
          user_id: string
          subject: string
          total_minutes: number
          total_sessions: number
          avg_session_minutes: number
          last_study_at: string
        }
        Relationships: [
          {
            foreignKeyName: 'study_records_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      [_ in never]: never
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================================================
// 편의를 위한 타입 별칭
// ============================================================================

/**
 * 프로필 타입
 */
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * 학습 목표 타입
 */
export type StudyGoal = Database['public']['Tables']['study_goals']['Row']
export type StudyGoalInsert = Database['public']['Tables']['study_goals']['Insert']
export type StudyGoalUpdate = Database['public']['Tables']['study_goals']['Update']

/**
 * 일정 타입
 */
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type ScheduleInsert = Database['public']['Tables']['schedules']['Insert']
export type ScheduleUpdate = Database['public']['Tables']['schedules']['Update']

/**
 * 학습 기록 타입
 */
export type StudyRecord = Database['public']['Tables']['study_records']['Row']
export type StudyRecordInsert = Database['public']['Tables']['study_records']['Insert']
export type StudyRecordUpdate = Database['public']['Tables']['study_records']['Update']

/**
 * 일별 학습 통계 타입
 */
export type DailyStudyStats = Database['public']['Views']['daily_study_stats']['Row']

/**
 * 사용자 학습 요약 타입
 */
export type UserStudySummary = Database['public']['Views']['user_study_summary']['Row']

// ============================================================================
// 확장 타입 (관계 포함)
// ============================================================================

/**
 * 학습 목표와 함께 조회된 일정
 */
export type ScheduleWithGoal = Schedule & {
  study_goals: StudyGoal | null
}

/**
 * 일정과 함께 조회된 학습 기록
 */
export type StudyRecordWithSchedule = StudyRecord & {
  schedules: Schedule | null
}

/**
 * 프로필과 함께 조회된 학습 목표
 */
export type StudyGoalWithProfile = StudyGoal & {
  profiles: Profile
}
