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
  
  let scores = {};
  if (scoresRaw) {
    try {
        scores = JSON.parse(scoresRaw)
    } catch (e) {
        return { error: "Invalid scores data" }
    }
  }

  // 1. Create Exam
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({ user_id: user.id, type: examType, date: new Date().toISOString() })
    .select()
    .single()

  if (examError) return { error: examError.message }

  // 2. Process Results
  const resultsToInsert = []
  
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
  
  for (const [subjectKey, score] of Object.entries(scores) as any) {
      if (!score.correct && !score.incorrect) continue;
      
      const dbName = nameMap[subjectKey] || subjectKey
      
      // Get or Create Subject
      let { data: subject } = await supabase.from('subjects').select('id').eq('name', dbName).eq('type', examType).single()
      
      if (!subject) {
          const { data: newSubject } = await supabase.from('subjects').insert({ name: dbName, type: examType }).select().single()
          subject = newSubject
      }
      
      if (subject) {
         resultsToInsert.push({
             exam_id: exam.id,
             subject_id: subject.id,
             correct_count: score.correct,
             incorrect_count: score.incorrect
         })
      }
  }

  if (resultsToInsert.length > 0) {
      const { error: resultsError } = await supabase.from('exam_results').insert(resultsToInsert)
      if (resultsError) return { error: resultsError.message }
  }

  // Calculate Total Net and Update Exam
  let totalNet = 0
  resultsToInsert.forEach(r => {
      totalNet += (r.correct_count - (r.incorrect_count * 0.25))
  })
  
  await supabase.from('exams').update({ total_net: totalNet }).eq('id', exam.id)

  revalidatePath('/exams')
  revalidatePath('/')
  redirect('/exams')
}
