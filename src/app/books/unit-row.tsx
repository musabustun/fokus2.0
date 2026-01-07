"use client"

import { useState } from "react"
import { toggleUnitCompletion } from "./actions"
import { TestForm } from "./test-form"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Plus, Check, FileText } from "lucide-react"

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

interface UnitRowProps {
    unit: BookUnit
}

export function UnitRow({ unit }: UnitRowProps) {
    const [isCompleted, setIsCompleted] = useState(unit.is_completed)
    const [expanded, setExpanded] = useState(false)
    const [showTestForm, setShowTestForm] = useState(false)
    const [editingTest, setEditingTest] = useState<BookTest | null>(null)
    const [loading, setLoading] = useState(false)

    const handleToggleCompletion = async () => {
        setLoading(true)
        const newValue = !isCompleted
        setIsCompleted(newValue)
        try {
            await toggleUnitCompletion(unit.id, newValue)
        } catch (e) {
            setIsCompleted(!newValue) // revert
        } finally {
            setLoading(false)
        }
    }

    const tests = unit.book_tests || []
    const hasTests = tests.length > 0

    // Calculate test statistics
    const totalQuestions = tests.reduce((sum, t) => sum + t.total_questions, 0)
    const correctAnswers = tests.reduce((sum, t) => sum + t.correct_answers, 0)
    const wrongAnswers = tests.reduce((sum, t) => sum + t.wrong_answers, 0)
    const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    return (
        <div className="border-b last:border-b-0">
            <div 
                className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${isCompleted ? 'bg-green-500/5' : ''}`}
            >
                {/* Completion checkbox */}
                <button
                    onClick={handleToggleCompletion}
                    disabled={loading}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-muted-foreground/50 hover:border-primary'
                    }`}
                >
                    {isCompleted && <Check className="w-3 h-3" />}
                </button>

                {/* Unit name */}
                <span className={`flex-1 text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {unit.unit_name}
                </span>

                {/* Test stats badge */}
                {hasTests && (
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">{tests.length} test</span>
                        {totalQuestions > 0 && (
                            <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-green-600">{correctAnswers}D</span>
                                <span className="text-red-600">{wrongAnswers}Y</span>
                                <span className="text-muted-foreground">(%{successRate})</span>
                            </>
                        )}
                    </div>
                )}

                {/* Expand button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="px-3 pb-3 pl-11 space-y-2">
                    {/* Tests list */}
                    {tests.map((test) => (
                        <div 
                            key={test.id}
                            onClick={() => { setEditingTest(test); setShowTestForm(true); }}
                            className="flex items-center gap-2 p-2 rounded bg-muted/30 hover:bg-muted/50 cursor-pointer text-sm"
                        >
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="flex-1">{test.test_name || 'Test'}</span>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-muted-foreground">{test.total_questions}S</span>
                                <span className="text-green-600">{test.correct_answers}D</span>
                                <span className="text-red-600">{test.wrong_answers}Y</span>
                            </div>
                        </div>
                    ))}

                    {/* Add test button or form */}
                    {showTestForm ? (
                        <TestForm
                            unitId={unit.id}
                            test={editingTest || undefined}
                            onClose={() => { setShowTestForm(false); setEditingTest(null); }}
                        />
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setShowTestForm(true)}
                        >
                            <Plus className="h-3 w-3 mr-1" /> Test Ekle
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
