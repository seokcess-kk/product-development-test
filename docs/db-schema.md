# StudyMate Database Schema

## Overview

StudyMate 프로젝트의 데이터베이스 스키마 문서입니다.
Supabase (PostgreSQL)를 사용합니다.

## Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│─────────────────│
│ id (PK)         │
│ email           │
│ ...             │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
│─────────────────│
│ id (PK, FK)     │───────────────────────────────────┐
│ email           │                                    │
│ name            │                                    │
│ grade           │                                    │
│ school_type     │                                    │
└─────────────────┘                                    │
         │                                             │
         │ 1:N                                         │
         ▼                                             │
┌─────────────────┐                                    │
│  study_goals    │                                    │
│─────────────────│                                    │
│ id (PK)         │────────────────┐                   │
│ user_id (FK)    │◄───────────────┼───────────────────┤
│ title           │                │                   │
│ goal_type       │                │                   │
│ start_date      │                │                   │
│ end_date        │                │                   │
│ subjects (JSONB)│                │                   │
│ status          │                │                   │
└─────────────────┘                │                   │
                                   │                   │
         ┌─────────────────────────┘                   │
         │ 0/1:N                                       │
         ▼                                             │
┌─────────────────┐                                    │
│   schedules     │                                    │
│─────────────────│                                    │
│ id (PK)         │────────────────┐                   │
│ user_id (FK)    │◄───────────────┼───────────────────┤
│ goal_id (FK)    │                │                   │
│ date            │                │                   │
│ start_time      │                │                   │
│ end_time        │                │                   │
│ subject         │                │                   │
│ title           │                │                   │
│ is_completed    │                │                   │
└─────────────────┘                │                   │
                                   │                   │
         ┌─────────────────────────┘                   │
         │ 0/1:N                                       │
         ▼                                             │
┌─────────────────┐                                    │
│ study_records   │                                    │
│─────────────────│                                    │
│ id (PK)         │                                    │
│ user_id (FK)    │◄───────────────────────────────────┘
│ schedule_id (FK)│
│ subject         │
│ duration_minutes│
│ memo            │
│ started_at      │
│ ended_at        │
└─────────────────┘
```

---

## Tables

### profiles

사용자 프로필 정보. Supabase Auth의 `auth.users`와 1:1 연결.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users.id | 사용자 ID |
| email | varchar(255) | NOT NULL | 이메일 |
| name | varchar(100) | NOT NULL | 이름 |
| grade | smallint | NOT NULL, CHECK (1-3) | 학년 |
| school_type | varchar(20) | NOT NULL, CHECK | 학교 유형 (middle/high) |
| created_at | timestamptz | DEFAULT now() | 생성일 |
| updated_at | timestamptz | DEFAULT now() | 수정일 |

**Indexes**
- `idx_profiles_email` on (email)
- `idx_profiles_school_type_grade` on (school_type, grade)

**RLS Policies**
- `Users can view own profile` - SELECT: auth.uid() = id
- `Users can create own profile` - INSERT: auth.uid() = id
- `Users can update own profile` - UPDATE: auth.uid() = id

**Triggers**
- `on_auth_user_created` - 신규 사용자 가입 시 프로필 자동 생성
- `profiles_updated_at` - 수정 시 updated_at 자동 갱신

---

### study_goals

학습 목표/시험 정보.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | 목표 ID |
| user_id | uuid | FK → profiles.id, NOT NULL | 사용자 ID |
| title | varchar(200) | NOT NULL | 목표 제목 |
| goal_type | varchar(20) | NOT NULL, CHECK | 목표 유형 |
| start_date | date | NOT NULL | 시작일 |
| end_date | date | NOT NULL | 종료일 (시험일) |
| subjects | jsonb | DEFAULT '[]' | 과목 목록과 목표 시간 |
| status | varchar(20) | DEFAULT 'active', CHECK | 상태 |
| created_at | timestamptz | DEFAULT now() | 생성일 |
| updated_at | timestamptz | DEFAULT now() | 수정일 |

**goal_type 값**
- `midterm` - 중간고사
- `final` - 기말고사
- `sat` - 수능
- `regular` - 일반 학습 목표

**status 값**
- `active` - 진행 중
- `completed` - 완료
- `cancelled` - 취소

**subjects JSONB 구조**
```json
[
  { "name": "수학", "target_hours": 20 },
  { "name": "영어", "target_hours": 15 },
  { "name": "국어", "target_hours": 10 }
]
```

**Indexes**
- `idx_study_goals_user_id` on (user_id)
- `idx_study_goals_user_status` on (user_id, status)
- `idx_study_goals_date_range` on (start_date, end_date)
- `idx_study_goals_user_active` on (user_id) WHERE status = 'active'

**Constraints**
- `check_date_range` - end_date >= start_date

**RLS Policies**
- 모든 CRUD 작업: auth.uid() = user_id

---

### schedules

학습 일정.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | 일정 ID |
| user_id | uuid | FK → profiles.id, NOT NULL | 사용자 ID |
| goal_id | uuid | FK → study_goals.id, NULLABLE | 연결된 목표 ID |
| date | date | NOT NULL | 일정 날짜 |
| start_time | time | NOT NULL | 시작 시간 |
| end_time | time | NOT NULL | 종료 시간 |
| subject | varchar(50) | NOT NULL | 과목명 |
| title | varchar(200) | NOT NULL | 일정 제목 |
| description | text | NULLABLE | 상세 설명 |
| is_completed | boolean | DEFAULT false | 완료 여부 |
| actual_duration_minutes | integer | NULLABLE, CHECK >= 0 | 실제 학습 시간 (분) |
| created_at | timestamptz | DEFAULT now() | 생성일 |
| updated_at | timestamptz | DEFAULT now() | 수정일 |

**Indexes**
- `idx_schedules_user_id` on (user_id)
- `idx_schedules_user_date` on (user_id, date)
- `idx_schedules_goal_id` on (goal_id) WHERE goal_id IS NOT NULL
- `idx_schedules_user_subject` on (user_id, subject)
- `idx_schedules_user_date_range` on (user_id, date DESC)
- `idx_schedules_incomplete` on (user_id, date) WHERE is_completed = false

**Constraints**
- `check_time_range` - end_time > start_time

**RLS Policies**
- 모든 CRUD 작업: auth.uid() = user_id

---

### study_records

학습 기록 (타이머/스톱워치로 기록된 실제 학습 시간).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | 기록 ID |
| user_id | uuid | FK → profiles.id, NOT NULL | 사용자 ID |
| schedule_id | uuid | FK → schedules.id, NULLABLE | 연결된 일정 ID |
| subject | varchar(50) | NOT NULL | 과목명 |
| duration_minutes | integer | NOT NULL, CHECK > 0 | 학습 시간 (분) |
| memo | text | NULLABLE | 메모 |
| started_at | timestamptz | NOT NULL | 학습 시작 시간 |
| ended_at | timestamptz | NOT NULL | 학습 종료 시간 |
| created_at | timestamptz | DEFAULT now() | 생성일 |

**Indexes**
- `idx_study_records_user_id` on (user_id)
- `idx_study_records_user_subject` on (user_id, subject)
- `idx_study_records_schedule_id` on (schedule_id) WHERE schedule_id IS NOT NULL
- `idx_study_records_user_started_at` on (user_id, started_at DESC)
- `idx_study_records_user_date` on (user_id, started_at::date)

**Constraints**
- `check_record_time_range` - ended_at > started_at

**RLS Policies**
- 모든 CRUD 작업: auth.uid() = user_id

---

## Views

### daily_study_stats

일별 과목별 학습 통계.

```sql
SELECT
  user_id,
  (started_at AT TIME ZONE 'Asia/Seoul')::date AS study_date,
  subject,
  SUM(duration_minutes) AS total_minutes,
  COUNT(*) AS session_count
