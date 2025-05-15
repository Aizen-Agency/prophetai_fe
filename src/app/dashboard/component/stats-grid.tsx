import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsItem {
  title: string
  value: string
  change: string
}

interface StatsGridProps {
  stats: StatsItem[]
  isLoading?: boolean
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-[#151F38] border-0 shadow-lg shadow-black/25">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-white">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold text-white ${isLoading ? "opacity-50" : ""}`}>
              {isLoading ? (
                <div className="h-8 w-20 bg-white/10 rounded-md animate-pulse"></div>
              ) : (
                stat.value
              )}
            </div>
            <p className={`text-sm ${isLoading ? "opacity-50" : stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {isLoading ? (
                <div className="h-4 w-12 bg-white/10 rounded-md animate-pulse mt-1"></div>
              ) : (
                stat.change
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
