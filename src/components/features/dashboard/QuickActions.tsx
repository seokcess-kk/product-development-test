'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Play, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface QuickActionsProps {
  onStartTimer?: () => void
  className?: string
}

export function QuickActions({ onStartTimer, className }: QuickActionsProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">빠른 액션</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm" asChild>
          <Link href="/plan/new">
            <Plus className="h-4 w-4" />
            새 계획
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Play className="h-4 w-4" />}
          onClick={onStartTimer}
        >
          학습 시작
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/calendar">
            <Calendar className="h-4 w-4" />
            캘린더
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
