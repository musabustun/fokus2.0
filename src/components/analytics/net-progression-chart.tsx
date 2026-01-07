"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type ExamType = "TYT" | "AYT"

export function NetProgressionChart({ data }: { data: any[] }) {
  const [selectedType, setSelectedType] = useState<ExamType>("TYT")
  
  // Filter data to only include entries with the selected exam type
  const filteredData = data?.filter(d => d[selectedType] !== null) || []
  
  if (!data || data.length === 0) {
      return (
          <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 backdrop-blur-sm">
             <CardHeader>
                <CardTitle>Net Gelişimi</CardTitle>
                <CardDescription>Puanlarınızı zaman içinde takip edin.</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                 Henüz yeterli veri yok. Daha fazla sınav ekleyin.
             </CardContent>
          </Card>
      )
  }

  const chartColor = selectedType === "TYT" ? "var(--chart-1)" : "var(--chart-2)"

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Net Gelişimi</CardTitle>
            <CardDescription>
              {selectedType} performansınızın zaman içindeki değişimi.
            </CardDescription>
          </div>
          {/* Exam Type Selector */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setSelectedType("TYT")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                selectedType === "TYT"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TYT
            </button>
            <button
              onClick={() => setSelectedType("AYT")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                selectedType === "AYT"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AYT
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Henüz {selectedType} sınav verisi yok.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                />
                <Line 
                    type="monotone" 
                    name={selectedType}
                    dataKey={selectedType} 
                    stroke={chartColor} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={800}
                    connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

