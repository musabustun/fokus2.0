"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Target, BookOpen } from "lucide-react"

interface DailySummaryProps {
  totalMinutes: number
  sessionCount: number
  goalMinutes?: number
  subjectBreakdown: { subject: string; minutes: number }[]
}

export function DailySummary({ 
  totalMinutes, 
  sessionCount, 
  goalMinutes = 480, // 8 hours default
  subjectBreakdown 
}: DailySummaryProps) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const progressPercent = Math.min((totalMinutes / goalMinutes) * 100, 100)
  const goalHours = Math.floor(goalMinutes / 60)

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today&apos;s Progress
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {sessionCount} session{sessionCount !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-primary">
            {hours}h {minutes}m
          </span>
          <span className="text-muted-foreground pb-1">
            / {goalHours}h goal
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Goal Progress</span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {subjectBreakdown.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subject Breakdown
            </h4>
            <div className="grid gap-2">
              {subjectBreakdown.map((item) => {
                const subjectHours = Math.floor(item.minutes / 60)
                const subjectMins = item.minutes % 60
                return (
                  <div 
                    key={item.subject} 
                    className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm font-medium">{item.subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {subjectHours > 0 ? `${subjectHours}h ` : ''}{subjectMins}m
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalMinutes === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No study sessions logged today.</p>
            <p className="text-xs">Start studying to see your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
