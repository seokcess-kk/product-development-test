'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  BarChart2,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: '대시보드', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/calendar', label: '캘린더', icon: <Calendar className="h-5 w-5" /> },
  { href: '/records', label: '기록', icon: <BarChart2 className="h-5 w-5" /> },
]

export interface HeaderProps {
  user?: {
    name: string
    email: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary-500" aria-hidden="true" />
          <span className="text-xl font-bold text-gray-900">StudyMate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:flex"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    userMenuOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="border-b border-gray-200 px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    설정
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      onLogout?.()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="space-y-1 px-4 py-3" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium',
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile User Section */}
          {user ? (
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3 px-3 py-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  <Settings className="h-5 w-5" />
                  설정
                </Link>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex flex-col gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="secondary" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full">회원가입</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
