'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface QuizTimerProps {
  duration: number // in seconds
  onTimeUp: () => void
}

export default function QuizTimer({ duration, onTimeUp }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    if (timeLeft <= 60) {
      setIsWarning(true)
    }

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className={`flex items-center gap-2 font-mono text-lg ${isWarning ? 'text-red-500 animate-pulse' : ''}`}>
      {isWarning && <AlertTriangle className="h-5 w-5" />}
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}

