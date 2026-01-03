
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BookOpen, Target, Calendar } from "lucide-react"

export interface StatsCardsProps {
  tytAvg: number | null
  aytAvg: number | null
  totalQuestions: number
  daysLeft: number
}

export function StatsCards({ tytAvg, aytAvg, totalQuestions, daysLeft }: StatsCardsProps) {
  return (
    <>
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">TYT Average Net</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tytAvg ? tytAvg.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground">All time average</p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AYT Average Net</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aytAvg ? aytAvg.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground">All time average</p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Units Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-xs text-muted-foreground">Total from books</p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Left</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysLeft}</div>
          <p className="text-xs text-muted-foreground">Until YKS 2025</p>
        </CardContent>
      </Card>
    </>
  )
}