FROM study_records
GROUP BY user_id, study_date, subject
```

### user_study_summary

사용자별 과목별 전체 학습 통계.

```sql
SELECT
  user_id,
  subject,
  SUM(duration_minutes) AS total_minutes,
  COUNT(*) AS total_sessions,
  AVG(duration_minutes)::integer AS avg_session_minutes,
  MAX(started_at) AS last_study_at
FROM study_records
GROUP BY user_id, subject
```

---

## Relationships

| From | To | Type | FK Column |
|------|-----|------|-----------|
| profiles | auth.users | 1:1 | profiles.id |
| study_goals | profiles | N:1 | study_goals.user_id |
| schedules | profiles | N:1 | schedules.user_id |
| schedules | study_goals | N:1 (nullable) | schedules.goal_id |
| study_records | profiles | N:1 | study_records.user_id |
| study_records | schedules | N:1 (nullable) | study_records.schedule_id |

---

## Migration Files

| File | Description |
|------|-------------|
| `001_create_profiles.sql` | profiles 테이블, 트리거, RLS 정책 |
| `002_create_study_goals.sql` | study_goals 테이블, 인덱스, RLS 정책 |
| `003_create_schedules.sql` | schedules 테이블, 인덱스, RLS 정책 |
| `004_create_study_records.sql` | study_records 테이블, 뷰, RLS 정책 |

---

## Usage Examples

### 프로필 조회

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

### 활성 학습 목표 목록

```typescript
const { data: goals } = await supabase
  .from('study_goals')
  .select('*')
  .eq('status', 'active')
  .order('end_date', { ascending: true })
```

### 특정 날짜의 일정 조회

```typescript
const { data: schedules } = await supabase
  .from('schedules')
  .select('*, study_goals(title)')
  .eq('date', '2025-02-04')
  .order('start_time', { ascending: true })
```

### 오늘의 학습 기록

```typescript
const today = new Date().toISOString().split('T')[0]
const { data: records } = await supabase
  .from('study_records')
  .select('*')
  .gte('started_at', `${today}T00:00:00`)
  .lt('started_at', `${today}T23:59:59`)
  .order('started_at', { ascending: false })
```

### 과목별 학습 통계

```typescript
const { data: stats } = await supabase
  .from('user_study_summary')
  .select('*')
  .eq('user_id', userId)
  .order('total_minutes', { ascending: false })
```
