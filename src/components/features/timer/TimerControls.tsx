'use client'

import * as React from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { TimerStatus } from '@/types/timer'

export interface TimerControlsProps {
  status: TimerStatus
  onStart?: () => void
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onReset?: () => void
  disabled?: boolean
  className?: string
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  disabled = false,
  className,
}: TimerControlsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {/* 시작/일시정지/재개 버튼 */}
      {status === 'idle' && (
        <Button
          size="lg"
          onClick={onStart}
          disabled={disabled}
          className="h-14 w-14 rounded-full p-0"
          aria-label="시작"
        >
          <Play className="h-6 w-6" />
        </Button>
      )}

      {status === 'running' && (
        <Button
          size="lg"
          variant="secondary"
          onClick={onPause}
          disabled={disabled}
          className="h-14 w-14 rounded-full p-0"
          aria-label="일시정지"
        >
          <Pause className="h-6 w-6" />
        </Button>
      )}

      {status === 'paused' && (
        <Button
          size="lg"
          onClick={onResume}
          disabled={disabled}
          className="h-14 w-14 rounded-full p-0"
          aria-label="재개"
        >
          <Play className="h-6 w-6" />
        </Button>
      )}

      {/* 완료 버튼 (running 또는 paused 상태에서만) */}
      {(status === 'running' || status === 'paused') && (
        <Button
          size="lg"
          variant="danger"
          onClick={onStop}
          disabled={disabled}
          className="h-14 w-14 rounded-full p-0"
          aria-label="완료"
        >
          <Square className="h-5 w-5" />
        </Button>
      )}

      {/* 리셋 버튼 (paused 상태에서만) */}
      {status === 'paused' && (
        <Button
          size="lg"
          variant="ghost"
          onClick={onReset}
          disabled={disabled}
          className="h-14 w-14 rounded-full p-0"
          aria-label="리셋"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export default TimerControls
