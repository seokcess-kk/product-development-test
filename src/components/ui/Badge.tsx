'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        secondary: 'bg-gray-200 text-gray-600',
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-700',
        // Subject colors
        korean: 'bg-danger-100 text-danger-700 border border-danger-200',
        math: 'bg-primary-100 text-primary-700 border border-primary-200',
        english: 'bg-violet-100 text-violet-700 border border-violet-200',
        science: 'bg-success-100 text-success-700 border border-success-200',
        social: 'bg-warning-100 text-warning-800 border border-warning-200',
        other: 'bg-gray-100 text-gray-700 border border-gray-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
