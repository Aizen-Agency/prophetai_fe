"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Download, Search, Loader, Copy, CheckCircle2, Settings, ChevronDown } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import DataService from "@/app/service/DataService"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LogoutButton from "@/components/LogoutButton"
import { getCookie } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

// Add a new VideoPlayer component
const VideoPlayer = ({ url, id }: { url: string; id: number }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playbackMethod, setPlaybackMethod] = useState<'native' | 'blob' | 'iframe'>('native')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [corsStatus, setCorsStatus] = useState<'checking' | 'ok' | 'error' | null>(null)
  
  // Cleanup blobUrl when component unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  useEffect(() => {
    console.log(`Video ${id} URL:`, url)
    
    // Check if URL is valid
    if (!url || url === 'undefined' || url === 'null' || url === '') {
      setError('Invalid or missing video URL')
      setIsLoading(false)
      return
    }
    
    // Check if this is an S3 URL
    if (url.includes('amazonaws.com')) {
      console.log(`Video ${id} is from S3`)
      checkCorsHeaders(url)
    }
    
    // Try to load via blob method if native method fails
    if (playbackMethod === 'blob') {
      loadViaBlob()
    }
  }, [url, id, playbackMethod])
  
  const checkCorsHeaders = async (videoUrl: string) => {
    try {
      setCorsStatus('checking')
      const response = await fetch(videoUrl, { 
        method: 'HEAD',
        mode: 'cors'
      })
      
      // Get CORS-related headers
      const headers = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length'),
      }
      
      console.log(`CORS headers for video ${id}:`, headers)
      
      if (!headers['access-control-allow-origin']) {
        console.error('Video does not have CORS headers set')
        setCorsStatus('error')
      } else {
        setCorsStatus('ok')
      }
    } catch (error) {
      console.error('Error checking CORS headers:', error)
      setCorsStatus('error')
    }
  }
  
  const loadViaBlob = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(url, { mode: 'cors' })
      
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
      
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      setBlobUrl(objectUrl)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error('Error loading video via blob:', err)
      setError('Failed to load video via alternative method')
      setIsLoading(false)
    }
  }

  const handleLoadedData = () => {
    console.log(`Video ${id} loaded successfully with method: ${playbackMethod}`)
    setIsLoading(false)
  }

  const handleError = (e: any) => {
    console.error(`Video ${id} error with method ${playbackMethod}:`, e)
    
    // If native method fails, try blob method
    if (playbackMethod === 'native') {
      console.log('Trying blob method...')
      setPlaybackMethod('blob')
      return
    }
    
    // If blob method fails, try iframe
    if (playbackMethod === 'blob') {
      console.log('Trying iframe method...')
      setPlaybackMethod('iframe')
      return
    }
    
    setIsLoading(false)
    setError('Error loading video. This might be due to CORS issues or an invalid URL format.')
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black/30 rounded-lg p-4">
        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mb-2">
          <Play className="h-5 w-5 text-gray-300" />
        </div>
        <p className="text-gray-300 text-center">Video unavailable</p>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-4"
          onClick={() => window.open(url, '_blank')}
        >
          Open in new tab
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      )}
      
      <div className="absolute top-2 left-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-black/40 text-white hover:bg-black/60">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPlaybackMethod('native')}>
              Native Player {playbackMethod === 'native' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlaybackMethod('blob')}>
              Blob URL {playbackMethod === 'blob' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlaybackMethod('iframe')}>
              Iframe {playbackMethod === 'iframe' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {playbackMethod === 'native' && (
        <video
          src={url}
          className="w-full h-full object-cover rounded-lg"
          controls
          controlsList="nodownload"
          onLoadedData={handleLoadedData}
          onError={handleError}
          crossOrigin="anonymous"
        />
      )}
      
      {playbackMethod === 'blob' && blobUrl && (
        <video
          src={blobUrl}
          className="w-full h-full object-cover rounded-lg"
          controls
          controlsList="nodownload"
          onLoadedData={handleLoadedData}
          onError={handleError}
        />
      )}
      
      {playbackMethod === 'iframe' && (
        <iframe
          src={url}
          className="w-full h-full rounded-lg"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={handleLoadedData}
          onError={handleError}
        />
      )}
    </div>
  )
}

