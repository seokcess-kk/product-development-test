'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Header, type HeaderProps } from './Header'
import { Sidebar, type SidebarProps } from './Sidebar'

export interface LayoutProps extends HeaderProps {
  children: React.ReactNode
  showSidebar?: boolean
  sidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
}

export function Layout({
  children,
  user,
  onLogout,
  showSidebar = true,
  sidebarCollapsed = false,
  onSidebarCollapsedChange,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - always visible */}
      <Header user={user} onLogout={onLogout} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - hidden on mobile, visible on desktop when showSidebar is true */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapsedChange={onSidebarCollapsedChange}
              className="h-full"
            />
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            showSidebar && 'lg:ml-0' // Sidebar is positioned relatively, no margin needed
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

// Simple layout without sidebar (for auth pages, etc.)
export interface SimpleLayoutProps {
  children: React.ReactNode
  className?: string
}

export function SimpleLayout({ children, className }: SimpleLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {children}
    </div>
  )
}

// Page container for consistent padding
export interface PageContainerProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function PageContainer({
  children,
  className,
  title,
  description,
  actions,
}: PageContainerProps) {
  return (
    <div className={cn('p-6 lg:p-8', className)}>
      {(title || actions) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
