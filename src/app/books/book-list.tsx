
"use client"

import { useState } from "react"
import { updateBookProgress, deleteBook } from "./actions"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"

export function BookList({ books }: { books: any[] }) {
  // We can manage local optimism here if we want, or just rely on revalidate
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

function BookCard({ book }: { book: any }) {
    const [progress, setProgress] = useState(book.completed_units)
    const [loading, setLoading] = useState(false)

    const percentage = Math.round((progress / book.total_units) * 100)

    const handleUpdate = async (newVal: number) => {
        if (newVal < 0 || newVal > book.total_units) return
        setLoading(true)
        setProgress(newVal)
        try {
            await updateBookProgress(book.id, newVal)
        } catch (e) {
            // revert
            setProgress(book.completed_units)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if(!confirm("Are you sure?")) return
        setLoading(true)
        await deleteBook(book.id)
    }

    return (
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-md transition-all group relative">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            {book.subjects?.name || 'General'}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{progress} / {book.total_units} units</span>
                    <span className="font-bold text-primary">{percentage}%</span>
                 </div>
                 <Progress value={percentage} className="h-2" />
                 
                 <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdate(progress - 1)} disabled={loading}>
                         <Minus className="h-4 w-4" />
                     </Button>
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdate(progress + 1)} disabled={loading}>
                         <Plus className="h-4 w-4" />
                     </Button>
                 </div>
            </CardContent>
             <button onClick={handleDelete} className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                 <Trash2 className="h-4 w-4" />
             </button>
        </Card>
    )
}
