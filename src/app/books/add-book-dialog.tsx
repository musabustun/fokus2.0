
"use client"

import { useActionState, useState } from "react"
import { addBook } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const SUBJECTS = [
    { label: 'MATEMATİK', value: 'MATH' },
    { label: 'TÜRKÇE', value: 'TURKISH' },
    { label: 'FİZİK', value: 'PHYSICS' },
    { label: 'KİMYA', value: 'CHEMISTRY' },
    { label: 'BİYOLOJİ', value: 'BIOLOGY' },
    { label: 'TARİH', value: 'HISTORY' },
    { label: 'COĞRAFYA', value: 'GEOGRAPHY' },
    { label: 'FELSEFE', value: 'PHILOSOPHY' }
]

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
                    <Plus className="mr-2 h-4 w-4" /> Kitap Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Kitap Ekle</DialogTitle>
                    <DialogDescription>
                        Gelişiminizi takip edin.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4 py-4">
                     {state?.error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">{state.error}</div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Başlık</Label>
                        <Input id="title" name="title" className="col-span-3" placeholder="345 Matematik Kitabı" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">Ders</Label>
                        <div className="col-span-3">
                             <Select name="subject" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ders seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalUnits" className="text-right">Toplam Ünite</Label>
                        <Input id="totalUnits" name="totalUnits" type="number" className="col-span-3" placeholder="Toplam sayfa veya test sayısı" required min="1" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Kaydediliyor...' : 'Kitabı Kaydet'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
