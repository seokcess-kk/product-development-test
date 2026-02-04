-- supabase/migrations/003_create_schedules.sql
-- StudyMate: 일정 테이블

-- Create schedules table
create table schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  goal_id uuid references study_goals(id) on delete set null,
  date date not null,
  start_time time not null,
  end_time time not null,
  subject varchar(50) not null,
  title varchar(200) not null,
  description text,
  is_completed boolean not null default false,
  actual_duration_minutes integer check (actual_duration_minutes >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- end_time은 start_time 이후여야 함
  constraint check_time_range check (end_time > start_time)
);

-- Create indexes
create index idx_schedules_user_id on schedules(user_id);
create index idx_schedules_user_date on schedules(user_id, date);
create index idx_schedules_goal_id on schedules(goal_id) where goal_id is not null;
create index idx_schedules_user_subject on schedules(user_id, subject);
create index idx_schedules_user_date_range on schedules(user_id, date desc);
create index idx_schedules_incomplete on schedules(user_id, date) where is_completed = false;

-- Enable RLS
alter table schedules enable row level security;

-- RLS Policies
-- 사용자는 자신의 일정만 조회 가능
create policy "Users can view own schedules"
  on schedules for select
  using (auth.uid() = user_id);

-- 사용자는 자신의 일정만 생성 가능
create policy "Users can create own schedules"
  on schedules for insert
  with check (auth.uid() = user_id);

-- 사용자는 자신의 일정만 수정 가능
create policy "Users can update own schedules"
  on schedules for update
  using (auth.uid() = user_id);

-- 사용자는 자신의 일정만 삭제 가능
create policy "Users can delete own schedules"
  on schedules for delete
  using (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거 적용
create trigger schedules_updated_at
  before update on schedules
  for each row execute function update_updated_at_column();

-- 테이블 코멘트
comment on table schedules is '학습 일정';
comment on column schedules.id is '일정 ID';
comment on column schedules.user_id is '사용자 ID (profiles.id 참조)';
comment on column schedules.goal_id is '연결된 학습 목표 ID (선택사항)';
comment on column schedules.date is '일정 날짜';
comment on column schedules.start_time is '시작 시간';
comment on column schedules.end_time is '종료 시간';
comment on column schedules.subject is '과목명';
comment on column schedules.title is '일정 제목 (예: 수학 문제풀이)';
comment on column schedules.description is '상세 설명';
comment on column schedules.is_completed is '완료 여부';
comment on column schedules.actual_duration_minutes is '실제 학습 시간 (분)';
