"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStudySession } from "@/app/study/actions"
import { Clock, BookOpen, Plus } from "lucide-react"

const SUBJECTS = [
  { id: 'general', name: 'General Study' },
  { id: 'turkish', name: 'Turkish' },
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'literature', name: 'Literature' },
]

interface QuickLogProps {
  subjectIdMap?: Record<string, string>
  onSessionAdded?: () => void
}

export function QuickLog({ subjectIdMap = {}, onSessionAdded }: QuickLogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [subject, setSubject] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)
    
    if (totalMinutes <= 0) {
      setMessage("Please enter a valid duration")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('durationMinutes', totalMinutes.toString())
    formData.append('notes', notes)
    
    // Map frontend subject ID to database UUID if available
    if (subject && subject !== 'general' && subjectIdMap[subject]) {
      formData.append('subjectId', subjectIdMap[subject])
    }

    const result = await addStudySession(formData)

    if (result?.error) {
      setMessage(result.error)
    } else {
      setMessage("Session logged successfully!")
      setHours("")
      setMinutes("")
      setSubject("")
      setNotes("")
      onSessionAdded?.()
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Quick Log Study Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="24"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                placeholder="30"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {s.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="What did you study?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {message && (
            <div className={`text-sm p-2 rounded ${message.includes('error') || message.includes('Error') || message.includes('Please') ? 'bg-destructive/15 text-destructive' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging...' : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Log Session
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
