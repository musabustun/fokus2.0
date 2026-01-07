
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { ExamActions } from "@/components/exams/exam-actions"

export default async function ExamsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
             try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
              }
        },
      },
    }
  )

  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Sınav Geçmişi</h2>
           <p className="text-muted-foreground">Zaman içindeki ilerlemenizi takip edin.</p>
        </div>
        <Link href="/exams/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
            </Button>
        </Link>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead>Toplam Net</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exams?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                Henüz sınav kaydedilmedi.
                            </TableCell>
                        </TableRow>
                    )}
                    {exams?.map((exam) => (
                        <TableRow key={exam.id}>
                            <TableCell>{new Date(exam.date).toLocaleDateString('tr-TR')}</TableCell>
                            <TableCell>
                                <span className={`font-bold ${exam.type === 'TYT' ? 'text-indigo-500' : 'text-rose-500'}`}>
                                    {exam.type}
                                </span>
                            </TableCell>
                            <TableCell className="font-mono font-medium">{exam.total_net?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell>
                                <ExamActions examId={exam.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
