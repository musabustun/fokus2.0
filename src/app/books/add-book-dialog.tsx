
"use client"

import { useActionState, useState } from "react"
import { addBook } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSubjects, TOPICS_BY_SUBJECT } from "@/lib/constants"

const initialState = {
const initialState = {
    error: '',
    success: false
}

export function AddBookDialog({ userField }: { userField?: string }) {
    const [open, setOpen] = useState(false)
    const [examType, setExamType] = useState<string>('TYT')
    const [selectedSubject, setSelectedSubject] = useState<string>('')
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    
    // Reset selections when exam type changes
    const handleExamTypeChange = (value: string) => {
        setExamType(value)
        setSelectedSubject('')
        setSelectedTopics([])
    }

    // Reset topics when subject changes
    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        setSelectedTopics([])
    }

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => 
            prev.includes(topic) 
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        )
    }

    const availableSubjects = getSubjects(examType, userField)
    const availableTopics = selectedSubject && TOPICS_BY_SUBJECT[selectedSubject] ? TOPICS_BY_SUBJECT[selectedSubject] : []

    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        // Append topic count as totalUnits if topics are selected
        if (selectedTopics.length > 0) {
            formData.set('totalUnits', selectedTopics.length.toString())
        }
        
        const res = await addBook(prev, formData)
        if (res?.success) {
            setOpen(false)
            // Reset state
            setExamType('TYT')
            setSelectedSubject('')
            setSelectedTopics([])
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
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Kitap Ekle</DialogTitle>
                    <DialogDescription>
                        Kütüphanenize yeni bir kaynak ekleyin.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-6 py-4">
                     {state?.error && (
                        <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">{state.error}</div>
                    )}
                    
                    {/* Exam Type Selection */}
                    <div className="space-y-2">
                        <Label>Sınav Türü</Label>
                        <Tabs value={examType} onValueChange={handleExamTypeChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="TYT">TYT</TabsTrigger>
                                <TabsTrigger value="AYT">AYT</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Ders</Label>
                        <Select name="subject" value={selectedSubject} onValueChange={handleSubjectChange} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Ders seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSubjects.length > 0 ? (
                                    availableSubjects.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground text-center">Bu alan için uygun ders bulunamadı.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Book Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Kitap Adı</Label>
                        <Input id="title" name="title" placeholder="Örn: 345 Matematik Soru Bankası" required />
                    </div>

                    {/* Topics Selection */}
                    {selectedSubject && availableTopics.length > 0 && (
                        <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <Label>Konular ({selectedTopics.length} seçildi)</Label>
                                <div className="text-xs text-muted-foreground">
                                    Kitapta bulunan konuları seçin
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {availableTopics.map((topic) => (
                                    <div 
                                        key={topic} 
                                        onClick={() => toggleTopic(topic)}
                                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors border ${
                                            selectedTopics.includes(topic) 
                                                ? 'bg-primary/10 border-primary/50' 
                                                : 'hover:bg-muted border-transparent'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                            selectedTopics.includes(topic) 
                                                ? 'bg-primary border-primary text-primary-foreground' 
                                                : 'border-muted-foreground'
                                        }`}>
                                            {selectedTopics.includes(topic) && <Plus className="w-3 h-3" />}
                                        </div>
                                        <span className="text-sm">{topic}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Hidden input for totalUnits if topics are used */}
                            <input type="hidden" name="totalUnits" value={selectedTopics.length} />
                        </div>
                    )}

                    {/* Fallback Total Units Input if no topics available or manually needed */}
                    {(!selectedSubject || availableTopics.length === 0) && (
                        <div className="space-y-2">
                             <Label htmlFor="totalUnits">Toplam Ünite/Test Sayısı</Label>
                             <Input id="totalUnits" name="totalUnits" type="number" placeholder="Sayfa veya test sayısı" required min="1" />
                        </div>
                    )}
                    
                    {/* If topics exist, we still might want to allow override or show valid count */}
                    {selectedSubject && availableTopics.length > 0 && selectedTopics.length === 0 && (
                        <p className="text-xs text-destructive">Lütfen en az bir konu seçin.</p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending || (availableTopics.length > 0 && selectedTopics.length === 0)}>
                            {isPending ? 'Kaydediliyor...' : 'Kitabı Kaydet'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
