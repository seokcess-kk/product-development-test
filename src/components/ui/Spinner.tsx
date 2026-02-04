'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-primary-500', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn('inline-flex items-center', className)}
        {...props}
      >
        <Loader2
          className={cn(spinnerVariants({ size }))}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)
Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }
