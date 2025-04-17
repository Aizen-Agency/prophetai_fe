"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Instagram,
  TrendingUp,
  Users,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/Sidebar"
import type { User , InstagramVideo, DailyView, InstagramSummary, ChartDataPoint } from "./types"
// Sample user data
const users = { id: 1, name: "Alice Johnson", username: "alice_j", avatar: "/placeholder.svg?height=64&width=64" }
 

const generateDailyViews = (days: number): DailyView[] => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    views: Math.floor(Math.random() * 1000) + 100,
  }))
}

const calculateAverageViews = (dailyViews: DailyView[]): number => {
  const lastWeekViews = dailyViews.slice(-7)
  return Math.round(lastWeekViews.reduce((sum, day) => sum + day.views, 0) / 7)
}

const calculateWeekOverWeekGrowth = (dailyViews: DailyView[]): string => {
  const thisWeekViews = dailyViews.slice(-7).reduce((sum, day) => sum + day.views, 0)
  const lastWeekViews = dailyViews.slice(-14, -7).reduce((sum, day) => sum + day.views, 0)
  return (((thisWeekViews - lastWeekViews) / lastWeekViews) * 100).toFixed(2)
}

const generateInstagramData = (count: number, userId: number): InstagramVideo[] => {
  const data: InstagramVideo[] = []
  for (let i = 1; i <= count; i++) {
    const dailyViews = generateDailyViews(14) // Generate 14 days of data
    const totalViews = dailyViews.reduce((sum, day) => sum + day.views, 0)
    const averageViewsPerDay = calculateAverageViews(dailyViews)
    const weekOverWeekGrowth = calculateWeekOverWeekGrowth(dailyViews)
    const likes = Math.floor(Math.random() * 2000) + 200
    const comments = Math.floor(Math.random() * 500) + 50
    const shares = Math.floor(Math.random() * 300) + 30
    const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within the last 30 days

    // Calculate performance category
    let performance: "high" | "medium" | "low"
    if (averageViewsPerDay > 800) performance = "high"
    else if (averageViewsPerDay > 400) performance = "medium"
    else performance = "low"

    data.push({
      id: i,
      userId,
      title: `Instagram Video ${i}`,
      views: totalViews,
      likes,
      comments,
      shares,
      dailyViews,
      averageViewsPerDay,
      weekOverWeekGrowth,
      performance,
      date,
    })
  }
  return data
}

const generateChartData = (): ChartDataPoint[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    views: Math.floor(Math.random() * 5000) + 1000,
  }))
}

const chartData: ChartDataPoint[] = generateChartData()

interface ExpandedRowProps {
  data: InstagramVideo
}

