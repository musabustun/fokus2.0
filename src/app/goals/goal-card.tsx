"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { updateGoalProgress, toggleGoalComplete, deleteGoal } from "./actions"
import { Check, Trash2, Target, Calendar, Plus, Minus } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string | null
  goal_type: string
  target_value: number | null
  current_value: number
  is_completed: boolean
  due_date: string | null
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentValue, setCurrentValue] = useState(goal.current_value || 0)

  const progress = goal.target_value 
    ? Math.min((currentValue / goal.target_value) * 100, 100)
    : 0

  const handleProgressChange = async (delta: number) => {
    const newValue = Math.max(0, currentValue + delta)
    setCurrentValue(newValue)
    setIsUpdating(true)
    await updateGoalProgress(goal.id, newValue)
    setIsUpdating(false)
  }

  const handleToggleComplete = async () => {
    setIsUpdating(true)
    await toggleGoalComplete(goal.id, !goal.is_completed)
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      await deleteGoal(goal.id)
    }
  }

  const typeColors: Record<string, string> = {
    DAILY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    WEEKLY: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    MONTHLY: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    EXAM: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  const typeLabels: Record<string, string> = {
    DAILY: 'GÜNLÜK',
    WEEKLY: 'HAFTALIK',
    MONTHLY: 'AYLIK',
    EXAM: 'SINAV',
  }

  return (
    <Card className={`transition-all ${goal.is_completed ? 'opacity-60 bg-muted/30' : 'bg-card/50 backdrop-blur-sm'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={`text-base ${goal.is_completed ? 'line-through' : ''}`}>
              {goal.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={typeColors[goal.goal_type] || ''}>
                {typeLabels[goal.goal_type] || goal.goal_type}
              </Badge>
              {goal.due_date && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(goal.due_date).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleComplete}
              disabled={isUpdating}
            >
              <Check className={`h-4 w-4 ${goal.is_completed ? 'text-green-600' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {goal.description && (
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        )}
        
        {goal.target_value && !goal.is_completed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{currentValue} / {goal.target_value}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleProgressChange(-1)}
                disabled={isUpdating || currentValue <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseInt(e.target.value) || 0)}
                className="h-8 text-center"
                min={0}
                max={goal.target_value}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleProgressChange(1)}
                disabled={isUpdating}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {goal.is_completed && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Tamamlandı!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
