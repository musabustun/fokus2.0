"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function SubjectRadar({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
      return null;
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle>Konu Performansı</CardTitle>
        <CardDescription>Her dersteki net oranınız (net/toplam soru × 100)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="subject" className="text-xs font-bold" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name="Başarı Oranı"
                    dataKey="score"
                    stroke="var(--chart-3)"
                    fill="var(--chart-3)"
                    fillOpacity={0.4}
                />
                <Tooltip 
                  formatter={(value) => [`%${value}`, 'Başarı Oranı']}
                />
            </RadarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

