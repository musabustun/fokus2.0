
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { NetProgressionChart } from "@/components/analytics/net-progression-chart"
import { SubjectRadar } from "@/components/analytics/subject-radar"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  // Parallel fetch for initial data
  const [
      { data: { user } }, 
      { data: books }, 
      { data: exams }, 
      { data: results }
  ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('books').select('completed_units'),
      supabase.from('exams').select('*').order('date', { ascending: true }),
      supabase.from('exam_results').select('*, subjects(name)')
  ])

  // Fetch today's study sessions (dependent on user)
  const today = new Date().toISOString().split('T')[0]
  const { data: todaySessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('user_id', user?.id)
    .eq('session_date', today)
  
  const todayStudyMinutes = todaySessions?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0
  
  // Calculate Stats
  const tytExams = exams?.filter(e => e.type === 'TYT') || []
  const aytExams = exams?.filter(e => e.type === 'AYT') || []
  
  const tytAvg = tytExams.length > 0 
    ? tytExams.reduce((acc, curr) => acc + (curr.total_net || 0), 0) / tytExams.length 
    : 0
    
  const aytAvg = aytExams.length > 0 
    ? aytExams.reduce((acc, curr) => acc + (curr.total_net || 0), 0) / aytExams.length 
    : 0
    
  const totalUnits = books?.reduce((acc, curr) => acc + (curr.completed_units || 0), 0) || 0
  
  // Days Left Logic (Target: June 14, 2026 - YKS 2026)
  const targetDate = new Date('2026-06-14')
  const todayDate = new Date()
  const daysLeft = Math.max(0, Math.ceil((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)))

  // Recent Activity (Last 5 exams)
  const recentExams = [...(exams || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  // Process Net Progression Data
  const progressionData = exams?.map(e => ({
      date: new Date(e.date).toLocaleDateString('tr-TR'),
      TYT: e.type === 'TYT' ? e.total_net : null,
      AYT: e.type === 'AYT' ? e.total_net : null,
  })) || []

  // Process Radar Data - Calculate percentage (net / total_questions * 100)
  // Total questions per subject for TYT and AYT exams
  const subjectMaxQuestions: Record<string, number> = {
    'Türkçe': 40,
    'Matematik': 40,
    'Fizik': 14, // AYT max (TYT is 7)
    'Kimya': 13, // AYT max (TYT is 7)
    'Biyoloji': 13, // AYT max (TYT is 6)
    'Tarih': 10, // AYT Tarih-1 max (TYT is 5)
    'Tarih-1': 10,
    'Tarih-2': 11,
    'Coğrafya': 11, // AYT Coğrafya-2 max (TYT is 5)
    'Coğrafya-1': 6,
    'Coğrafya-2': 11,
    'Felsefe': 5,
    'Felsefe Grubu': 12,
    'Din Kültürü': 6,
    'Edebiyat': 24,
  }

  const subjectStats: Record<string, { totalNet: number, totalMax: number, count: number }> = {}
  
  results?.forEach(r => {
      const subjectName = r.subjects?.name || 'Bilinmiyor'
      const maxQuestions = subjectMaxQuestions[subjectName] || 40
      
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = { totalNet: 0, totalMax: 0, count: 0 }
      }
      
      const net = r.correct_count - (r.incorrect_count * 0.25)
      subjectStats[subjectName].totalNet += net
      subjectStats[subjectName].totalMax += maxQuestions
      subjectStats[subjectName].count += 1
  })

  const radarData = Object.entries(subjectStats).map(([subject, stats]) => {
      const avgNet = stats.totalNet / stats.count
      const maxQuestions = subjectMaxQuestions[subject] || 40
      const percentage = Math.round((avgNet / maxQuestions) * 100)
      return {
          subject,
          score: Math.max(0, Math.min(100, percentage)), // Clamp between 0-100
          fullMark: 100
      }
  })

  return (
    <main className="flex min-h-screen flex-col p-6 md:p-10 bg-muted/20 space-y-6">
      <DashboardHeader />
      
      {/* Quick Actions */}
      <QuickActions />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCards 
            tytAvg={tytAvg > 0 ? tytAvg : null} 
            aytAvg={aytAvg > 0 ? aytAvg : null}
            totalQuestions={totalUnits}
            daysLeft={daysLeft}
            todayStudyMinutes={todayStudyMinutes}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-4">
            <NetProgressionChart data={progressionData} />
            <RecentActivity activities={recentExams} />
         </div>
         <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <SubjectRadar data={radarData} />
            {/* Book Progress could go here too */}
         </div>
      </div>
    </main>
  )
}
