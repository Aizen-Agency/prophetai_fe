"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Plus, X, Twitter, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"  
import DataService from "@/app/service/DataService"
import { useRouter } from "next/navigation"
import { getCookie } from "@/lib/utils"
import { useLogin } from "@/context/LoginContext"

type Product = {
  id: number
  name: string
  description: string
  link?: string
}

type ScriptIdea = {
  id: number
  topic: string
  tweet: string
  isLiked?: boolean
  hasVoice?: boolean
}

type XChannel = {
  id: number
  name: string
  url: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "AntiProphet AI",
      description: "AI-powered content generation tool",
      link: "https://antiprophet.ai",
    },
  ])
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({ name: "", description: "", link: "" })
  const [scriptIdeas, setScriptIdeas] = useState<ScriptIdea[]>([])
  const [xChannels, setXChannels] = useState<XChannel[]>([
    { id: 1, name: "Main Account", url: "https://x.com/mainaccount" },
  ])
  const [newXChannel, setNewXChannel] = useState<Omit<XChannel, "id">>({ name: "", url: "" })
  const [showXChannels, setShowXChannels] = useState(false)
  const [expandedIdeas, setExpandedIdeas] = useState<number[]>([])
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)

  const [textFilter, setTextFilter] = useState<string>("")
  const [contentTypeFilters, setContentTypeFilters] = useState({
    images: true,
    videos: true,
    text: true,
  })

  const [ideaRatings, setIdeaRatings] = useState<Record<number, "up" | "down" | null>>({})
  const [recordingIdea, setRecordingIdea] = useState<number | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const [likedIdeas, setLikedIdeas] = useState<ScriptIdea[]>([])

  const router = useRouter()
  const { userId, username } = useLogin()

  const addProduct = () => {
    if (newProduct.name && newProduct.description) {
      setProducts([...products, { ...newProduct, id: products.length + 1 }])
      setNewProduct({ name: "", description: "", link: "" })
    }
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const addXChannel = () => {
    if (newXChannel.name && newXChannel.url) {
      setXChannels([...xChannels, { ...newXChannel, id: xChannels.length + 1 }])
      setNewXChannel({ name: "", url: "" })
    }
  }

  const removeXChannel = (id: number) => {
    setXChannels(xChannels.filter((channel) => channel.id !== id))
  }

  const generateScriptIdeas = async () => {
    if (products.length === 0) {
      console.error("No products available")
      return
    }

    setIsGeneratingIdeas(true)
    try {
      const response = await DataService.generateScriptIdeas({
        product_name: products[0].name,
        description: products[0].description,
        link: products[0].link || "",
        script_idea: textFilter,
      })

      console.log("response", response)

      if (response) {
        const newIdeas: ScriptIdea[] = response.ideas.map((idea: any, index: number) => ({
          id: index + 1,
          topic: idea.title,
          tweet: idea.content,
        }))
        setScriptIdeas(newIdeas)
      } else {
        console.error("Failed to generate script ideas")
      }
    } catch (error) {
      console.error("Error generating script ideas:", error)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  const handleContentTypeChange = (type: keyof typeof contentTypeFilters) => {
    setContentTypeFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const toggleIdeaExpansion = (id: number) => {
    setExpandedIdeas((prevExpanded) =>
      prevExpanded.includes(id) ? prevExpanded.filter((expandedId) => expandedId !== id) : [...prevExpanded, id],
    )
  }

  const toggleXChannels = () => {
    setShowXChannels(!showXChannels)
  }

  const rateIdea = async (id: number, rating: "up" | "down") => {
    setIdeaRatings((prev) => ({
      ...prev,
      [id]: prev[id] === rating ? null : rating,
    }))

    // If the idea is liked (upvoted), add it to likedIdeas
    if (rating === "up" && ideaRatings[id] !== "up") {
      const idea = scriptIdeas.find(i => i.id === id)
      if (idea) {
        const updatedIdea = {
          ...idea,
          isLiked: true,
          hasVoice: recordingIdea === id
        }
        setLikedIdeas(prev => [...prev, updatedIdea])
      }
    } else if (rating === "down" || (rating === "up" && ideaRatings[id] === "up")) {
      // Remove from likedIdeas if unliked
      setLikedIdeas(prev => prev.filter(idea => idea.id !== id))
    }
  }

  const toggleRecording = (id: number) => {
    if (recordingIdea === id) {
      setRecordingIdea(null)
      setRecordingTime(0)
      console.log("Stopped recording for idea", id)
    } else {
      setRecordingIdea(id)
      setRecordingTime(0)
      console.log("Started recording for idea", id)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (recordingIdea !== null) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [recordingIdea])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    // Store liked ideas in localStorage
    localStorage.setItem('generatedScripts', JSON.stringify(likedIdeas))
    // Navigate to generated-scripts page
    router.push('/generated-scripts')
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
      <div className="flex-grow p-10 relative z-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Welcome back, {username || 'User'}</h1>
          <p className="text-white/70 text-lg mt-2">Generate scripts for your products</p>
        </div>

        {/* Toggle Button and Tables */}
        <div className="flex items-start mb-8">
          {/* X Channels Button */}
          <div className="flex flex-col justify-start items-center mr-4">
            <Button
              variant="outline"
              size="icon"
              className={`${
                showXChannels ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
              } text-white border-none shadow-lg w-12 h-12`}
              title={showXChannels ? "Show Products" : "Show X Channels"}
              onClick={toggleXChannels}
            >
              {showXChannels ? <LayoutDashboard className="h-6 w-6" /> : <Twitter className="h-6 w-6" />}
            </Button>
          </div>

          {/* Product Table or X Channels Table */}
          <div className="bg-[#151F38] rounded-lg p-6 flex-grow shadow-lg">
            {showXChannels ? (
              <>
                <h2 className="text-xl font-semibold mb-4">X Channels</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {xChannels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell>{channel.name}</TableCell>
                        <TableCell>{channel.url}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeXChannel(channel.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Channel Name"
                          value={newXChannel.name}
                          onChange={(e) => setNewXChannel({ ...newXChannel, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Channel URL"
                          value={newXChannel.url}
                          onChange={(e) => setNewXChannel({ ...newXChannel, url: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={addXChannel}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.link || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeProduct(product.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Link (optional)"
                          value={newProduct.link}
                          onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={addProduct}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>

        {/* Replace the Button for generating script ideas with this new filter section */}
        <div className="mb-8 bg-[#151F38] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Generate Script Ideas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="text-filter" className="block text-sm font-medium text-white/70 mb-2">
                Enter the topics you want or don't want
              </label>
              <textarea
                id="text-filter"
                placeholder="Example:
I want videos about cooking and gardening
I don't want politics or controversial topics
Include cats and dogs
Exclude violence and adult content"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
                className="w-full h-32 bg-[#0F172A] border-white/10 rounded-md p-2 text-white placeholder-white/50"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-white/70 mb-4">Content Type</p>
              <div className="flex flex-wrap gap-6">
                {Object.entries(contentTypeFilters).map(([type, isChecked]) => (
                  <label key={type} className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleContentTypeChange(type as keyof typeof contentTypeFilters)}
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-full ${
                          isChecked ? "border-purple-500 bg-purple-500" : "border-white/30 bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-white capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={generateScriptIdeas} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isGeneratingIdeas}
          >
            {isGeneratingIdeas ? "Generating..." : "Generate Script Ideas"}
          </Button>
        </div>

        {/* Script Ideas */}
        {scriptIdeas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Script Ideas ({scriptIdeas.length})</h2>
            <p className="text-white/70 mb-4">Explore the generated script ideas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scriptIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-lg cursor-pointer transition-colors bg-[#151F38] hover:bg-[#1f2b4d]"
                  onClick={() => toggleIdeaExpansion(idea.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-grow">
                      {expandedIdeas.includes(idea.id) ? (
                        <ChevronUp className="w-5 h-5 text-white mr-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white mr-2" />
                      )}
                      <p className="text-white">{idea.topic}</p>
                    </div>
                  </div>
                  {expandedIdeas.includes(idea.id) && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-white mb-4">{idea.tweet}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              rateIdea(idea.id, "up")
                            }}
                            className={ideaRatings[idea.id] === "up" ? "text-green-500" : "text-white"}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              rateIdea(idea.id, "down")
                            }}
                            className={ideaRatings[idea.id] === "down" ? "text-red-500" : "text-white"}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRecording(idea.id)
                            }}
                            className={`rounded-full p-2 ${
                              recordingIdea === idea.id ? "bg-red-500 text-white" : "text-white hover:bg-gray-600"
                            }`}
                          >
                            <Mic className="w-4 h-4" />
                          </Button>
                          {recordingIdea === idea.id && (
                            <>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs">
                                {formatTime(recordingTime)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button 
              onClick={handleNext} 
              className="bg-purple-600 hover:bg-purple-700 text-white my-6"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
