import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface VideoGenerationChartProps {
  data: any[]
  color: string
  isLoading?: boolean
}

export function VideoGenerationChart({ data, color, isLoading = false }: VideoGenerationChartProps) {
  return (
    <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white">
          Monthly Video Generation
          <div className="text-sm font-normal text-white/70 mt-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></span>Total Videos Generated
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] w-full bg-[#1E293B]/30 rounded-md animate-pulse flex items-center justify-center">
            <div className="text-white/30 text-lg">Loading data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#151F38", border: "none" }} labelStyle={{ color: "#fff" }} />
              <Bar dataKey="totalVideos" name="Total Videos" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
