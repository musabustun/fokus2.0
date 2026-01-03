"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine, BookOpen, Target, ClipboardList, TrendingUp } from "lucide-react"

const actions = [
  {
    label: "Log Study",
    href: "/study",
    icon: PenLine,
    color: "text-green-500",
    bgColor: "bg-green-500/10 hover:bg-green-500/20",
    description: "Track study time"
  },
  {
    label: "Add Exam",
    href: "/exams/new",
    icon: ClipboardList,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
    description: "Record results"
  },
  {
    label: "Add Book",
    href: "/books",
    icon: BookOpen,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
    description: "Track resources"
  },
  {
    label: "Set Goal",
    href: "/goals",
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
    description: "Create targets"
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.label} href={action.href}>
            <Card className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${action.bgColor} border-transparent`}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full bg-background/50">
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
