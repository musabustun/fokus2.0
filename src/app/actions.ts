'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function login(previousState: any, formData: FormData) {
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

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(previousState: any, formData: FormData) {
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

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to verify email page instead of auto-login
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function updateStudyField(studyField: string) {
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

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      study_field: studyField,
      full_name: user.user_metadata.full_name,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resendVerificationEmail(email: string) {
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function saveExam(previousState: any, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const examType = formData.get('examType') as string
  const scoresRaw = formData.get('scores') as string
  
  let scores: Record<string, { correct: number; incorrect: number }> = {};
  if (scoresRaw) {
    try {
        scores = JSON.parse(scoresRaw)
    } catch (e) {
        return { error: "Invalid scores data" }
    }
  }

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
      'PHILOSOPHY_GRP': 'Felsefe Grubu'
  }

  // 1. Calculate total_net BEFORE creating exam
  let totalNet = 0
  const validScores: Array<{ subjectKey: string; correct: number; incorrect: number }> = []
  
  for (const [subjectKey, score] of Object.entries(scores)) {
      if (!score.correct && !score.incorrect) continue;
      const correct = score.correct || 0
      const incorrect = score.incorrect || 0
      totalNet += (correct - (incorrect * 0.25))
      validScores.push({ subjectKey, correct, incorrect })
  }

  // 2. Create Exam with total_net included
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({ 
      user_id: user.id, 
      type: examType, 
      date: new Date().toISOString(),
      total_net: totalNet  // Include total_net on insert!
    })
    .select()
    .single()

  if (examError) return { error: examError.message }

  // 3. Process Results - get/create subjects and prepare inserts
  const resultsToInsert = []
  
  for (const { subjectKey, correct, incorrect } of validScores) {
      const dbName = nameMap[subjectKey] || subjectKey
      
      // Get or Create Subject
      let { data: subject, error: fetchError } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', dbName)
        .eq('type', examType)
        .single()
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
          return { error: `Error fetching subject ${dbName}: ${fetchError.message}` }
      }

      if (!subject) {
          const { data: newSubject, error: createError } = await supabase
            .from('subjects')
            .insert({ name: dbName, type: examType })
            .select()
            .single()
          
          if (createError) {
              return { error: `Error creating subject ${dbName}: ${createError.message}` }
          }
          subject = newSubject
      }
      
      if (subject) {
         resultsToInsert.push({
             exam_id: exam.id,
             subject_id: subject.id,
             correct_count: correct,
             incorrect_count: incorrect
         })
      }
  }

  // 4. Insert exam results
  if (resultsToInsert.length > 0) {
      const { error: resultsError } = await supabase.from('exam_results').insert(resultsToInsert)
      if (resultsError) return { error: resultsError.message }
  }

  revalidatePath('/exams')
  revalidatePath('/')
  redirect('/exams')
}

export async function deleteExam(examId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Delete exam results first (foreign key constraint)
  const { error: resultsError } = await supabase
    .from('exam_results')
    .delete()
    .eq('exam_id', examId)
  
  if (resultsError) return { error: resultsError.message }

  // Then delete the exam
  const { error: examError } = await supabase
    .from('exams')
    .delete()
    .eq('id', examId)
    .eq('user_id', user.id) // Ensure user owns this exam
  
  if (examError) return { error: examError.message }

  revalidatePath('/exams')
  revalidatePath('/')
  return { success: true }
}

export async function updateExamResults(
  examId: string, 
  examType: string,
  scores: Record<string, { correct: number; incorrect: number }>
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

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
      'PHILOSOPHY_GRP': 'Felsefe Grubu'
  }

  // Delete existing results
  const { error: deleteError } = await supabase
    .from('exam_results')
    .delete()
    .eq('exam_id', examId)

  if (deleteError) return { error: deleteError.message }

  // Calculate new total and prepare results
  let totalNet = 0
  const resultsToInsert = []

  for (const [subjectKey, score] of Object.entries(scores)) {
    if (!score.correct && !score.incorrect) continue
    const correct = score.correct || 0
    const incorrect = score.incorrect || 0
    totalNet += (correct - (incorrect * 0.25))

    const dbName = nameMap[subjectKey] || subjectKey
    
    let { data: subject } = await supabase
      .from('subjects')
      .select('id')
      .eq('name', dbName)
      .eq('type', examType)
      .single()

    if (!subject) {
      const { data: newSubject, error: createError } = await supabase
        .from('subjects')
        .insert({ name: dbName, type: examType })
        .select()
        .single()
      if (createError) return { error: createError.message }
      subject = newSubject
    }

    if (subject) {
      resultsToInsert.push({
        exam_id: examId,
        subject_id: subject.id,
        correct_count: correct,
        incorrect_count: incorrect
      })
    }
  }

  // Insert new results
  if (resultsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('exam_results')
      .insert(resultsToInsert)
    if (insertError) return { error: insertError.message }
  }

  // Update exam total_net
  const { error: updateError } = await supabase
    .from('exams')
    .update({ total_net: totalNet })
    .eq('id', examId)
    .eq('user_id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/exams')
  revalidatePath(`/exams/${examId}`)
  revalidatePath('/')
  return { success: true }
}
