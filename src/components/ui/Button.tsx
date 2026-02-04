'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        danger:
          'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
        outline:
          'border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 active:bg-primary-100',
      },
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        md: 'h-10 px-4 py-2.5 text-sm',
        lg: 'h-12 px-5 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }))

    // If asChild is true, render children with button styles
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string; ref?: React.Ref<HTMLButtonElement> }>, {
        className: cn(buttonClasses, (children as React.ReactElement<{ className?: string }>).props.className),
        ref,
        ...props,
      })
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
