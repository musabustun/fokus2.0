"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addGoal } from "@/app/goals/actions"
import { Plus, Target } from "lucide-react"

export function AddGoalDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await addGoal(formData)

    if (result?.success) {
      setIsOpen(false)
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Hedef Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Yeni Hedef Oluştur
          </DialogTitle>
          <DialogDescription>
            İlerlemenizi takip etmek ve motive kalmak için bir hedef belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Hedef Başlığı</Label>
            <Input
              id="title"
              name="title"
              placeholder="Örn: 50 Matematik sorusu çöz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (isteğe bağlı)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Hedefinizle ilgili detaylar"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalType">Tür</Label>
              <Select name="goalType" defaultValue="WEEKLY">
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Günlük</SelectItem>
                  <SelectItem value="WEEKLY">Haftalık</SelectItem>
                  <SelectItem value="MONTHLY">Aylık</SelectItem>
                  <SelectItem value="EXAM">Sınav Öncesi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetValue">Hedef Değer (isteğe bağlı)</Label>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                min="1"
                placeholder="Örn: 50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Bitiş Tarihi (isteğe bağlı)</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Oluşturuluyor...' : 'Hedef Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
