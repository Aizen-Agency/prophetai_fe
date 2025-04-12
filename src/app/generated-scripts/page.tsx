"use client"

import { useState, useEffect } from "react"
import { Check, ArrowLeft, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'

type Script = {
  id: string
  title: string
  content: string
  date: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [selectedScripts, setSelectedScripts] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "az" | "za">("newest")
  const [scripts, setScripts] = useState<Script[]>([])

  useEffect(() => {
    // Load scripts from localStorage
    const storedScripts = localStorage.getItem('generatedScripts')
    if (storedScripts) {
      setScripts(JSON.parse(storedScripts))
    }
  }, [])

  const toggleScriptSelection = (scriptId: string) => {
    setSelectedScripts((prev) => {
      if (prev.includes(scriptId)) {
        return prev.filter((id) => id !== scriptId)
      } else {
        return [...prev, scriptId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedScripts.length === scripts.length) {
      setSelectedScripts([])
    } else {
      setSelectedScripts(scripts.map((script) => script.id))
    }
  }

  const handleGenerate = () => {
    if (selectedScripts.length === 0) {
    //   toast({
    //     title: "No scripts selected",
    //     description: "Please select at least one script to generate a video.",
    //     variant: "destructive",
    //   })
    console.log("No scripts selected");
      return
    }

    setIsGenerating(true)

    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
    //   toast({
    //     title: "Videos generated",
    //     description: `Successfully generated ${selectedScripts.length} video${selectedScripts.length > 1 ? "s" : ""}.`,
    //   })
    console.log("Video generated")
    router.push('/your-video')
    }, 2000)
  }

  const sortedScripts = [...scripts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "az":
        return a.title.localeCompare(b.title)
      case "za":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
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
      <Sidebar activeItem="scripts"/>

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
          <h1 className="text-3xl font-semibold text-white">Welcome back, Jessie</h1>
          <p className="text-white/70 text-lg mt-2">Here are your generated scripts</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Card className="bg-white/10 border-none shadow-lg">
              <CardContent className="flex items-center p-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white mr-2 flex items-center justify-center cursor-pointer ${
                    selectedScripts.length === scripts.length ? "bg-white" : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  {selectedScripts.length === scripts.length && <Check className="h-3 w-3 text-black" />}
                </div>
                <Label className="text-white cursor-pointer" onClick={handleSelectAll}>
                  Select All
                </Label>
              </CardContent>
            </Card>
            <div className="text-white/70">
              {selectedScripts.length} of {scripts.length} selected
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-none text-white">
                  Sort by <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/10 border-none text-white">
                <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("oldest")}>Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("az")}>A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("za")}>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleGenerate}
              disabled={selectedScripts.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Videos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Script List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {sortedScripts.map((script) => (
            <Card
              key={script.id}
              className={`bg-white/10 border-none shadow-lg transition-all ${
                selectedScripts.includes(script.id) ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer ${
                    selectedScripts.includes(script.id) ? "bg-white" : ""
                  }`}
                  onClick={() => toggleScriptSelection(script.id)}
                >
                  {selectedScripts.includes(script.id) && <Check className="h-3 w-3 text-black" />}
                </div>
                <CardTitle className="text-white text-lg">{script.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm line-clamp-3 mb-2">
                  {script.content.slice(0, 150)}...
                </p>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  {new Date(script.date).toLocaleDateString()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
