import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsItem {
  title: string
  value: string
  change: string
}

interface StatsGridProps {
  stats: StatsItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-[#151F38] border-0 shadow-lg shadow-black/25">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-white">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
