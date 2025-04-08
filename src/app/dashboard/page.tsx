"use client"

import { Sidebar } from "./components/sidebar"
import { DashboardContent } from "./components/dashboard-content"
import { Background } from "./components/background"
import { chartColors , statsData , monthlyData } from "./data/data"

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <Background />
      <Sidebar />
      <DashboardContent userName="Jessie" statsData={statsData} monthlyData={monthlyData} chartColors={chartColors} />
    </div>
  )
}
