"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveExam } from "@/app/actions"
import { useActionState } from "react"
// import { toast } from "sonner" // Assuming sonner or toast is available, but maybe not installed yet.

const TYT_SUBJECTS = [
  { id: 'TURKISH', name: 'Türkçe', max: 40 },
  { id: 'MATH', name: 'Matematik', max: 40 },
  { id: 'PHYSICS', name: 'Fizik', max: 7 },
  { id: 'CHEMISTRY', name: 'Kimya', max: 7 },
  { id: 'BIOLOGY', name: 'Biyoloji', max: 6 },
  { id: 'HISTORY', name: 'Tarih', max: 5 },
  { id: 'GEOGRAPHY', name: 'Coğrafya', max: 5 },
  { id: 'PHILOSOPHY', name: 'Felsefe', max: 5 },
  { id: 'RELIGION', name: 'Din Kültürü', max: 5 },
]

const AYT_SUBJECTS = [
  { id: 'MATH', name: 'Matematik', max: 40 },
  { id: 'PHYSICS', name: 'Fizik', max: 14 },
  { id: 'CHEMISTRY', name: 'Kimya', max: 13 },
  { id: 'BIOLOGY', name: 'Biyoloji', max: 13 },
  { id: 'LITERATURE', name: 'Edebiyat', max: 24 },
  { id: 'HISTORY_1', name: 'Tarih-1', max: 10 },
  { id: 'GEOGRAPHY_1', name: 'Coğrafya-1', max: 6 },
  { id: 'HISTORY_2', name: 'Tarih-2', max: 11 },
  { id: 'GEOGRAPHY_2', name: 'Coğrafya-2', max: 11 },
  { id: 'PHILOSOPHY_GRP', name: 'Felsefe Grubu', max: 12 },
  { id: 'RELIGION', name: 'Din Kültürü', max: 6 },
]

export function ExamForm() {
  const [examType, setExamType] = useState<"TYT" | "AYT">("TYT")
  const [scores, setScores] = useState<Record<string, { correct: number; incorrect: number }>>({})

  // Constants based on type
  const subjects = examType === "TYT" ? TYT_SUBJECTS : AYT_SUBJECTS

  const handleScoreChange = (subjectId: string, field: 'correct' | 'incorrect', value: string) => {
    const numValue = parseInt(value) || 0
    setScores(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: numValue
      }
    }))
  }

  const calculateNet = (correct: number, incorrect: number) => {
    return correct - (incorrect / 4)
  }

  const totalNet = subjects.reduce((acc, subject) => {
    const score = scores[subject.id] || { correct: 0, incorrect: 0 }
    return acc + calculateNet(score.correct, score.incorrect)
  }, 0)

  // Server Action Wrapper
  const handleSubmit = async (formData: FormData) => {
      // Append complex data to formData manually or send generic fields
      // Since native FormData handles simplistic inputs, we might want to serialize scores
      formData.append('examType', examType)
      formData.append('scores', JSON.stringify(scores))
      
      const result = await saveExam(null, formData)
      if (result?.error) {
          alert("Error saving exam: " + result.error) // Basic feedback
      } else {
        // Success feedback? The action redirects, so maybe not needed here if redirect happens fast
      }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Yeni Deneme Sınavı Sonucu Ekle</CardTitle>
        <CardDescription>Net puanınızı hesaplamak için doğru ve yanlış sayılarınızı girin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Tabs value={examType} onValueChange={(v) => setExamType(v as any)} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="TYT">TYT (Temel)</TabsTrigger>
                    <TabsTrigger value="AYT">AYT (Alan)</TabsTrigger>
                </TabsList>
                </Tabs>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Toplam Net</div>
                    <div className="text-4xl font-bold text-primary">{totalNet.toFixed(2)}</div>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => {
                        const score = scores[subject.id] || { correct: 0, incorrect: 0 }
                        const net = calculateNet(score.correct, score.incorrect)
                        
                        return (
                            <Card key={subject.id} className="border-muted bg-muted/20">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm font-medium">{subject.name}</CardTitle>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${net >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                                            {net.toFixed(2)} Net
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor={`${subject.id}-correct`} className="text-xs text-muted-foreground">Doğru</Label>
                                        <Input 
                                            id={`${subject.id}-correct`}
                                            type="number" 
                                            min={0} 
                                            max={subject.max}
                                            className="h-8"
                                            value={score.correct || ''}
                                            onChange={(e) => handleScoreChange(subject.id, 'correct', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                         <Label htmlFor={`${subject.id}-incorrect`} className="text-xs text-muted-foreground">Yanlış</Label>
                                        <Input 
                                            id={`${subject.id}-incorrect`}
                                            type="number" 
                                            min={0} 
                                            max={subject.max} // Technically correct + incorrect <= max, but loose validation for now
                                            className="h-8"
                                            value={score.incorrect || ''}
                                            onChange={(e) => handleScoreChange(subject.id, 'incorrect', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" className="px-8">
                        Sınav Sonucunu Kaydet
                    </Button>
                </div>
            </form>
        </div>
      </CardContent>
    </Card>
  )
}
