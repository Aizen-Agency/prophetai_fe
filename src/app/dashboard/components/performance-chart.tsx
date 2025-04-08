import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceChartProps {
  data: any[]
  colors: {
    articles: string
    scripts: string
    videosGen: string
    videosPosted: string
  }
}

export function PerformanceChart({ data, colors }: PerformanceChartProps) {
  return (
    <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white">
          Monthly Performance
          <div className="text-sm font-normal text-white/70 mt-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></span>Articles
            <span className="inline-block w-3 h-3 rounded-full bg-[#3B82F6] mr-2 ml-4"></span>Scripts
            <span className="inline-block w-3 h-3 rounded-full bg-[#10B981] mr-2 ml-4"></span>Short Videos
            <span className="inline-block w-3 h-3 rounded-full bg-[#0EA5E9] mr-2 ml-4"></span>Long Videos
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#151F38", border: "none" }} labelStyle={{ color: "#fff" }} />
            <Line type="monotone" dataKey="articles" stroke={colors.articles} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="scripts" stroke={colors.scripts} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="shortVideos" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="longVideos" stroke={colors.videosPosted} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
