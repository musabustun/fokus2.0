"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { deleteExam } from "@/app/actions"
import Link from "next/link"

interface ExamActionsProps {
  examId: string
}

export function ExamActions({ examId }: ExamActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteExam(examId)
    if (result?.error) {
      alert("Silme hatası: " + result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <Link href={`/exams/${examId}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Görüntüle
        </Button>
      </Link>
      
      <Link href={`/exams/${examId}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Düzenle
        </Button>
      </Link>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Sil
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sınavı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Sınav ve tüm sonuçları kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
