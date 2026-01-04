
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { BookList } from "./book-list"
import { AddBookDialog } from "./add-book-dialog"

export default async function BooksPage() {
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
             try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options) ) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  let userField = undefined
  if (user) {
      const { data: profile } = await supabase.from('profiles').select('study_field').eq('id', user.id).single()
      userField = profile?.study_field
  }

  const { data: books } = await supabase
    .from('books')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Kütüphane</h2>
           <p className="text-muted-foreground">Çalışma kaynaklarınızı yönetin ve ilerlemenizi takip edin.</p>
        </div>
        <AddBookDialog userField={userField} />
      </div>

      <div className="mt-8">
         {!books || books.length === 0 ? (
             <div className="text-center py-20 bg-card/30 rounded-lg text-muted-foreground">
                 Henüz kitap eklenmedi. Kütüphanenize bir kitap ekleyerek başlayın.
             </div>
         ) : (
             <BookList books={books} />
         )}
      </div>
    </div>
  )
}
