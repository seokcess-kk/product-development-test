# StudyMate API Specification

## Overview

StudyMate 프로젝트의 API 명세 문서입니다.

## Base URL

- **개발**: `http://localhost:3000/api`
- **프로덕션**: `https://studymate.app/api`

---

## Authentication

Supabase Auth를 사용합니다. 인증이 필요한 API는 Supabase 세션 쿠키가 자동으로 포함됩니다.

### 인증 흐름

1. **이메일/비밀번호 로그인**: 클라이언트에서 `supabase.auth.signInWithPassword()` 호출
2. **Google OAuth 로그인**: 클라이언트에서 `supabase.auth.signInWithOAuth()` 호출 후 `/api/auth/callback`으로 리다이렉트
3. **세션 관리**: Supabase SSR이 쿠키 기반으로 자동 처리

---

## Endpoints

### Auth

#### GET /api/auth/callback

OAuth 로그인 콜백 처리. Supabase OAuth 흐름 완료 후 호출됩니다.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| code | string | Yes | Supabase에서 전달한 인증 코드 |
| redirectTo | string | No | 로그인 성공 후 리다이렉트 경로 (기본값: `/dashboard`) |

**Response**

- **성공**: 지정된 경로로 리다이렉트
- **실패**: `/login?error={message}`로 리다이렉트

**Flow**

```
1. Supabase OAuth 완료
2. GET /api/auth/callback?code=xxx
3. 인증 코드를 세션으로 교환
4. 프로필 존재 여부 확인
   - 없으면: profiles 테이블에 기본 프로필 생성 → /signup/complete 리다이렉트
   - 있으면: redirectTo로 리다이렉트
```

---

## Client-Side Auth API (Supabase)

클라이언트에서 직접 Supabase Auth API를 사용합니다.

### 회원가입

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: '홍길동',
      grade: 2,
      school_type: 'high',
    },
  },
})
```

**Response**

```typescript
// 성공
{
  data: {
    user: User,
    session: Session,
  },
  error: null
}

// 실패
{
  data: { user: null, session: null },
  error: AuthError
}
```

**에러 코드**

| 에러 메시지 | 설명 |
|------------|------|
| User already registered | 이미 가입된 이메일 |
| Password should be at least 6 characters | 비밀번호 길이 부족 |

### 로그인

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

**에러 코드**

| 에러 메시지 | 설명 |
|------------|------|
| Invalid login credentials | 이메일 또는 비밀번호 불일치 |
| Email not confirmed | 이메일 인증 필요 |

### Google 로그인

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${origin}/api/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
})
```

### 로그아웃

```typescript
const { error } = await supabase.auth.signOut()
```

### 현재 사용자 조회

```typescript
const { data: { user }, error } = await supabase.auth.getUser()
```

---

## Profile API

프로필은 Supabase RLS를 통해 보호되며, 클라이언트에서 직접 조회/수정합니다.

### 프로필 조회

```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

**Response**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "grade": 2,
  "school_type": "high",
  "created_at": "2025-02-04T00:00:00Z",
  "updated_at": "2025-02-04T00:00:00Z"
}
```

### 프로필 생성

회원가입 시 자동으로 생성됩니다.

```typescript
const { data, error } = await supabase.from('profiles').insert({
  id: user.id,
  email: user.email,
  name: '홍길동',
  grade: 2,
  school_type: 'high',
})
```

### 프로필 수정

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    name: '김철수',
    grade: 3,
    school_type: 'high',
  })
  .eq('id', userId)
  .select()
  .single()
```

---

## Error Response Format

모든 에러 응답은 다음 형식을 따릅니다.

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자 친화적인 에러 메시지"
  }
}
```

### 에러 코드

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | 인증이 필요합니다 |
| FORBIDDEN | 403 | 권한이 없습니다 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없습니다 |
| VALIDATION_ERROR | 400 | 입력값이 올바르지 않습니다 |
| ALREADY_EXISTS | 409 | 이미 존재합니다 |
| INTERNAL_ERROR | 500 | 서버 오류가 발생했습니다 |

---

## Data Types

### SchoolType

```typescript
type SchoolType = 'middle' | 'high'
```

| Value | Description |
|-------|-------------|
| middle | 중학교 |
| high | 고등학교 |

### Grade

```typescript
type Grade = 1 | 2 | 3
```

---

## Validation Rules

### 이메일

- 형식: 유효한 이메일 형식
- 필수

### 비밀번호

- 최소 8자 이상
- 영문자와 숫자 포함 필수

### 이름

- 최소 2자 이상
- 최대 20자 이하
- 필수

### 학년

- 1, 2, 3 중 하나
- 필수

### 학교 유형

- 'middle' 또는 'high'
- 필수

---

## Security Considerations

### Row Level Security (RLS)

모든 테이블에 RLS가 적용되어 있어 사용자는 자신의 데이터만 접근할 수 있습니다.

```sql
-- 예: profiles 테이블
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 입력 검증

모든 입력값은 Zod 스키마를 통해 클라이언트와 서버 양쪽에서 검증됩니다.

### 민감 정보 보호

- 비밀번호는 Supabase Auth에서 해시 처리
- API 키는 환경 변수로 관리
- 세션 토큰은 httpOnly 쿠키로 보호

---

## Rate Limiting

Supabase의 기본 Rate Limiting이 적용됩니다.

- **Auth API**: 분당 30회
- **Database API**: 초당 100회

---

## Usage Examples

### 로그인 흐름 (React Hook Form + Zod)

```typescript
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const handleEmailLogin = async (data: LoginFormData) => {
    const { error } = await signInWithEmail(data.email, data.password)
    if (error) {
      // 에러 처리
    }
  }

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
    // OAuth 리다이렉트 발생
  }
}
```

### 회원가입 흐름

```typescript
import { useAuth } from '@/hooks/useAuth'

function SignupPage() {
  const { signUp } = useAuth()

  const handleSignup = async (data: SignupFormData) => {
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      name: data.name,
      grade: data.grade,
      schoolType: data.schoolType,
    })
    if (error) {
      // 에러 처리
    }
  }
}
```

### 프로필 조회 및 수정

```typescript
import { useAuth } from '@/hooks/useAuth'

function ProfilePage() {
  const { profile, updateProfile, refreshProfile } = useAuth()

  const handleUpdate = async () => {
    const { error } = await updateProfile({
      name: '새 이름',
      grade: 3,
    })
    if (!error) {
      await refreshProfile()
    }
  }
}
```
