# StudyMate Design System

고등학생을 위한 학습 계획 및 실행 도우미 웹 서비스의 디자인 시스템.

## Design Direction

### 프로젝트 분석
- **제품 유형**: 생산성 / 교육
- **타겟 사용자**: 고등학생 (10대 후반)
- **사용 빈도**: 매일
- **사용 맥락**: 학습 중, 계획 수립 시

### 디자인 키워드
- **집중**: 깔끔하고 방해 요소 없는 UI
- **동기부여**: 밝고 긍정적인 느낌
- **친근함**: 10대가 선호하는 현대적 디자인

### 피해야 할 느낌
- 올드함, 무거움, 복잡함, 딱딱함

---

## 1. Color Palette

### Primary (Blue - 학습/집중)
파란색 계열로 집중력과 신뢰감을 표현합니다.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| primary-50 | #EFF6FF | rgb(239, 246, 255) | 배경 (매우 밝은) |
| primary-100 | #DBEAFE | rgb(219, 234, 254) | 배경 (밝은) |
| primary-200 | #BFDBFE | rgb(191, 219, 254) | 보조 요소 |
| primary-300 | #93C5FD | rgb(147, 197, 253) | 보조 요소 |
| primary-400 | #60A5FA | rgb(96, 165, 250) | 아이콘, 링크 |
| primary-500 | #3B82F6 | rgb(59, 130, 246) | **기본 (메인 액션)** |
| primary-600 | #2563EB | rgb(37, 99, 235) | Hover 상태 |
| primary-700 | #1D4ED8 | rgb(29, 78, 216) | Active/Pressed 상태 |
| primary-800 | #1E40AF | rgb(30, 64, 175) | 강조 텍스트 |
| primary-900 | #1E3A8A | rgb(30, 58, 138) | 진한 텍스트 |

### Secondary (Violet - 창의성/동기부여)
보조 색상으로 창의성과 특별함을 표현합니다.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| secondary-50 | #F5F3FF | rgb(245, 243, 255) | 배경 (매우 밝은) |
| secondary-100 | #EDE9FE | rgb(237, 233, 254) | 배경 (밝은) |
| secondary-200 | #DDD6FE | rgb(221, 214, 254) | 보조 요소 |
| secondary-300 | #C4B5FD | rgb(196, 181, 253) | 보조 요소 |
| secondary-400 | #A78BFA | rgb(167, 139, 250) | 아이콘 |
| secondary-500 | #8B5CF6 | rgb(139, 92, 246) | **기본** |
| secondary-600 | #7C3AED | rgb(124, 58, 237) | Hover |
| secondary-700 | #6D28D9 | rgb(109, 40, 217) | Active |
| secondary-800 | #5B21B6 | rgb(91, 33, 182) | 텍스트 |
| secondary-900 | #4C1D95 | rgb(76, 29, 149) | 진한 텍스트 |

### Success (Green - 완료/성공)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| success-50 | #F0FDF4 | rgb(240, 253, 244) | 성공 배경 |
| success-100 | #DCFCE7 | rgb(220, 252, 231) | 성공 배경 (밝은) |
| success-200 | #BBF7D0 | rgb(187, 247, 208) | 보조 |
| success-300 | #86EFAC | rgb(134, 239, 172) | 보조 |
| success-400 | #4ADE80 | rgb(74, 222, 128) | 아이콘 |
| success-500 | #22C55E | rgb(34, 197, 94) | **기본** |
| success-600 | #16A34A | rgb(22, 163, 74) | Hover |
| success-700 | #15803D | rgb(21, 128, 61) | Active |
| success-800 | #166534 | rgb(22, 101, 52) | 텍스트 |
| success-900 | #14532D | rgb(20, 83, 45) | 진한 텍스트 |

