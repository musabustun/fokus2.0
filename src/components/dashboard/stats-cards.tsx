
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BookOpen, Target, Calendar, Clock } from "lucide-react"

export interface StatsCardsProps {
  tytAvg: number | null
  aytAvg: number | null
  totalQuestions: number
  daysLeft: number
  todayStudyMinutes?: number
}

export function StatsCards({ tytAvg, aytAvg, totalQuestions, daysLeft, todayStudyMinutes = 0 }: StatsCardsProps) {
  const studyHours = Math.floor(todayStudyMinutes / 60)
  const studyMins = todayStudyMinutes % 60

  return (
    <>
      <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Study</CardTitle>
          <Clock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {studyHours > 0 ? `${studyHours}h ` : ''}{studyMins}m
          </div>
          <p className="text-xs text-muted-foreground">Keep going!</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">TYT Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tytAvg ? tytAvg.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground">Net score</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AYT Average</CardTitle>
          <Target className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aytAvg ? aytAvg.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground">Net score</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Units Done</CardTitle>
          <BookOpen className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-xs text-muted-foreground">From books</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 shadow-sm hover:shadow-md transition-all">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Left</CardTitle>
          <Calendar className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysLeft}</div>
          <p className="text-xs text-muted-foreground">Until YKS 2026</p>
        </CardContent>
      </Card>
    </>
  )
}
