"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, ClipboardList, Target, Clock } from "lucide-react"

const navItems = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/study", label: "Çalışma", icon: Clock },
  { href: "/exams", label: "Sınavlar", icon: ClipboardList },
  { href: "/books", label: "Kitaplar", icon: BookOpen },
  { href: "/goals", label: "Hedefler", icon: Target },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