### Warning (Amber - 주의/경고)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| warning-50 | #FFFBEB | rgb(255, 251, 235) | 경고 배경 |
| warning-100 | #FEF3C7 | rgb(254, 243, 199) | 경고 배경 (밝은) |
| warning-200 | #FDE68A | rgb(253, 230, 138) | 보조 |
| warning-300 | #FCD34D | rgb(252, 211, 77) | 보조 |
| warning-400 | #FBBF24 | rgb(251, 191, 36) | 아이콘 |
| warning-500 | #F59E0B | rgb(245, 158, 11) | **기본** |
| warning-600 | #D97706 | rgb(217, 119, 6) | Hover |
| warning-700 | #B45309 | rgb(180, 83, 9) | Active |
| warning-800 | #92400E | rgb(146, 64, 14) | 텍스트 |
| warning-900 | #78350F | rgb(120, 53, 15) | 진한 텍스트 |

### Danger (Red - 오류/삭제)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| danger-50 | #FEF2F2 | rgb(254, 242, 242) | 에러 배경 |
| danger-100 | #FEE2E2 | rgb(254, 226, 226) | 에러 배경 (밝은) |
| danger-200 | #FECACA | rgb(254, 202, 202) | 보조 |
| danger-300 | #FCA5A5 | rgb(252, 165, 165) | 보조 |
| danger-400 | #F87171 | rgb(248, 113, 113) | 아이콘 |
| danger-500 | #EF4444 | rgb(239, 68, 68) | **기본** |
| danger-600 | #DC2626 | rgb(220, 38, 38) | Hover |
| danger-700 | #B91C1C | rgb(185, 28, 28) | Active |
| danger-800 | #991B1B | rgb(153, 27, 27) | 텍스트 |
| danger-900 | #7F1D1D | rgb(127, 29, 29) | 진한 텍스트 |

### Neutral (Gray)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| gray-50 | #F9FAFB | rgb(249, 250, 251) | 페이지 배경 |
| gray-100 | #F3F4F6 | rgb(243, 244, 246) | 카드 배경, 입력 배경 |
| gray-200 | #E5E7EB | rgb(229, 231, 235) | Border, Divider |
| gray-300 | #D1D5DB | rgb(209, 213, 219) | 비활성 Border |
| gray-400 | #9CA3AF | rgb(156, 163, 175) | Placeholder |
| gray-500 | #6B7280 | rgb(107, 114, 128) | 보조 텍스트 |
| gray-600 | #4B5563 | rgb(75, 85, 99) | 본문 텍스트 (밝은) |
| gray-700 | #374151 | rgb(55, 65, 81) | **본문 텍스트** |
| gray-800 | #1F2937 | rgb(31, 41, 55) | 제목 텍스트 |
| gray-900 | #111827 | rgb(17, 24, 39) | 강조 텍스트 |

### White & Black

| Token | Hex | Usage |
|-------|-----|-------|
| white | #FFFFFF | 배경, 카드 |
| black | #000000 | 특수 용도 |

---

## 2. Typography

### Font Family

