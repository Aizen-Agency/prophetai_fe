"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import DataService from "@/app/service/DataService"
import { Download, Search, Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LogoutButton from "@/components/LogoutButton"
import { getCookie } from '@/lib/utils'

interface Video {
  id: number
  script_id: number
  video_url: string
  size: string
  created_at: string
}

interface PendingVideo {
  videoId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message?: string
}

export default function YourVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('latest')
  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([])


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userId = getCookie('userId')
        if (!userId) {
          throw new Error('User ID not found')
        }
        const response = await DataService.getVideosByUserId(parseInt(userId))
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

    const checkVideoStatus = async (videoId: string) => {
      try {
        const userId = getCookie('userId');
        const scriptId = getCookie('idea_id');

        if (!userId || !scriptId) {
          throw new Error('User ID or Script ID not found');
        }

        // Add pending video to state
        setPendingVideos(prev => [...prev, { videoId, status: 'processing' }]);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-heygen-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ video_id: videoId, user_id: userId, script_id: scriptId }),
        });

        const data = await response.json();
        console.log('Upload response:', data);
        
        if (response.status === 200) {
          // Video is completed or already exists
          setPendingVideos(prev => 
            prev.filter(v => v.videoId !== videoId)
          );
          
          // Refresh videos list
          await fetchVideos();
          
          // Navigate to the video page if completed
          if (data.status === 'completed') {
            router.refresh();
          }
        } else if (response.status === 202) {
          // Video is still processing
          setPendingVideos(prev => 
            prev.map(video => 
              video.videoId === videoId ? { 
                ...video, 
                status: 'processing', 
                message: data.message || 'Video is still processing. Please check back later.'
              } : video
            )
          );
          
          // Set up a polling mechanism to check status every 10 seconds
          setTimeout(() => checkVideoStatus(videoId), 10000);
        } else {
          // Handle error
          setPendingVideos(prev => 
            prev.map(video => 
              video.videoId === videoId ? { 
                ...video, 
                status: 'failed', 
                message: data.error || 'Failed to process video'
              } : video
            )
          );
        }
      } catch (error) {
        console.error('Error checking video status:', error);
        
        // Update status to failed
        setPendingVideos(prev => 
          prev.map(video => 
            video.videoId === videoId ? { 
              ...video, 
              status: 'failed', 
              message: error instanceof Error ? error.message : 'An unknown error occurred'
            } : video
          )
        );
      }
    };

    const videoId = new URLSearchParams(window.location.search).get('video_id');
    if (videoId) {
      checkVideoStatus(videoId);
    }

    fetchVideos();
  }, [router]);

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
        <LogoutButton />
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

        {/* Display pending videos */}
        {pendingVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Videos in Processing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingVideos.map((pendingVideo) => (
                <Card key={pendingVideo.videoId} className="bg-white/10 border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-black/20 rounded-lg mb-4 flex items-center justify-center">
                      {pendingVideo.status === 'processing' ? (
                        <div className="flex flex-col items-center">
                          <Loader className="w-10 h-10 text-purple-400 animate-spin mb-4" />
                          <p className="text-white text-center">Video processing...</p>
                          <p className="text-white/70 text-sm text-center mt-2">
                            {pendingVideo.message || 'This may take a few minutes'}
                          </p>
                        </div>
                      ) : pendingVideo.status === 'failed' ? (
                        <div className="text-center text-red-400">
                          <p>Processing failed</p>
                          <p className="text-sm mt-2">{pendingVideo.message}</p>
                          <Button 
                            variant="ghost" 
                            className="mt-2 text-red-400 hover:text-red-300"
                            onClick={() => {
                              setPendingVideos(prev => prev.filter(v => v.videoId !== pendingVideo.videoId))
                            }}
                          >
                            Dismiss
                          </Button>
                        </div>
                      ) : null}
                    </div>
                    <div className="text-sm text-white/70">
                      <p className="text-white">Processing Video #{pendingVideo.videoId}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : videos.length === 0 && pendingVideos.length === 0 ? (
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
                      onClick={() => {
                        // Create an anchor element to download the video
                        const a = document.createElement('a');
                        a.href = video.video_url;
                        a.download = `video-${video.id}.mp4`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
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
