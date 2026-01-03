'use client'

import { updateStudyField } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, Scale, Languages } from "lucide-react"

const fields = [
  { id: 'SAYISAL', label: 'Sayısal', description: 'Math & Science', icon: Calculator, color: 'text-indigo-500' },
  { id: 'ESIT_AGIRLIK', label: 'Eşit Ağırlık', description: 'Turkish & Math', icon: Scale, color: 'text-blue-500' },
  { id: 'SOZEL', label: 'Sözel', description: 'Social Sciences', icon: BookOpen, color: 'text-rose-500' },
  { id: 'DIL', label: 'Dil', description: 'Foreign Language', icon: Languages, color: 'text-orange-500' },
]

export default function OnboardingPage() {
  const handleSelect = async (field: string) => {
    await updateStudyField(field)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to YKS Tracker</h1>
          <p className="text-muted-foreground text-lg">Select your study field to customize your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field) => {
            const Icon = field.icon
            return (
              <Card 
                key={field.id} 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group bg-card/50 backdrop-blur-sm"
                onClick={() => handleSelect(field.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors w-min mb-2`}>
                    <Icon className={`w-6 h-6 ${field.color}`} />
                  </div>
                  <CardTitle className="text-lg">{field.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  {field.description}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
