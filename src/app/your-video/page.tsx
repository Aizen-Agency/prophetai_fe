"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

const videoData = [
  { id: 1, title: "Intro to AntiProphet AI", duration: "2:30", date: "2023-06-15", source: "sync.so" },
  { id: 2, title: "How to Create Scripts", duration: "5:45", date: "2023-07-01", source: "arcads" },
  { id: 3, title: "Optimizing Your Content", duration: "4:15", date: "2023-07-10", source: "sync.so" },
  { id: 4, title: "Advanced Video Techniques", duration: "7:20", date: "2023-07-22", source: "arcads" },
  { id: 5, title: "Mastering AI Prompts", duration: "6:10", date: "2023-08-05", source: "sync.so" },
  { id: 6, title: "Engagement Strategies", duration: "3:55", date: "2023-08-18", source: "arcads" },
]

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("latest")

  const filteredAndSortedVideos = videoData
    .filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return 0
    })

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f25]">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f25]/80 via-[#1a1c2e]/60 to-[#2d1b3d]/40"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-10 relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Your Videos</h1>
          <p className="text-white/70 text-lg mt-2">Manage and download your AI-generated videos</p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#151F38] border-gray-700 text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] bg-[#151F38] border-gray-700 text-white relative z-20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#151F38] border-gray-700 text-white z-30">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVideos.map((video) => (
            <Card key={video.id} className="bg-[#151F38] border-0 shadow-lg shadow-black/25 overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={`/placeholder.svg?height=200&width=400&text=Video+${video.id}`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-sm rounded">
                  {video.duration}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-sm rounded">
                  {video.source}
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-gray-700/50 hover:bg-gray-600/60 backdrop-blur-sm transition-all duration-300 border border-gray-500/30 w-10 h-10 p-2 group"
                >
                  <Download className="w-5 h-5 text-gray-300 group-hover:text-gray-100 group-hover:scale-110 transition-all duration-300" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{new Date(video.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
