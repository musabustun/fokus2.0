import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { QuickLog } from "@/components/study/quick-log"
import { DailySummary } from "@/components/study/daily-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react"

export default async function StudyPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  const today = new Date().toISOString().split('T')[0]

  // Get today's sessions
  const { data: todaySessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes, subjects(name)')
    .eq('user_id', user?.id)
    .eq('session_date', today)

  // Calculate today's stats
  const totalMinutes = todaySessions?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0
  const sessionCount = todaySessions?.length || 0

  // Subject breakdown
  const subjectMap: Record<string, number> = {}
  todaySessions?.forEach((s: any) => {
    const name = s.subjects?.name || 'Genel'
    subjectMap[name] = (subjectMap[name] || 0) + s.duration_minutes
  })
  const subjectBreakdown = Object.entries(subjectMap).map(([subject, minutes]) => ({ subject, minutes }))

  // Get recent sessions (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select('*, subjects(name)')
    .eq('user_id', user?.id)
    .gte('session_date', weekAgo.toISOString().split('T')[0])
    .order('created_at', { ascending: false })
    .limit(20)

  // Get user's profile for goal
  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_study_goal_hours')
    .eq('id', user?.id)
    .single()

  const goalMinutes = (profile?.daily_study_goal_hours || 8) * 60

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ders Takipçisi</h2>
            <p className="text-muted-foreground">Çalışma oturumlarınızı kaydedin ve ilerlemenizi takip edin.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DailySummary 
          totalMinutes={totalMinutes}
          sessionCount={sessionCount}
          goalMinutes={goalMinutes}
          subjectBreakdown={subjectBreakdown}
        />
        <QuickLog />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Son Oturumlar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Ders</TableHead>
                <TableHead>Süre</TableHead>
                <TableHead>Notlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!recentSessions || recentSessions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    Henüz kaydedilmiş oturum yok. Çalışma zamanınızı kaydetmeye başlayın!
                  </TableCell>
                </TableRow>
              )}
              {recentSessions?.map((session: any) => {
                const hours = Math.floor(session.duration_minutes / 60)
                const mins = session.duration_minutes % 60
                return (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(session.session_date).toLocaleDateString('tr-TR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {session.subjects?.name || 'Genel'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {hours > 0 ? `${hours}sa ` : ''}{mins}dk
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.notes || '-'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
