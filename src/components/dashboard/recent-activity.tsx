
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
        <CardDescription>
          En son sınavlarınız ve çalışma seanslarınız.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 && (
              <p className="text-sm text-muted-foreground">Son aktivite bulunamadı.</p>
          )}
          {activities.map((item, i) => (
             <div className="flex items-center" key={i}>
                <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                    {item.type} Deneme Sınavı
                </p>
                <p className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                </p>
                </div>
                <div className="ml-auto font-medium">{item.total_net} Net</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
