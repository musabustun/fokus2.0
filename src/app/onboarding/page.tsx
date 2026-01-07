'use client'

import { useState } from 'react'
import { updateStudyField } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, Scale, Languages, Check } from "lucide-react"

const fields = [
  { id: 'SAYISAL', label: 'Sayısal', description: 'Matematik & Fen', icon: Calculator, color: 'text-indigo-500' },
  { id: 'ESIT_AGIRLIK', label: 'Eşit Ağırlık', description: 'Türkçe & Matematik', icon: Scale, color: 'text-blue-500' },
  { id: 'SOZEL', label: 'Sözel', description: 'Sosyal Bilimler', icon: BookOpen, color: 'text-rose-500' },
  { id: 'DIL', label: 'Dil', description: 'Yabancı Dil', icon: Languages, color: 'text-orange-500' },
]

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = async (field: string) => {
    if (loading) return // Prevent multiple clicks
    
    setLoading(true)
    setSelectedField(field)
    setError(null)
    
    try {
      await updateStudyField(field)
      // Success - the redirect in updateStudyField will handle navigation
      // Note: redirect() throws an error internally, which is caught below
    } catch (err: any) {
      console.error('Error updating study field:', err)
      
      // Next.js redirect throws an error with digest "NEXT_REDIRECT"
      // This is expected behavior and means the operation was successful
      if (err?.digest?.includes('NEXT_REDIRECT')) {
        // This is actually a success - the redirect is happening
        return
      }
      
      // This is a real error
      setError(err?.message || 'Çalışma alanı güncellenemedi. Lütfen tekrar deneyin.')
      setLoading(false)
      setSelectedField(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Fokus&apos;a Hoş Geldiniz</h1>
          <p className="text-muted-foreground text-lg">Kontrol panelinizi özelleştirmek için çalışma alanınızı seçin.</p>
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field) => {
            const Icon = field.icon
            const isSelected = selectedField === field.id
            const isDisabled = loading
            
            return (
              <Card 
                key={field.id} 
                className={`cursor-pointer transition-all group bg-card/50 backdrop-blur-sm ${
                  isSelected 
                    ? 'border-primary shadow-lg ring-2 ring-primary' 
                    : 'hover:border-primary hover:shadow-lg'
                } ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && handleSelect(field.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors w-min mb-2 relative`}>
                    <Icon className={`w-6 h-6 ${field.color}`} />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
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
