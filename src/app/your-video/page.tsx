"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import DataService from "@/app/service/DataService"
import { Download , Search} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Video {
  id: number
  script_id: number
  video_url: string
  size: string
  created_at: string
}

export default function YourVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('latest')


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userId = 1 // TODO: Replace with actual user ID
        const response = await DataService.getVideosByUserId(userId)
        console.log('API Response:', response) // Debug log
        
        // Handle case where videos might be nested in the response object
        const videosData = Array.isArray(response) ? response : response.videos || response.data || []
        setVideos(videosData)
      } catch (error) {
        console.error('Error fetching videos:', error)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const filteredAndSortedVideos = videos
  .filter((video) => video.id.toString().includes(searchTerm.toLowerCase()))
  .sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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

      {/* Sidebar Component */}
      <Sidebar activeItem="videos"/>

      {/* Main Content */}
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Button>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Your Generated Videos</h1>
          <p className="text-white/70 text-lg mt-2">Watch and download your AI-generated videos</p>
        </div>
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/70">No videos generated yet. Go back and generate some videos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedVideos?.map((video) => (
              <Card key={video.id} className="bg-white/10 border-none shadow-lg">
                
                <CardContent>
                  <div className="aspect-video mt-4 bg-black/20 rounded-lg mb-4 relative">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                    <Button
                  variant="default"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-gray-700/50 hover:bg-gray-600/60 backdrop-blur-sm transition-all duration-300 border border-gray-500/30 w-10 h-10 p-2 group"
                >
                  <Download className="w-5 h-5 text-gray-300 group-hover:text-gray-100 group-hover:scale-110 transition-all duration-300" />
                  <span className="sr-only">Download</span>
                </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-white/70">
                      <p className="text-white">Video #{video.id}</p>
                      <p> {new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
