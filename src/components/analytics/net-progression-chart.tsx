"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function NetProgressionChart({ data }: { data: any[] }) {
  // Data format expected: [{ date: '2023-01-01', TYT: 70, AYT: 45 }, ...]
  
  if (!data || data.length === 0) {
      return (
          <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 backdrop-blur-sm">
             <CardHeader>
                <CardTitle>Net Progression</CardTitle>
                <CardDescription>Track your scores over time.</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                 Not enough data yet. Add more exams.
             </CardContent>
          </Card>
      )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Net Progression</CardTitle>
        <CardDescription>
          Comparison of TYT and AYT performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="TYT" 
                    stroke="var(--chart-1)" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={1500}
                />
                <Line 
                    type="monotone" 
                    dataKey="AYT" 
                    stroke="var(--chart-2)" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
