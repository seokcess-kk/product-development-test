'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressVariants = cva('h-full rounded-full transition-all duration-300 ease-out', {
  variants: {
    variant: {
      default: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number
  max?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, value, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className={cn('w-full', className)} {...props}>
        <div
          ref={ref}
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${percentage.toFixed(0)}% complete`}
        >
          <div
            className={cn(progressVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <p className="mt-1 text-right text-xs text-gray-500">
            {percentage.toFixed(0)}%
          </p>
        )}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress, progressVariants }
