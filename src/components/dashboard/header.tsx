
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kontrol Paneli</h2>
        <p className="text-muted-foreground">Tekrar hoş geldin, Kullanıcı.</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground hidden md:block">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
