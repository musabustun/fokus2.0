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

export async function addGoal(formData: FormData) {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const goalType = formData.get('goalType') as string
  const targetValue = parseInt(formData.get('targetValue') as string) || null
  const dueDate = formData.get('dueDate') as string || null

  if (!title) {
    return { error: 'Title is required' }
  }

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    title,
    description: description || null,
    goal_type: goalType || 'DAILY',
    target_value: targetValue,
    due_date: dueDate,
  })

  if (error) return { error: error.message }

  revalidatePath('/goals')
  return { success: true }
}

export async function getGoals() {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { goals: [], error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { goals: [], error: error.message }
  return { goals: data || [] }
}

export async function updateGoalProgress(goalId: string, newProgress: number) {
  const supabase = await getSupabase()
  
  // First get the goal to check target_value
  const { data: goal } = await supabase
    .from('goals')
    .select('target_value')
    .eq('id', goalId)
    .single()

  const isCompleted = goal?.target_value ? newProgress >= goal.target_value : false

  const { error } = await supabase
    .from('goals')
    .update({ 
      current_value: newProgress,
      is_completed: isCompleted 
    })
    .eq('id', goalId)

  if (error) return { error: error.message }

  revalidatePath('/goals')
  return { success: true }
}

export async function toggleGoalComplete(goalId: string, isCompleted: boolean) {
  const supabase = await getSupabase()
  
  const { error } = await supabase
    .from('goals')
    .update({ is_completed: isCompleted })
    .eq('id', goalId)

  if (error) return { error: error.message }

  revalidatePath('/goals')
  return { success: true }
}

export async function deleteGoal(goalId: string) {
  const supabase = await getSupabase()
  
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)

  if (error) return { error: error.message }

  revalidatePath('/goals')
  return { success: true }
}
