-- supabase/migrations/001_create_profiles.sql
-- StudyMate: 사용자 프로필 테이블
-- Supabase Auth의 auth.users와 연결

-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) not null,
  name varchar(100) not null,
  grade smallint not null check (grade between 1 and 3),
  school_type varchar(20) not null check (school_type in ('middle', 'high')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create indexes
create index idx_profiles_email on profiles(email);
create index idx_profiles_school_type_grade on profiles(school_type, grade);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
-- 사용자는 자신의 프로필만 조회 가능
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- 사용자는 자신의 프로필만 생성 가능
create policy "Users can create own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- updated_at 자동 업데이트 트리거 함수 생성
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- profiles 테이블에 트리거 적용
create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

-- 새 사용자 생성 시 자동으로 프로필 생성하는 함수
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, grade, school_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'grade')::smallint, 1),
    coalesce(new.raw_user_meta_data->>'school_type', 'high')
  );
  return new;
end;
$$ language plpgsql security definer;

-- auth.users에 트리거 적용 (새 사용자 가입 시 프로필 자동 생성)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 테이블 코멘트
comment on table profiles is '사용자 프로필 정보 (auth.users와 연결)';
comment on column profiles.id is '사용자 ID (auth.users.id와 동일)';
comment on column profiles.email is '이메일 주소';
comment on column profiles.name is '사용자 이름';
comment on column profiles.grade is '학년 (1, 2, 3)';
comment on column profiles.school_type is '학교 유형 (middle: 중학교, high: 고등학교)';
