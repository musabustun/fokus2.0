"use client"

import { useState } from "react"
import { deleteBook } from "./actions"
import { UnitRow } from "./unit-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trash2, ChevronDown, ChevronUp, BookOpen } from "lucide-react"

interface BookTest {
    id: string
    test_name: string | null
    total_questions: number
    correct_answers: number
    wrong_answers: number
}

interface BookUnit {
    id: string
    unit_name: string
    unit_order: number
    is_completed: boolean
    book_tests: BookTest[]
}

interface Book {
    id: string
    title: string
    total_units: number
    completed_units: number
    subjects: { name: string } | null
    book_units: BookUnit[]
}

export function BookList({ books }: { books: Book[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    )
}

function BookCard({ book }: { book: Book }) {
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)

    // Sort units by order
    const units = (book.book_units || []).sort((a, b) => a.unit_order - b.unit_order)
    const hasUnits = units.length > 0

    // Calculate progress from units if available, otherwise use legacy completed_units
    const completedUnits = hasUnits 
        ? units.filter(u => u.is_completed).length 
        : book.completed_units

    const totalUnits = hasUnits ? units.length : book.total_units
    const percentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0

    // Calculate overall test statistics
    const allTests = units.flatMap(u => u.book_tests || [])
    const totalQuestions = allTests.reduce((sum, t) => sum + t.total_questions, 0)
    const correctAnswers = allTests.reduce((sum, t) => sum + t.correct_answers, 0)
    const wrongAnswers = allTests.reduce((sum, t) => sum + t.wrong_answers, 0)

    const handleDelete = async () => {
        if (!confirm("Bu kitabı silmek istediğinizden emin misiniz?")) return
        setLoading(true)
        try {
            await deleteBook(book.id)
        } catch (error) {
            console.error('Delete error:', error)
            alert('Kitap silinirken bir hata oluştu.')
            setLoading(false)
        }
    }

    return (
        <Card className={`bg-card/50 backdrop-blur-sm hover:shadow-md transition-all group relative ${expanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {book.subjects?.name || 'Genel'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleDelete} 
                        disabled={loading}
                        className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress section */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {completedUnits} / {totalUnits} ünite tamamlandı
                        </span>
                        <span className="font-bold text-primary">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                </div>

                {/* Test statistics if available */}
                {totalQuestions > 0 && (
                    <div className="flex items-center gap-3 text-xs bg-muted/30 rounded-lg p-2">
                        <span className="text-muted-foreground">Test İstatistikleri:</span>
                        <span className="text-green-600 font-medium">{correctAnswers} Doğru</span>
                        <span className="text-red-600 font-medium">{wrongAnswers} Yanlış</span>
                        <span className="text-muted-foreground">/ {totalQuestions} Soru</span>
                    </div>
                )}

                {/* Expand/collapse button for units */}
                {hasUnits && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-2" /> Üniteleri Gizle
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-2" /> Üniteleri Göster ({units.length})
                            </>
                        )}
                    </Button>
                )}

                {/* Units list */}
                {expanded && hasUnits && (
                    <div className="border rounded-lg overflow-hidden mt-4">
                        {units.map((unit) => (
                            <UnitRow key={unit.id} unit={unit} />
                        ))}
                    </div>
                )}

                {/* Legacy view for books without units */}
                {!hasUnits && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                        Bu kitap için detaylı ünite takibi bulunmuyor.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
