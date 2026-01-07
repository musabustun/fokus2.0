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
  const topicsJson = formData.get('topics') as string

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

  const { data: book, error } = await supabase.from('books').insert({
      user_id: user.id,
      title,
      total_units: totalUnits,
      subject_id: subject?.id,
      completed_units: 0
  }).select().single()

  if (error) return { error: error.message }

  // Create book units if topics were provided
  if (topicsJson && book) {
      try {
          const topics = JSON.parse(topicsJson) as string[]
          if (topics.length > 0) {
              const units = topics.map((name, index) => ({
                  book_id: book.id,
                  unit_name: name,
                  unit_order: index,
                  is_completed: false
              }))
              await supabase.from('book_units').insert(units)
          }
      } catch (e) {
          // Ignore parse errors, just don't create units
      }
  }

  revalidatePath('/books')
  return { success: true, bookId: book?.id }
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // First get all unit IDs for this book to delete their tests
    const { data: units } = await supabase
        .from('book_units')
        .select('id')
        .eq('book_id', bookId)

    // Delete all tests associated with the book's units
    if (units && units.length > 0) {
        const unitIds = units.map(u => u.id)
        const { error: testsError } = await supabase
            .from('book_tests')
            .delete()
            .in('unit_id', unitIds)
        
        if (testsError) return { error: testsError.message }
    }

    // Delete all units for this book
    const { error: unitsError } = await supabase
        .from('book_units')
        .delete()
        .eq('book_id', bookId)

    if (unitsError) return { error: unitsError.message }

    // Finally delete the book itself
    const { error: bookError } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)
        .eq('user_id', user.id) // Ensure user owns this book

    if (bookError) return { error: bookError.message }
    
    revalidatePath('/books')
    revalidatePath('/')
    return { success: true }
}

// Create book units when a book is added with topics
export async function createBookUnits(bookId: string, unitNames: string[]) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const units = unitNames.map((name, index) => ({
        book_id: bookId,
        unit_name: name,
        unit_order: index,
        is_completed: false
    }))

    const { error } = await supabase.from('book_units').insert(units)
    if (error) throw new Error(error.message)
    
    revalidatePath('/books')
}

// Toggle unit completion status
export async function toggleUnitCompletion(unitId: string, isCompleted: boolean) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase
        .from('book_units')
        .update({ is_completed: isCompleted })
        .eq('id', unitId)

    if (error) throw new Error(error.message)
    revalidatePath('/books')
}

// Add a test to a unit
export async function addTestToUnit(unitId: string, testData: {
    test_name?: string
    total_questions: number
    correct_answers: number
    wrong_answers: number
}) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase.from('book_tests').insert({
        unit_id: unitId,
        test_name: testData.test_name || null,
        total_questions: testData.total_questions,
        correct_answers: testData.correct_answers,
        wrong_answers: testData.wrong_answers
    })

    if (error) throw new Error(error.message)
    revalidatePath('/books')
}

// Update an existing test
export async function updateTest(testId: string, testData: {
    test_name?: string
    total_questions: number
    correct_answers: number
    wrong_answers: number
}) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase
        .from('book_tests')
        .update({
            test_name: testData.test_name || null,
            total_questions: testData.total_questions,
            correct_answers: testData.correct_answers,
            wrong_answers: testData.wrong_answers
        })
        .eq('id', testId)

    if (error) throw new Error(error.message)
    revalidatePath('/books')
}

// Delete a test
export async function deleteTest(testId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { error } = await supabase
        .from('book_tests')
        .delete()
        .eq('id', testId)

    if (error) throw new Error(error.message)
    revalidatePath('/books')
}
