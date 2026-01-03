'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
}

export async function addStudySession(formData: FormData) {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const subjectId = formData.get('subjectId') as string | null
  const durationMinutes = parseInt(formData.get('durationMinutes') as string)
  const notes = formData.get('notes') as string
  const sessionDate = formData.get('sessionDate') as string || new Date().toISOString().split('T')[0]

  if (!durationMinutes || durationMinutes <= 0) {
    return { error: 'Duration must be greater than 0' }
  }

  const { error } = await supabase.from('study_sessions').insert({
    user_id: user.id,
    subject_id: subjectId || null,
    duration_minutes: durationMinutes,
    notes: notes || null,
    session_date: sessionDate,
  })

  if (error) return { error: error.message }

  revalidatePath('/study')
  revalidatePath('/')
  return { success: true }
}

export async function getStudySessions(startDate?: string, endDate?: string) {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { sessions: [], error: 'Not authenticated' }

  let query = supabase
    .from('study_sessions')
    .select('*, subjects(name)')
    .eq('user_id', user.id)
    .order('session_date', { ascending: false })

  if (startDate) {
    query = query.gte('session_date', startDate)
  }
  if (endDate) {
    query = query.lte('session_date', endDate)
  }

  const { data, error } = await query

  if (error) return { sessions: [], error: error.message }
  return { sessions: data || [] }
}

export async function getTodayStats() {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { totalMinutes: 0, sessionCount: 0, subjectBreakdown: [] }

  const today = new Date().toISOString().split('T')[0]

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes, subjects(name)')
    .eq('user_id', user.id)
    .eq('session_date', today)

  if (!sessions || sessions.length === 0) {
    return { totalMinutes: 0, sessionCount: 0, subjectBreakdown: [] }
  }

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0)
  
  // Group by subject
  const subjectMap: Record<string, number> = {}
  sessions.forEach((s: any) => {
    const subjectName = s.subjects?.name || 'General'
    subjectMap[subjectName] = (subjectMap[subjectName] || 0) + s.duration_minutes
  })

  const subjectBreakdown = Object.entries(subjectMap).map(([subject, minutes]) => ({
    subject,
    minutes,
  }))

  return {
    totalMinutes,
    sessionCount: sessions.length,
    subjectBreakdown,
  }
}

export async function deleteStudySession(sessionId: string) {
  const supabase = await getSupabase()
  
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) return { error: error.message }

  revalidatePath('/study')
  revalidatePath('/')
  return { success: true }
}
