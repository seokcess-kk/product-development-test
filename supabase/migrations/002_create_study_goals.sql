-- supabase/migrations/002_create_study_goals.sql
-- StudyMate: 학습 목표/시험 테이블

-- Create study_goals table
create table study_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title varchar(200) not null,
  goal_type varchar(20) not null check (goal_type in ('midterm', 'final', 'sat', 'regular')),
  start_date date not null,
  end_date date not null,
  subjects jsonb not null default '[]'::jsonb,
  status varchar(20) not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- end_date는 start_date 이후여야 함
  constraint check_date_range check (end_date >= start_date)
);

-- Create indexes
create index idx_study_goals_user_id on study_goals(user_id);
create index idx_study_goals_user_status on study_goals(user_id, status);
create index idx_study_goals_date_range on study_goals(start_date, end_date);
create index idx_study_goals_user_active on study_goals(user_id) where status = 'active';

-- Enable RLS
alter table study_goals enable row level security;

-- RLS Policies
-- 사용자는 자신의 학습 목표만 조회 가능
create policy "Users can view own study_goals"
  on study_goals for select
  using (auth.uid() = user_id);

-- 사용자는 자신의 학습 목표만 생성 가능
create policy "Users can create own study_goals"
  on study_goals for insert
  with check (auth.uid() = user_id);

-- 사용자는 자신의 학습 목표만 수정 가능
create policy "Users can update own study_goals"
  on study_goals for update
  using (auth.uid() = user_id);

-- 사용자는 자신의 학습 목표만 삭제 가능
create policy "Users can delete own study_goals"
  on study_goals for delete
  using (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거 적용
create trigger study_goals_updated_at
  before update on study_goals
  for each row execute function update_updated_at_column();

-- 테이블 코멘트
comment on table study_goals is '학습 목표/시험 정보';
comment on column study_goals.id is '학습 목표 ID';
comment on column study_goals.user_id is '사용자 ID (profiles.id 참조)';
comment on column study_goals.title is '목표 제목 (예: 1학기 중간고사)';
comment on column study_goals.goal_type is '목표 유형 (midterm: 중간고사, final: 기말고사, sat: 수능, regular: 일반)';
comment on column study_goals.start_date is '시작일';
comment on column study_goals.end_date is '종료일 (시험일)';
comment on column study_goals.subjects is '선택한 과목 목록과 목표 시간 (JSON 배열)';
comment on column study_goals.status is '상태 (active: 진행중, completed: 완료, cancelled: 취소)';

-- subjects JSONB 구조 예시:
-- [
--   { "name": "수학", "target_hours": 20 },
--   { "name": "영어", "target_hours": 15 },
--   { "name": "국어", "target_hours": 10 }
-- ]
