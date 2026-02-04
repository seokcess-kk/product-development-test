'use client'

import * as React from 'react'
import { Badge, type BadgeProps } from './Badge'

export type SubjectType = 'korean' | 'math' | 'english' | 'science' | 'social' | 'other'

const subjectLabels: Record<SubjectType, string> = {
  korean: '국어',
  math: '수학',
  english: '영어',
  science: '과학',
  social: '사회',
  other: '기타',
}

export interface SubjectBadgeProps extends Omit<BadgeProps, 'variant'> {
  subject: SubjectType
  showLabel?: boolean
  customLabel?: string
}

const SubjectBadge = React.forwardRef<HTMLSpanElement, SubjectBadgeProps>(
  ({ subject, showLabel = true, customLabel, children, ...props }, ref) => {
    const label = customLabel || subjectLabels[subject]

    return (
      <Badge ref={ref} variant={subject} {...props}>
        {showLabel ? label : children}
      </Badge>
    )
  }
)
SubjectBadge.displayName = 'SubjectBadge'

export { SubjectBadge, subjectLabels }
