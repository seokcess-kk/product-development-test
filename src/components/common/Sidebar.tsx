'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  BarChart2,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  PieChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: '대시보드', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/calendar', label: '캘린더', icon: <Calendar className="h-5 w-5" /> },
  { href: '/records', label: '학습 기록', icon: <BarChart2 className="h-5 w-5" /> },
  { href: '/stats', label: '통계', icon: <PieChart className="h-5 w-5" /> },
  { href: '/goals', label: '목표', icon: <Target className="h-5 w-5" /> },
]

const bottomNavItems: NavItem[] = [
  { href: '/settings', label: '설정', icon: <Settings className="h-5 w-5" /> },
]

export interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  className,
}: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive(item.href)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        collapsed && 'justify-center px-2'
      )}
      aria-current={isActive(item.href) ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
    >
      {item.icon}
      {!collapsed && <span>{item.label}</span>}
    </Link>
  )

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-gray-200 px-4',
          collapsed && 'justify-center px-2'
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen
            className="h-8 w-8 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900">StudyMate</span>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-4"
        aria-label="Sidebar navigation"
      >
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4">
        <nav className="space-y-1" aria-label="Secondary navigation">
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Collapse Toggle */}
        {onCollapsedChange && (
          <Button
            variant="ghost"
            size="sm"
            className={cn('mt-4 w-full', collapsed && 'px-2')}
            onClick={() => onCollapsedChange(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2">사이드바 접기</span>
              </>
            )}
          </Button>
        )}
      </div>
    </aside>
  )
}