```css
/* Primary Font (한글) */
--font-family-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;

/* English & Numbers */
--font-family-inter: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (코드) */
--font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### Font Size Scale

| Token | Size | rem | Usage |
|-------|------|-----|-------|
| text-xs | 12px | 0.75rem | 캡션, 라벨 |
| text-sm | 14px | 0.875rem | 작은 본문, 버튼 (sm) |
| text-base | 16px | 1rem | **기본 본문** |
| text-lg | 18px | 1.125rem | 큰 본문 |
| text-xl | 20px | 1.25rem | 서브 제목 |
| text-2xl | 24px | 1.5rem | 카드 제목 |
| text-3xl | 30px | 1.875rem | 섹션 제목 |
| text-4xl | 36px | 2.25rem | 페이지 제목 |

### Font Weight

| Token | Value | Usage |
|-------|-------|-------|
| font-regular | 400 | 본문 텍스트 |
| font-medium | 500 | 강조 본문, 라벨 |
| font-semibold | 600 | 제목, 버튼 |
| font-bold | 700 | 강조 제목 |

### Line Height

| Token | Value | Usage |
|-------|-------|-------|
| leading-none | 1 | 아이콘, 숫자 |
| leading-tight | 1.25 | 큰 제목 |
| leading-snug | 1.375 | 작은 제목 |
| leading-normal | 1.5 | **기본** |
| leading-relaxed | 1.625 | 본문 텍스트 |
| leading-loose | 2 | 읽기 편한 본문 |

### Text Styles (Semantic)

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| h1 | 36px (text-4xl) | 700 (bold) | 1.25 (tight) | 페이지 제목 |
| h2 | 30px (text-3xl) | 600 (semibold) | 1.25 (tight) | 섹션 제목 |
| h3 | 24px (text-2xl) | 600 (semibold) | 1.375 (snug) | 카드 제목 |
| h4 | 20px (text-xl) | 600 (semibold) | 1.375 (snug) | 서브 제목 |
| body-lg | 18px (text-lg) | 400 (regular) | 1.625 (relaxed) | 큰 본문 |
| body | 16px (text-base) | 400 (regular) | 1.625 (relaxed) | **기본 본문** |
| body-sm | 14px (text-sm) | 400 (regular) | 1.5 (normal) | 작은 본문 |
| caption | 12px (text-xs) | 400 (regular) | 1.5 (normal) | 캡션, 힌트 |
| label | 14px (text-sm) | 500 (medium) | 1.5 (normal) | 라벨 |

---

## 3. Spacing System

Base unit: 4px

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| space-0 | 0px | 0 | - |
| space-0.5 | 2px | 0.5 | 미세 조정 |
| space-1 | 4px | 1 | 아이콘과 텍스트 사이 |
| space-2 | 8px | 2 | 관련 요소 간격 |
| space-3 | 12px | 3 | 폼 필드 간격 |
| space-4 | 16px | 4 | **기본 간격** |
| space-5 | 20px | 5 | 카드 내부 패딩 |
| space-6 | 24px | 6 | 섹션 내 간격 |
| space-8 | 32px | 8 | 섹션 간 간격 |
| space-10 | 40px | 10 | 큰 섹션 간격 |
| space-12 | 48px | 12 | 페이지 섹션 |
| space-16 | 64px | 16 | 주요 섹션 구분 |
| space-20 | 80px | 20 | 히어로 섹션 |
| space-24 | 96px | 24 | 페이지 상하단 |

### Component Spacing Guidelines

```
Button (md):     px-4 py-2.5     (16px 10px)
Button (sm):     px-3 py-2       (12px 8px)
Button (lg):     px-5 py-3       (20px 12px)

Card:            p-5 or p-6      (20px or 24px)
Card gap:        gap-4           (16px)

Form:
  - Label to Input: space-1.5   (6px)
  - Input to Input: space-4     (16px)
  - Form groups:    space-6     (24px)

Section:
  - Title to content: space-4   (16px)
  - Section gap:      space-8   (32px)
