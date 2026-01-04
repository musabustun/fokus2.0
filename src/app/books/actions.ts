'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function addBook(previousState: any, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const totalUnits = parseInt(formData.get('totalUnits') as string)
  const subjectName = formData.get('subject') as string
  const examType = formData.get('examType') as string || 'TYT'

  if (!title || !totalUnits) {
      return { error: "Title and Total Units are required" }
  }

  // Find or Create Subject ID
   const nameMap: Record<string, string> = {
    'TURKISH': 'Türkçe',
    'MATH': 'Matematik',
    'PHYSICS': 'Fizik',
    'CHEMISTRY': 'Kimya',
    'BIOLOGY': 'Biyoloji',
    'HISTORY': 'Tarih',
    'GEOGRAPHY': 'Coğrafya',
    'PHILOSOPHY': 'Felsefe',
    'RELIGION': 'Din Kültürü',
    'LITERATURE': 'Edebiyat',
    'HISTORY_1': 'Tarih-1',
    'HISTORY_2': 'Tarih-2',
    'GEOGRAPHY_1': 'Coğrafya-1',
    'GEOGRAPHY_2': 'Coğrafya-2',
    'PHILOSOPHY_GRP': 'Felsefe Grubu',
    'LANGUAGE': 'Yabancı Dil'
}
  const dbName = nameMap[subjectName] || subjectName

  let { data: subject } = await supabase.from('subjects').select('id').eq('name', dbName).eq('type', examType).single()
  
  if (!subject) {
      const { data: newSubject } = await supabase.from('subjects').insert({ name: dbName, type: examType }).select().single()
      subject = newSubject
  }

  const { error } = await supabase.from('books').insert({
      user_id: user.id,
      title,
      total_units: totalUnits,
      subject_id: subject?.id,
      completed_units: 0
  })

  if (error) return { error: error.message }

  revalidatePath('/books')
  return { success: true }
}

export async function updateBookProgress(bookId: string, newProgress: number) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase
        .from('books')
        .update({ completed_units: newProgress })
        .eq('id', bookId)
    
    if (error) throw new Error(error.message)
    revalidatePath('/books')
}

export async function deleteBook(bookId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)

    if (error) throw new Error(error.message)
    revalidatePath('/books')
}
