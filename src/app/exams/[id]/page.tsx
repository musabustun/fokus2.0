import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Pencil } from "lucide-react"

interface ExamDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { id } = await params
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
          } catch {}
        },
      },
    }
  )

  // Fetch exam details
  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (!exam) {
    notFound()
  }

  // Fetch exam results with subjects
  const { data: results } = await supabase
    .from('exam_results')
    .select(`
      id,
      correct_count,
      incorrect_count,
      subjects (
        id,
        name,
        type
      )
    `)
    .eq('exam_id', id)

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/exams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sınav Detayları</h2>
            <p className="text-muted-foreground">
              {new Date(exam.date).toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <Link href={`/exams/${id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" /> Düzenle
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sınav Türü</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${exam.type === 'TYT' ? 'text-indigo-500' : 'text-rose-500'}`}>
              {exam.type}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Net</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{exam.total_net?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ders Sayısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Ders Bazlı Sonuçlar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ders</TableHead>
                <TableHead className="text-center">Doğru</TableHead>
                <TableHead className="text-center">Yanlış</TableHead>
                <TableHead className="text-center">Boş</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Bu sınav için sonuç kaydedilmedi.
                  </TableCell>
                </TableRow>
              ) : (
                results?.map((result: any) => {
                  const net = result.correct_count - (result.incorrect_count * 0.25)
                  return (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.subjects?.name || 'Bilinmeyen'}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{result.correct_count}</TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{result.incorrect_count}</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        <span className={net >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {net.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
