import { StatsGrid } from "./stats-grid"
import { PerformanceChart } from "./performance-chart"
import { VideoGenerationChart } from "./video-generation-chart"

interface DashboardContentProps {
  userName: string
  statsData: Array<{
    title: string
    value: string
    change: string
  }>
  monthlyData: any[]
  chartColors: {
    articles: string
    scripts: string
    videosGen: string
    videosPosted: string
  }
}

export function DashboardContent({ userName, statsData, monthlyData, chartColors }: DashboardContentProps) {
  return (
    <div className="flex-grow p-10 relative z-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white">Welcome back, {userName}</h1>
        <p className="text-white/70 text-lg mt-2">Track AI-generated content and optimize your production pipeline</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={statsData} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart 
            data={monthlyData} 
            colors={{
              articles: chartColors.articles,
              scripts: chartColors.scripts,
              videos: chartColors.videosGen
            }} 
          />
        </div>
        <div>
          <VideoGenerationChart data={monthlyData} color={chartColors.videosGen} />
        </div>
      </div>
    </div>
  )
}