export default function YourVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('latest')
  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [proxyUrls, setProxyUrls] = useState<Record<number, string>>({})
  // Add a ref to track processed video IDs
  const processedVideoIds = useRef<Set<string>>(new Set())

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
        console.log('Processed videos data:', videosData)
        
        // Normalize video data to ensure URL exists
        const validVideos = videosData.map((video: any) => {
          console.log('Raw video data:', video)
          
          // Create a normalized video object
          const normalizedVideo: Video = {
            id: video.id || 0,
            script_id: video.script_id || 0,
            video_url: video.video_url || video.url || '', // Check both possible property names
            size: video.size || '',
            created_at: video.created_at || new Date().toISOString()
          }
          
          console.log(`Normalized Video ${normalizedVideo.id} URL:`, normalizedVideo.video_url)
          return normalizedVideo
        })
        
        setVideos(validVideos)
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

        // Check if video is already in pending state before adding
        setPendingVideos(prev => {
          // If video is already in pending list, don't add it again
          if (prev.some(v => v.videoId === videoId)) {
            return prev;
          }
          // Otherwise add it to pending videos
          return [...prev, { videoId, status: 'processing' }];
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-heygen-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            video_ids: [videoId], 
            user_id: userId, 
            script_id: scriptId,
            heygen: {
              apiKey: localStorage.getItem('heyGenSettings') ? JSON.parse(localStorage.getItem('heyGenSettings')!).apiKey : null
            }
          }),
        });

        const data = await response.json();
        console.log('Upload response:', data);
        
        if (response.status === 200) {
          // All videos are completed
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
          // Some videos are still processing
          if (data.results && data.results.length > 0) {
            const videoResult = data.results.find((r: any) => r.video_id === videoId);
            if (videoResult) {
              setPendingVideos(prev => 
                prev.map(video => 
                  video.videoId === videoId ? { 
                    ...video, 
                    status: videoResult.status, 
                    message: videoResult.message || 'Video is still processing. Please check back later.'
                  } : video
                )
              );
            }
          }
          
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

    const videoIds = new URLSearchParams(window.location.search).get('video_ids');
    // Only check video status if we haven't processed these video IDs before
    if (videoIds) {
      const ids = videoIds.split(',');
      ids.forEach(videoId => {
        if (!processedVideoIds.current.has(videoId)) {
          // Mark this video ID as processed
          processedVideoIds.current.add(videoId);
          checkVideoStatus(videoId);
        }
      });
    }

    fetchVideos();
    
    // Clear URL parameter after processing to prevent reprocessing on page refreshes
    if (videoIds) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [router]);

  const filteredAndSortedVideos = videos
  .filter((video) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const videoId = video.id.toString().toLowerCase();
    const scriptId = video.script_id.toString().toLowerCase();
    const date = new Date(video.created_at).toLocaleDateString().toLowerCase();

    return videoId.includes(searchLower) || 
           scriptId.includes(searchLower) || 
           date.includes(searchLower);
  })
  .sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    return 0
  })

  // Function to copy video URL
  const copyVideoUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedId(id)
        // Reset after 2 seconds
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err)
      })
  }

  // Function to download video directly if CORS is an issue
  const createProxyUrl = async (video: Video) => {
    try {
      // Check if we already created a proxy URL
      if (proxyUrls[video.id]) {
        return proxyUrls[video.id]
      }
      
      console.log(`Creating proxy URL for video ${video.id}`)
      
      // Create a proxy object URL
      const response = await fetch(video.video_url, {
        method: 'GET',
        // Using no-cors as a last resort if CORS is failing
        mode: 'no-cors'
      })
      
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      // Save the proxy URL
      setProxyUrls(prev => ({
        ...prev,
        [video.id]: objectUrl
      }))
      
      return objectUrl
    } catch (error) {
      console.error('Error creating proxy URL:', error)
      return null
    }
  }
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all proxy URLs
      Object.values(proxyUrls).forEach(url => {
        URL.revokeObjectURL(url)
      })
    }
  }, [proxyUrls])

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
            <h2 className="text-xl font-semibold text-white mb-4">Videos in Processing ({pendingVideos.length})</h2>
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
                      <p className="text-xs mt-1">Status: {pendingVideo.status}</p>
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
              <div key={video.id} className="w-full">
                <Card className="bg-[#151F38] border-0 shadow-lg shadow-black/25 overflow-hidden">
                  <div className="relative aspect-video bg-gray-800">
                    {!video.video_url ? (
                      <div className="flex flex-col items-center justify-center h-full bg-black/30 rounded-lg p-4">
                        <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center mb-3">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-300 text-center">Video not yet available</p>
                        <p className="text-sm text-white/50 mt-2 text-center">
                          This video may still be processing.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            router.refresh();
                          }}
                        >
                          Refresh
                        </Button>
                      </div>
                    ) : (
                      <>
                        <VideoPlayer url={video.video_url} id={video.id} />
                        <Button
                          variant="default"
                          size="icon"
                          className="absolute top-2 right-2 rounded-full bg-gray-700/50 hover:bg-gray-600/60 backdrop-blur-sm transition-all duration-300 border border-gray-500/30 w-10 h-10 p-2 group z-10"
                          onClick={async () => {
                            try {
                              const a = document.createElement('a');
                              a.href = video.video_url;
                              a.download = `video-${video.id}.mp4`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            } catch (error) {
                              console.error('Error downloading video:', error);
                              const proxyUrl = await createProxyUrl(video);
                              if (proxyUrl) {
                                const a = document.createElement('a');
                                a.href = proxyUrl;
                                a.download = `video-${video.id}.mp4`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }
                            }
                          }}
                        >
                          <Download className="w-5 h-5 text-gray-300 group-hover:text-gray-100 group-hover:scale-110 transition-all duration-300" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">Video #{video.id}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