const ExpandedRow: React.FC<ExpandedRowProps> = ({ data }) => {
  return (
    <div className="p-4 bg-[#1F2937] border-t border-white/10">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Average Views Per Day</h4>
          <p className="text-lg font-bold text-white">{data.averageViewsPerDay.toLocaleString()}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Week-over-Week Growth</h4>
          <p
            className={`text-lg font-bold ${Number.parseFloat(data.weekOverWeekGrowth) >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {data.weekOverWeekGrowth}%
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">Daily Views (Last 7 Days)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.dailyViews.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <RechartsTooltip contentStyle={{ backgroundColor: "#151F38", border: "none" }} />
            <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function PerformanceAnalytics(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User>(users)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("views")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  // Generate Instagram data for the selected user
  const instagramData = useMemo<InstagramVideo[]>(() => generateInstagramData(100, selectedUser.id), [selectedUser.id])

  // Calculate summary stats for the selected user
  const instagramSummary = useMemo<InstagramSummary>(
    () => ({
      totalViews: instagramData.reduce((sum, item) => sum + item.views, 0),
      totalLikes: instagramData.reduce((sum, item) => sum + item.likes, 0),
      totalComments: instagramData.reduce((sum, item) => sum + item.comments, 0),
      totalShares: instagramData.reduce((sum, item) => sum + item.shares, 0),
    }),
    [instagramData],
  )

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo<InstagramVideo[]>(() => {
    const result = instagramData.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (performanceFilter === "all" || video.performance === performanceFilter),
    )

    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
      } else {
        const aValue = a[sortBy as keyof InstagramVideo]
        const bValue = b[sortBy as keyof InstagramVideo]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      }
    })

    return result
  }, [instagramData, searchQuery, performanceFilter, sortBy, sortOrder])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedVideos.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage)

  const nextPage = (): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = (): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // Reset to first page when search query, filter, or sort changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, performanceFilter, sortBy, sortOrder])

  const handleSortChange = (value: string): void => {
    if (value === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(value)
      setSortOrder("desc") // Default to descending for new sort
    }
  }

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f25]">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f25]/80 via-[#1a1c2e]/60 to-[#2d1b3d]/40"></div>

      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Instagram Performance Tracking</h1>
          <p className="text-white/70 text-lg mt-2">
            Monitoring your video engagement and growth on Instagram.
          </p>
        </div>

        {/* Instagram Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium text-white">Total Views</CardTitle>
                    <TrendingUp className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{instagramSummary.totalViews.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of video views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium text-white">Total Likes</CardTitle>
                    <Users className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{instagramSummary.totalLikes.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of video likes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium text-white">Total Comments</CardTitle>
                    <MessageCircle className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {instagramSummary.totalComments.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium text-white">Total Shares</CardTitle>
                    <Share2 className="h-4 w-4 text-white" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{instagramSummary.totalShares.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of video shares</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Trend Chart */}
        <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white">View Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <RechartsTooltip contentStyle={{ backgroundColor: "#151F38", border: "none" }} />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Instagram Table with Search, Filter, and Sort */}
        <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Instagram className="mr-2 h-6 w-6 text-white" />
              <CardTitle className="text-xl font-medium text-white">Instagram Video Performance</CardTitle>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-[#1F2937] border-white/20 text-white placeholder-white/60 focus:ring-white/40"
                />
              </div>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger className="w-[180px] bg-[#1F2937] border-white/20 text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performances</SelectItem>
                  <SelectItem value="high">High Performance</SelectItem>
                  <SelectItem value="medium">Medium Performance</SelectItem>
                  <SelectItem value="low">Low Performance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-[#1F2937] border-white/20 text-white">
                  <SortAsc className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                  <SelectItem value="views">Views {sortBy === "views" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                  <SelectItem value="likes">Likes {sortBy === "likes" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                  <SelectItem value="comments">
                    Comments {sortBy === "comments" && (sortOrder === "asc" ? "↑" : "↓")}
                  </SelectItem>
                  <SelectItem value="shares">
                    Shares {sortBy === "shares" && (sortOrder === "asc" ? "↑" : "↓")}
                  </SelectItem>
                  <SelectItem value="averageViewsPerDay">
                    Avg. Views/Day {sortBy === "averageViewsPerDay" && (sortOrder === "asc" ? "↑" : "↓")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                 <div
                 key={i}
                 className="h-12 w-full bg-gray-700 animate-pulse rounded-md"
                 />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border border-white/10">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white text-right">Date</TableHead>
                    <TableHead className="text-white text-right">Views</TableHead>
                    <TableHead className="text-white text-right">Likes</TableHead>
                    <TableHead className="text-white text-right">Comments</TableHead>
                    <TableHead className="text-white text-right">Shares</TableHead>
                    <TableHead className="text-white text-right">Avg. Views/Day</TableHead>
                    <TableHead className="text-white text-right">Performance</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={`hover:bg-white/5 transition-colors cursor-pointer border border-white/10 ${
                          expandedRow === row.id ? "border-b-0" : ""
                        } ${index === currentItems.length - 1 && expandedRow !== row.id ? "rounded-b-lg" : ""}`}
                        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                      >
                        <TableCell className="font-medium text-white">{row.title}</TableCell>
                        <TableCell className="text-white text-right">{row.date.toLocaleDateString()}</TableCell>
                        <TableCell className="text-white text-right">{row.views.toLocaleString()}</TableCell>
                        <TableCell className="text-white text-right">{row.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-white text-right">{row.comments.toLocaleString()}</TableCell>
                        <TableCell className="text-white text-right">{row.shares.toLocaleString()}</TableCell>
                        <TableCell className="text-white text-right">
                          {row.averageViewsPerDay.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            row.performance === "high"
                              ? "text-green-500"
                              : row.performance === "medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {row.performance.charAt(0).toUpperCase() + row.performance.slice(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          {expandedRow === row.id ? (
                            <ChevronUp className="inline-block h-5 w-5 text-white" />
                          ) : (
                            <ChevronDown className="inline-block h-5 w-5 text-white" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedRow === row.id && (
                        <TableRow className="border-b border-l border-r border-white/10">
                          <TableCell colSpan={9} className="p-0">
                            <ExpandedRow data={row} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-white">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedVideos.length)} of{" "}
                {filteredAndSortedVideos.length} videos
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-[#151F38] text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="bg-[#151F38] text-white border-white/20 hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
