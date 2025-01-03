"use client"

import { useEffect, useState } from "react"

export function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const storedTime = localStorage.getItem('flashSaleEndTime')
    let endTime = storedTime ? new Date(storedTime) : null
    
    // Check if stored date is valid
    if (!endTime || isNaN(endTime.getTime()) || endTime <= new Date()) {
      endTime = new Date()
      endTime.setHours(23, 59, 59, 999)
      localStorage.setItem('flashSaleEndTime', endTime.toISOString())
    }

    const timer = setInterval(() => {
      const now = new Date()
      const difference = endTime!.getTime() - now.getTime()

      if (difference <= 0) {
        // Reset for next day
        const nextEnd = new Date()
        nextEnd.setDate(nextEnd.getDate() + 1)
        nextEnd.setHours(23, 59, 59, 999)
        localStorage.setItem('flashSaleEndTime', nextEnd.toISOString())
        endTime = nextEnd
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
      <div className="flex flex-col p-2 bg-muted rounded-lg text-muted-foreground">
        <span className="countdown font-mono text-2xl text-foreground">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-xs">hrs</span>
      </div>
      <div className="flex flex-col p-2 bg-muted rounded-lg text-muted-foreground">
        <span className="countdown font-mono text-2xl text-foreground">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-xs">min</span>
      </div>
      <div className="flex flex-col p-2 bg-muted rounded-lg text-muted-foreground">
        <span className="countdown font-mono text-2xl text-foreground">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-xs">sec</span>
      </div>
    </div>
  )
} 