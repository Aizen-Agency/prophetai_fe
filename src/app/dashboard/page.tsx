"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { DashboardContent } from "./component/dashboard-content"
import { Background } from "./component/background"
import { chartColors } from "./data/data"
import DataService from "../service/DataService"
import { useLogin } from "@/context/LoginContext"
import LogoutButton from "@/components/LogoutButton"

export default function DashboardPage() {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId, username } = useLogin()

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        if (!userId) {
          setError("User ID not found")
          setLoading(false)
          return
        }

        const response = await DataService.getInsights(userId)
        if (!response.ok) {
          throw new Error("Failed to fetch insights")
        }
        
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        
        setInsights(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch insights")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [userId])

  // Placeholder stats for loading state
  const loadingStatsData = [
    { title: "Articles scraped", value: "—", change: "+0%" },
    { title: "Scripts generated", value: "—", change: "+0%" },
    { title: "Videos generated", value: "—", change: "+0%" }
  ]

  // Generate empty monthly data for loading state
  const generateEmptyMonthlyData = () => {
    return Array(6).fill(0).map((_, i) => ({
      month: i+1,
      articles: 0,
      scripts: 0,
      totalVideos: 0
    }))
  }

  // Prepare stats data based on loading state
  const statsData = !loading && insights ? [
    { title: "Articles scraped", value: insights.reduce((sum: number, monthData: any) => sum + monthData.articles, 0).toLocaleString(), change: "+0%" },
    { title: "Scripts generated", value: insights.reduce((sum: number, monthData: any) => sum + monthData.scripts, 0).toLocaleString(), change: "+0%" },
    { title: "Videos generated", value: insights.reduce((sum: number, monthData: any) => sum + monthData.totalVideos, 0).toLocaleString(), change: "+0%" }
  ] : loadingStatsData

  const monthlyData = !loading && insights ? insights : generateEmptyMonthlyData()

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <Background />
      <Sidebar activeItem="dashboard"/>
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <LogoutButton />
        <DashboardContent 
          userName={username || "User"}
          statsData={statsData}
          monthlyData={monthlyData}
          chartColors={chartColors} 
          isLoading={loading}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 rounded-md border border-red-500/30">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
