-- supabase/migrations/004_create_study_records.sql
-- StudyMate: 학습 기록 테이블

-- Create study_records table
create table study_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  schedule_id uuid references schedules(id) on delete set null,
  subject varchar(50) not null,
  duration_minutes integer not null check (duration_minutes > 0),
  memo text,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  created_at timestamptz default now() not null,

  -- ended_at은 started_at 이후여야 함
  constraint check_record_time_range check (ended_at > started_at)
);

-- Create indexes
create index idx_study_records_user_id on study_records(user_id);
create index idx_study_records_user_subject on study_records(user_id, subject);
create index idx_study_records_schedule_id on study_records(schedule_id) where schedule_id is not null;
create index idx_study_records_user_started_at on study_records(user_id, started_at desc);
create index idx_study_records_user_date on study_records(user_id, (started_at::date));

-- Enable RLS
alter table study_records enable row level security;

-- RLS Policies
-- 사용자는 자신의 학습 기록만 조회 가능
create policy "Users can view own study_records"
  on study_records for select
  using (auth.uid() = user_id);

-- 사용자는 자신의 학습 기록만 생성 가능
create policy "Users can create own study_records"
  on study_records for insert
  with check (auth.uid() = user_id);

-- 사용자는 자신의 학습 기록만 수정 가능
create policy "Users can update own study_records"
  on study_records for update
  using (auth.uid() = user_id);

-- 사용자는 자신의 학습 기록만 삭제 가능
create policy "Users can delete own study_records"
  on study_records for delete
  using (auth.uid() = user_id);

-- 테이블 코멘트
comment on table study_records is '학습 기록';
comment on column study_records.id is '학습 기록 ID';
comment on column study_records.user_id is '사용자 ID (profiles.id 참조)';
comment on column study_records.schedule_id is '연결된 일정 ID (선택사항)';
comment on column study_records.subject is '과목명';
comment on column study_records.duration_minutes is '학습 시간 (분)';
comment on column study_records.memo is '메모';
comment on column study_records.started_at is '학습 시작 시간';
comment on column study_records.ended_at is '학습 종료 시간';

-- 일별/주별/월별 학습 통계를 위한 뷰 생성
create or replace view daily_study_stats as
select
  user_id,
  (started_at at time zone 'Asia/Seoul')::date as study_date,
  subject,
  sum(duration_minutes) as total_minutes,
  count(*) as session_count
from study_records
group by user_id, (started_at at time zone 'Asia/Seoul')::date, subject;

comment on view daily_study_stats is '일별 과목별 학습 통계';

-- 사용자별 전체 학습 통계 뷰
create or replace view user_study_summary as
select
  user_id,
  subject,
  sum(duration_minutes) as total_minutes,
  count(*) as total_sessions,
  avg(duration_minutes)::integer as avg_session_minutes,
  max(started_at) as last_study_at
from study_records
group by user_id, subject;

comment on view user_study_summary is '사용자별 과목별 전체 학습 통계';
