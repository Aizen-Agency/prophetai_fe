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

  if (loading) {
    return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen text-white flex items-center justify-center">{error}</div>
  }

  // Calculate total values for articles, scripts, and videos
  const totalArticles = insights.reduce((sum: number, monthData: any) => sum + monthData.articles, 0)
  const totalScripts = insights.reduce((sum: number, monthData: any) => sum + monthData.scripts, 0)
  const totalVideos = insights.reduce((sum: number, monthData: any) => sum + monthData.totalVideos, 0)

  const statsData = [
    { title: "Articles scraped", value: totalArticles.toLocaleString(), change: "+0%" },
    { title: "Scripts generated", value: totalScripts.toLocaleString(), change: "+0%" },
    { title: "Videos generated", value: totalVideos.toLocaleString(), change: "+0%" }
  ]

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <Background />
      <Sidebar activeItem="dashboard"/>
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <LogoutButton />
        <DashboardContent 
          userName={username}
          statsData={statsData}
          monthlyData={insights}
          chartColors={chartColors} 
        />
      </div>
    </div>
  )
}
