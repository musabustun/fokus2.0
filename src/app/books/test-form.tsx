"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addTestToUnit, updateTest, deleteTest } from "./actions"
import { Trash2, X, Check } from "lucide-react"

interface TestFormProps {
    unitId: string
    test?: {
        id: string
        test_name: string | null
        total_questions: number
        correct_answers: number
        wrong_answers: number
    }
    onClose: () => void
}

export function TestForm({ unitId, test, onClose }: TestFormProps) {
    const [loading, setLoading] = useState(false)
    const [testName, setTestName] = useState(test?.test_name || '')
    const [totalQuestions, setTotalQuestions] = useState(test?.total_questions?.toString() || '')
    const [correctAnswers, setCorrectAnswers] = useState(test?.correct_answers?.toString() || '')
    const [wrongAnswers, setWrongAnswers] = useState(test?.wrong_answers?.toString() || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const total = parseInt(totalQuestions) || 0
        const correct = parseInt(correctAnswers) || 0
        const wrong = parseInt(wrongAnswers) || 0

        try {
            if (test) {
                await updateTest(test.id, {
                    test_name: testName || undefined,
                    total_questions: total,
                    correct_answers: correct,
                    wrong_answers: wrong
                })
            } else {
                await addTestToUnit(unitId, {
                    test_name: testName || undefined,
                    total_questions: total,
                    correct_answers: correct,
                    wrong_answers: wrong
                })
            }
            onClose()
        } catch (e) {
            console.error('Error saving test:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!test || !confirm('Bu testi silmek istediğinizden emin misiniz?')) return
        setLoading(true)
        try {
            await deleteTest(test.id)
            onClose()
        } catch (e) {
            console.error('Error deleting test:', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-muted/30 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                    {test ? 'Testi Düzenle' : 'Yeni Test Ekle'}
                </h4>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <Label htmlFor="testName" className="text-xs">Test Adı (Opsiyonel)</Label>
                    <Input
                        id="testName"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="Örn: Deneme 1"
                        className="h-8 text-sm"
                    />
                </div>
                <div>
                    <Label htmlFor="totalQuestions" className="text-xs">Toplam Soru</Label>
                    <Input
                        id="totalQuestions"
                        type="number"
                        min="0"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(e.target.value)}
                        placeholder="0"
                        className="h-8 text-sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="correctAnswers" className="text-xs text-green-600">Doğru</Label>
                        <Input
                            id="correctAnswers"
                            type="number"
                            min="0"
                            value={correctAnswers}
                            onChange={(e) => setCorrectAnswers(e.target.value)}
                            placeholder="0"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div>
                        <Label htmlFor="wrongAnswers" className="text-xs text-red-600">Yanlış</Label>
                        <Input
                            id="wrongAnswers"
                            type="number"
                            min="0"
                            value={wrongAnswers}
                            onChange={(e) => setWrongAnswers(e.target.value)}
                            placeholder="0"
                            className="h-8 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2">
                {test && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Sil
                    </Button>
                )}
                <div className="flex gap-2 ml-auto">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                        İptal
                    </Button>
                    <Button type="submit" size="sm" disabled={loading}>
                        <Check className="h-4 w-4 mr-1" />
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