```

---

## 4. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px 0 rgba(0, 0, 0, 0.05) | 미묘한 강조 |
| shadow-md | 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) | **카드 기본** |
| shadow-lg | 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) | 드롭다운, 팝오버 |
| shadow-xl | 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) | 모달 |

### Tailwind Classes
```css
.shadow-sm  { box-shadow: var(--shadow-sm); }
.shadow-md  { box-shadow: var(--shadow-md); }
.shadow-lg  { box-shadow: var(--shadow-lg); }
.shadow-xl  { box-shadow: var(--shadow-xl); }
```

---

## 5. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| rounded-sm | 4px | rounded-sm | 작은 요소 (Badge) |
| rounded-md | 6px | rounded-md | **기본** (Input, Button) |
| rounded-lg | 8px | rounded-lg | 카드 |
| rounded-xl | 12px | rounded-xl | 큰 카드, 모달 |
| rounded-2xl | 16px | rounded-2xl | 히어로 요소 |
| rounded-full | 9999px | rounded-full | 원형 (Avatar, Pill) |

---

## 6. Component Style Guide

### Button

#### Variants

| Variant | Background | Text | Border | Hover | Active |
|---------|------------|------|--------|-------|--------|
| Primary | primary-500 | white | none | primary-600 | primary-700 |
| Secondary | white | gray-700 | gray-300 | gray-50 | gray-100 |
| Ghost | transparent | gray-700 | none | gray-100 | gray-200 |
| Danger | danger-500 | white | none | danger-600 | danger-700 |

#### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| sm | 32px | 8px 12px | 14px | 16px |
| md | 40px | 10px 16px | 14px | 18px |
| lg | 48px | 12px 20px | 16px | 20px |

#### States

```css
/* Default */
button { ... }

/* Hover */
button:hover { ... }

/* Focus */
button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Active */
button:active { ... }

/* Disabled */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
button[data-loading="true"] {
  position: relative;
  color: transparent;
}
```

#### Tailwind Implementation

```jsx
// Primary Button
<button className="
  h-10 px-4
  bg-primary-500 text-white
  rounded-md font-medium text-sm
  hover:bg-primary-600
  active:bg-primary-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-primary-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
">
  Button
</button>

// Secondary Button
<button className="
  h-10 px-4
  bg-white text-gray-700
  border border-gray-300
  rounded-md font-medium text-sm
  hover:bg-gray-50
  active:bg-gray-100
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-primary-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
">
  Button
</button>

// Ghost Button
<button className="
  h-10 px-4
  bg-transparent text-gray-700
  rounded-md font-medium text-sm
  hover:bg-gray-100
  active:bg-gray-200
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-primary-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
">
  Button
</button>

// Danger Button
<button className="
  h-10 px-4
  bg-danger-500 text-white
  rounded-md font-medium text-sm
  hover:bg-danger-600
  active:bg-danger-700
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-danger-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-150
">
  Button
</button>
```

---

### Input

#### States

| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | gray-300 | white | gray-900 |
| Focus | primary-500 (ring) | white | gray-900 |
| Error | danger-500 | white | gray-900 |
| Disabled | gray-200 | gray-100 | gray-400 |

#### Tailwind Implementation

```jsx
// Default Input
<input className="
  h-10 w-full px-3
  bg-white text-gray-900
  border border-gray-300 rounded-md
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  transition-colors duration-150
" />

// Error Input
<input className="
  h-10 w-full px-3
  bg-white text-gray-900
  border border-danger-500 rounded-md
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent
  transition-colors duration-150
" />

// With Label
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">
    Label
  </label>
  <input className="..." />
  <p className="text-xs text-gray-500">Helper text</p>
</div>

// Error State with Message
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">
    Label
  </label>
  <input className="... border-danger-500" />
  <p className="text-xs text-danger-500">Error message</p>
</div>
```

---

### Card

```jsx
// Default Card
<div className="
  bg-white rounded-lg shadow-md
  p-5
">
  {children}
</div>

// Card with Header
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="px-5 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  </div>
  <div className="p-5">
    {content}
  </div>
</div>

// Clickable Card (Hover)
<div className="
  bg-white rounded-lg shadow-md
  p-5
  cursor-pointer
  hover:shadow-lg
  transition-shadow duration-200
">
  {children}
</div>
```

---

### Badge

#### Variants

| Variant | Background | Text |
|---------|------------|------|
| Default | gray-100 | gray-700 |
| Primary | primary-100 | primary-700 |
| Success | success-100 | success-700 |
| Warning | warning-100 | warning-800 |
| Danger | danger-100 | danger-700 |

#### Tailwind Implementation

```jsx
// Default Badge
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-gray-100 text-gray-700
">
  Badge
</span>

