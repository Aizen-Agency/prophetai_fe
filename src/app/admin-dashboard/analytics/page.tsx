"use client"

import React, { useState, useMemo, useEffect } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin-sidebar"
import DataService from "@/app/service/DataService"
import LogoutButton from "@/components/LogoutButton"


interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface InstagramVideo {
  id: number
  userId: number
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  dailyViews: DailyView[]
  averageViewsPerDay: number
  weekOverWeekGrowth: string
  performance: "high" | "medium" | "low"
  date: Date
}

interface DailyView {
  date: string
  views: number
}

interface InstagramSummary {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
}

interface ChartDataPoint {
  date: string
  views: number
}

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

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("views")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [instagramData, setInstagramData] = useState<InstagramVideo[]>([])
  const [instagramSummary, setInstagramSummary] = useState<InstagramSummary>({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
  })
  const itemsPerPage = 10

  // Fetch users and Instagram analytics data
  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting to fetch Instagram data');
      setIsLoading(true)
      try {
        // Fetch users
        const usersResponse = await DataService.getAllUsers()
        console.log('Users response:', usersResponse);
        if (usersResponse && usersResponse.users) {
          setUsers(usersResponse.users)
          setSelectedUser(usersResponse.users[0])
        }

        // Fetch Instagram analytics
        const response = await DataService.getInstagramAnalytics()
        console.log('Received Instagram analytics response:', response);
        
        // If there's no data, show an error
        if (!response || !response.analytics || response.analytics.length === 0) {
          throw new Error('No Instagram analytics data available');
        }
        
        // Use the most recent analytics data
        const latestAnalytics = response.analytics[response.analytics.length - 1];
        console.log('Latest analytics:', latestAnalytics);
        
        // Parse the posts JSON if it's a string
        let analyticsPosts;
        if (typeof latestAnalytics.posts === 'string') {
          analyticsPosts = JSON.parse(latestAnalytics.posts);
        } else {
          analyticsPosts = latestAnalytics.posts;
        }
        
        console.log('Parsed analytics posts:', analyticsPosts);

        if (!analyticsPosts || !analyticsPosts.posts) {
          throw new Error('Invalid analytics data format');
        }

        // Transform the API response into InstagramVideo format
        const formattedData: InstagramVideo[] = analyticsPosts.posts.map((post: any, index: number) => ({
          id: index + 1,
          userId: selectedUser?.id || 1,
          title: post.video || `Instagram Post ${index + 1}`,
          views: post.views || 0,
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          dailyViews: generateDailyViews(14), // Generate sample daily views for now
          averageViewsPerDay: post.avg_views_per_day || 0,
          weekOverWeekGrowth: calculateWeekOverWeekGrowth(generateDailyViews(14)),
          performance: post.avg_views_per_day > 800 ? "high" : post.avg_views_per_day > 400 ? "medium" : "low",
          date: new Date(post.date || Date.now()),
        }));

        console.log('Formatted Instagram data:', formattedData);

        setInstagramData(formattedData)
        setInstagramSummary({
          totalViews: analyticsPosts.total_views || 0,
          totalLikes: analyticsPosts.total_likes || 0,
          totalComments: analyticsPosts.total_comments || 0,
          totalShares: analyticsPosts.total_shares || 0,
        })
      } catch (error) {
        console.error('Error fetching Instagram data:', error)
        // Optional: set error state and show to the user
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedUser?.id])

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    const result = instagramData.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (performanceFilter === "all" || video.performance === performanceFilter) &&
        (!selectedUser || video.userId === selectedUser.id)
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
  }, [instagramData, searchQuery, performanceFilter, sortBy, sortOrder, selectedUser])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedVideos.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // Reset to first page when search query, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, performanceFilter, sortBy, sortOrder, selectedUser])

  const handleSortChange = (value: string) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(value)
      setSortOrder("desc")
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

      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 relative z-10 overflow-y-auto no-scrollbar ml-[220px]">
      <LogoutButton />
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 w-[60%]">Select User</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            <Button
              onClick={() => setSelectedUser(null)}
              className={`flex-shrink-0 ${!selectedUser ? "bg-purple-600" : "bg-[#151F38]"}`}
            >
              All Users
            </Button>
            {users.map((user) => (
              <Button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex-shrink-0 ${selectedUser?.id === user.id ? "bg-purple-600" : "bg-[#151F38]"}`}
              >
                {user.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Instagram Performance Tracking</h1>
          <p className="text-white/70 text-lg mt-2">
            {selectedUser
              ? `Monitoring ${selectedUser.name}'s Instagram engagement and growth`
              : "Monitoring all users' Instagram engagement and growth"}
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
                <p>Total number of video comments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <TooltipProvider>
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
          </TooltipProvider> */}
        </div>

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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <div key={i} className="h-12 w-full bg-gray-700 animate-pulse rounded-md" />
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
