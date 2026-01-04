"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Target, 
  Clock,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  { href: "/", label: "Kontrol Paneli", icon: Home },
  { href: "/study", label: "Ders Takipçisi", icon: Clock },
  { href: "/exams", label: "Sınav Geçmişi", icon: ClipboardList },
  { href: "/books", label: "Kütüphane", icon: BookOpen },
  { href: "/goals", label: "Hedefler", icon: Target },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card/50 backdrop-blur-sm hidden lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo */}
        <div className="mb-8 px-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">YKS Tracker</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t pt-4 space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">Görünüm</span>
            <ModeToggle />
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </aside>
  )
}
