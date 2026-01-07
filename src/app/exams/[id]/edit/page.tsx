import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from "next/navigation"
import { ExamEditForm } from "@/components/exams/exam-edit-form"

interface ExamEditPageProps {
  params: Promise<{ id: string }>
}

export default async function ExamEditPage({ params }: ExamEditPageProps) {
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

  // Transform results to scores format for the form
  const initialScores: Record<string, { correct: number; incorrect: number }> = {}
  
  // Reverse name map
  const reverseNameMap: Record<string, string> = {
    'Türkçe': 'TURKISH',
    'Matematik': 'MATH',
    'Fizik': 'PHYSICS',
    'Kimya': 'CHEMISTRY',
    'Biyoloji': 'BIOLOGY',
    'Tarih': 'HISTORY',
    'Coğrafya': 'GEOGRAPHY',
    'Felsefe': 'PHILOSOPHY',
    'Din Kültürü': 'RELIGION',
    'Edebiyat': 'LITERATURE',
    'Tarih-1': 'HISTORY_1',
    'Tarih-2': 'HISTORY_2',
    'Coğrafya-1': 'GEOGRAPHY_1',
    'Coğrafya-2': 'GEOGRAPHY_2',
    'Felsefe Grubu': 'PHILOSOPHY_GRP'
  }

  results?.forEach((result: any) => {
    const subjectName = result.subjects?.name
    if (subjectName) {
      const key = reverseNameMap[subjectName] || subjectName
      initialScores[key] = {
        correct: result.correct_count,
        incorrect: result.incorrect_count
      }
    }
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <ExamEditForm 
        examId={id} 
        examType={exam.type} 
        initialScores={initialScores} 
      />
    </div>
  )
}