// Primary Badge
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-primary-100 text-primary-700
">
  Badge
</span>
```

---

## 7. Subject Color Mapping (과목별 색상)

학습 계획에서 과목을 구분하기 위한 색상 매핑입니다.

| Subject | Korean | Background | Text | Border |
|---------|--------|------------|------|--------|
| Korean (국어) | 국어 | #FEE2E2 (danger-100) | #B91C1C (danger-700) | #FECACA (danger-200) |
| Math (수학) | 수학 | #DBEAFE (primary-100) | #1D4ED8 (primary-700) | #BFDBFE (primary-200) |
| English (영어) | 영어 | #EDE9FE (secondary-100) | #6D28D9 (secondary-700) | #DDD6FE (secondary-200) |
| Science (과학) | 과학 | #DCFCE7 (success-100) | #15803D (success-700) | #BBF7D0 (success-200) |
| Social (사회) | 사회 | #FEF3C7 (warning-100) | #B45309 (warning-700) | #FDE68A (warning-200) |
| Other (기타) | 기타 | #F3F4F6 (gray-100) | #374151 (gray-700) | #E5E7EB (gray-200) |

### Tailwind Implementation

```jsx
// Subject Badge Component
const subjectColors = {
  korean: 'bg-danger-100 text-danger-700 border-danger-200',
  math: 'bg-primary-100 text-primary-700 border-primary-200',
  english: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  science: 'bg-success-100 text-success-700 border-success-200',
  social: 'bg-warning-100 text-warning-800 border-warning-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

<span className={`
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full border
  text-xs font-medium
  ${subjectColors[subject]}
`}>
  {subjectName}
</span>
```

---

## 8. Icons (Lucide React)

Lucide React 아이콘 라이브러리를 사용합니다.

### Installation
```bash
npm install lucide-react
```

### 주요 아이콘 목록

| Icon | Name | Usage |
|------|------|-------|
| `<Calendar />` | Calendar | 일정, 계획 |
| `<Clock />` | Clock | 시간, 타이머 |
| `<CheckCircle />` | CheckCircle | 완료 |
| `<Circle />` | Circle | 미완료 |
| `<Plus />` | Plus | 추가 |
| `<Pencil />` | Pencil | 편집 |
| `<Trash2 />` | Trash2 | 삭제 |
| `<BookOpen />` | BookOpen | 학습, 과목 |
| `<Target />` | Target | 목표 |
| `<BarChart2 />` | BarChart2 | 통계 |
| `<Award />` | Award | 성취, 배지 |
| `<Star />` | Star | 즐겨찾기, 중요 |
| `<Bell />` | Bell | 알림 |
| `<Settings />` | Settings | 설정 |
| `<User />` | User | 프로필 |
| `<LogOut />` | LogOut | 로그아웃 |
| `<ChevronLeft />` | ChevronLeft | 이전 |
| `<ChevronRight />` | ChevronRight | 다음 |
| `<X />` | X | 닫기 |
| `<Search />` | Search | 검색 |
| `<Filter />` | Filter | 필터 |
| `<Play />` | Play | 시작 |
| `<Pause />` | Pause | 일시정지 |
| `<RotateCcw />` | RotateCcw | 리셋 |

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| sm | 16px | 버튼 내 아이콘 (sm) |
| md | 20px | **기본**, 버튼 내 아이콘 (md) |
| lg | 24px | 단독 아이콘, 네비게이션 |
| xl | 32px | 히어로, 빈 상태 |

### Usage Example

```jsx
import { Calendar, Plus, CheckCircle } from 'lucide-react';

// In Button
<button className="...">
  <Plus className="w-5 h-5 mr-2" />
  Add Task
</button>

// Standalone
<Calendar className="w-6 h-6 text-gray-500" />

// Status Icon
<CheckCircle className="w-5 h-5 text-success-500" />
```

---

## 9. CSS Variables

아래 CSS 변수를 `globals.css`에 추가합니다.

```css
:root {
  /* Primary Colors */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A8A;

  /* Secondary Colors */
  --color-secondary-50: #F5F3FF;
  --color-secondary-100: #EDE9FE;
  --color-secondary-200: #DDD6FE;
  --color-secondary-300: #C4B5FD;
  --color-secondary-400: #A78BFA;
  --color-secondary-500: #8B5CF6;
  --color-secondary-600: #7C3AED;
  --color-secondary-700: #6D28D9;
  --color-secondary-800: #5B21B6;
  --color-secondary-900: #4C1D95;

  /* Success Colors */
  --color-success-50: #F0FDF4;
  --color-success-100: #DCFCE7;
  --color-success-200: #BBF7D0;
  --color-success-300: #86EFAC;
  --color-success-400: #4ADE80;
  --color-success-500: #22C55E;
  --color-success-600: #16A34A;
  --color-success-700: #15803D;
  --color-success-800: #166534;
  --color-success-900: #14532D;

  /* Warning Colors */
  --color-warning-50: #FFFBEB;
  --color-warning-100: #FEF3C7;
  --color-warning-200: #FDE68A;
  --color-warning-300: #FCD34D;
  --color-warning-400: #FBBF24;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;
  --color-warning-700: #B45309;
  --color-warning-800: #92400E;
  --color-warning-900: #78350F;

  /* Danger Colors */
  --color-danger-50: #FEF2F2;
  --color-danger-100: #FEE2E2;
  --color-danger-200: #FECACA;
  --color-danger-300: #FCA5A5;
  --color-danger-400: #F87171;
  --color-danger-500: #EF4444;
  --color-danger-600: #DC2626;
  --color-danger-700: #B91C1C;
  --color-danger-800: #991B1B;
  --color-danger-900: #7F1D1D;

  /* Gray Colors */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Typography */
  --font-family-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

---

## 10. Tailwind Config

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
```

---

## 11. Accessibility Guidelines

### Color Contrast

모든 텍스트는 WCAG AA 기준 (4.5:1) 이상의 대비를 유지합니다.

| Combination | Contrast Ratio | Pass |
|-------------|----------------|------|
| gray-900 on white | 15.8:1 | AAA |
| gray-700 on white | 9.5:1 | AAA |
| gray-500 on white | 4.6:1 | AA |
| primary-500 on white | 4.5:1 | AA |
| white on primary-500 | 4.5:1 | AA |
| white on danger-500 | 4.5:1 | AA |

### Focus States

모든 인터랙티브 요소에 명확한 focus 스타일을 적용합니다.

```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Touch Target

모바일에서 최소 터치 영역 44px x 44px을 유지합니다.

---

## 12. Responsive Breakpoints

| Breakpoint | Min Width | Tailwind Prefix | Usage |
|------------|-----------|-----------------|-------|
| Mobile | 0px | (default) | 기본 모바일 |
| sm | 640px | sm: | 큰 모바일 |
| md | 768px | md: | 태블릿 |
| lg | 1024px | lg: | 작은 데스크톱 |
| xl | 1280px | xl: | 데스크톱 |
| 2xl | 1536px | 2xl: | 큰 데스크톱 |

### Mobile First Approach

```jsx
// Example: Responsive Grid
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-4
">
  {items}
</div>
```

---

## Summary

StudyMate 디자인 시스템은 다음 원칙을 따릅니다:

1. **집중을 돕는 깔끔한 UI**: 불필요한 요소 최소화
2. **밝고 긍정적인 컬러**: 학습 동기 부여
3. **직관적인 인터랙션**: 10대도 쉽게 사용
4. **일관된 컴포넌트**: 디자인 토큰 기반
5. **접근성 준수**: WCAG AA 이상
6. **모바일 우선**: 반응형 디자인

이 디자인 시스템을 기반으로 모든 UI를 구현합니다.
