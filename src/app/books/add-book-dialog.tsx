
"use client"

import { useActionState, useState } from "react"
import { addBook } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const SUBJECTS = ['MATH', 'TURKISH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'HISTORY', 'GEOGRAPHY', 'PHILOSOPHY']

const initialState = {
    error: '',
    success: false
}

export function AddBookDialog() {
    const [open, setOpen] = useState(false)
    // Custom wrapper to handle closing dialog on success
    // Since useActionState doesn't easily give us a callback on success inside the component logic without effect
    // We will just assume if no error, it worked, or we can use a separate submitted state.
    
    // Actually, let's use a wrapper function for the action
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const res = await addBook(prev, formData)
        if (res?.success) {
            setOpen(false)
            return { success: true, error: '' }
        }
        return res
    }, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Book
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>
                        Track your progress.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4 py-4">
                     {state?.error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">{state.error}</div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" name="title" className="col-span-3" placeholder="345 Math Book" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">Subject</Label>
                        <div className="col-span-3">
                             <Select name="subject" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalUnits" className="text-right">Total Units</Label>
                        <Input id="totalUnits" name="totalUnits" type="number" className="col-span-3" placeholder="Total pages or tests" required min="1" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Book'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
