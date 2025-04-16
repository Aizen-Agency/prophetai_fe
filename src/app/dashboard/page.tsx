"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { DashboardContent } from "./component/dashboard-content"
import { Background } from "./component/background"
import { chartColors } from "./data/data"
import DataService from "../service/DataService"
import { useLogin } from "@/context/LoginContext"

export default function DashboardPage() {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId, username } = useLogin()

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await DataService.getInsights(userId)
        const data = await response.json()
        setInsights(data.data)
      } catch (err) {
        setError("Failed to fetch insights")
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

  // Calculate totals from monthly data
  const calculateTotal = (metric: string) => {
    if (!insights?.months) return 0
    return Object.values(insights.months).reduce((total: number, month: any) => {
      return total + (month[metric] || 0)
    }, 0)
  }

  const statsData = [
    {
      title: "Articles Scraped",
      value: calculateTotal('articles').toString(),
      change: "+0%"
    },
    {
      title: "Scripts Generated",
      value: calculateTotal('scripts').toString(),
      change: "+0%"
    },
    {
      title: "Videos Generated",
      value: calculateTotal('videos_generated').toString(),
      change: "+0%"
    },
    {
      title: "Videos Posted",
      value: calculateTotal('videos_posted').toString(),
      change: "+0%"
    }
  ]

  // Format monthly data for charts
  const monthlyData = insights?.months ? Object.entries(insights.months).map(([month, data]: [string, any]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    articles: data.articles || 0,
    scripts: data.scripts || 0,
    videosGenerated: data.videos_generated || 0,
    videosPosted: data.videos_posted || 0
  })) : []

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <Background />
      <Sidebar activeItem="dashboard"/>
      <DashboardContent 
        userName={username}
        statsData={statsData}
        monthlyData={monthlyData}
        chartColors={chartColors} 
      />
    </div>
  )
}
