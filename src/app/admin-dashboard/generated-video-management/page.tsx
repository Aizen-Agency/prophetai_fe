"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, ArrowUpDown, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "@/components/admin-sidebar"
import DataService from "@/app/service/DataService"

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface Video {
  id: number
  name: string
  size: number
  thumbnail: string
  userId: number
  aiModel: string
  duration: string
  quality: string
  createdAt: string
  user: User
}

type SortOption = "nameAsc" | "nameDesc" | "sizeAsc" | "sizeDesc" | "dateAsc" | "dateDesc"

export default function AdminDashboard(): JSX.Element {
  const [videos, setVideos] = useState<Video[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortOption, setSortOption] = useState<SortOption>("nameAsc")
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await DataService.getAllVideos()
        if (response.success) {
          setVideos(response.videos)
          setFilteredVideos(response.videos)
        } else {
          setError('Failed to fetch videos')
        }
      } catch (err) {
        setError('Error fetching videos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    const sorted = [...videos].filter(
      (video) =>
        video.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedUser || video.userId === selectedUser),
    )

    switch (sortOption) {
      case "nameAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "nameDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "sizeAsc":
        sorted.sort((a, b) => a.size - b.size)
        break
      case "sizeDesc":
        sorted.sort((a, b) => b.size - a.size)
        break
      case "dateAsc":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "dateDesc":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredVideos(sorted)
  }, [videos, searchQuery, sortOption, selectedUser])

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  // Get unique users from videos
  const users = Array.from(new Set(videos.map(video => video.user))).map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  }))

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f25]">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f25]/80 via-[#1a1c2e]/60 to-[#2d1b3d]/40"></div>

      {/* Sidebar Component */}
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 relative z-10 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-white mb-6">AI Video Management</h1>

        {/* User List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
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
                onClick={() => setSelectedUser(user.id)}
                className={`flex-shrink-0 ${selectedUser === user.id ? "bg-purple-600" : "bg-[#151F38]"}`}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Videos Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">AI Generated Videos</h2>
          </div>
          <div className="flex mb-4 gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search AI videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#151F38] border-none text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#151F38] border-none text-white z-40">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#151F38] border-none text-white z-50">
                <DropdownMenuItem onClick={() => setSortOption("nameAsc")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("nameDesc")}>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("sizeAsc")}>Size (Smallest to Largest)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("sizeDesc")}>
                  Size (Largest to Smallest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("dateAsc")}>Date (Oldest First)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("dateDesc")}>Date (Newest First)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="w-full">
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 overflow-hidden">
                  <div className="relative aspect-video bg-gray-800">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {video.aiModel}
                    </div>
                    <Button
                      variant="default"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full bg-gray-700/50 hover:bg-gray-600/60 backdrop-blur-sm transition-all duration-300 border border-gray-500/30 w-10 h-10 p-2 group z-10"
                    >
                      <Download className="w-5 h-5 text-gray-300 group-hover:text-gray-100 group-hover:scale-110 transition-all duration-300" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">{video.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-400">{video.size.toFixed(2)} MB</p>
                      <p className="text-sm text-gray-400">
                        {video.duration} | {video.quality}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src={video.user.avatar || ""} alt={video.user.name} />
                          <AvatarFallback>{video.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{video.user.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{video.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
