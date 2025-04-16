"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import DataService from "@/app/service/DataService"

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
      <div className="flex-grow p-10 relative z-10 overflow-y-auto">
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
          <p className="text-white/70 text-lg mt-2">Watch and manage your AI-generated videos</p>
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
            {videos?.map((video) => (
              <Card key={video.id} className="bg-white/10 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Video #{video.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black/20 rounded-lg mb-4 relative">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-white/70">
                      <p>Size: {video.size}</p>
                      <p>Created: {new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => window.open(video.video_url, '_blank')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
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
